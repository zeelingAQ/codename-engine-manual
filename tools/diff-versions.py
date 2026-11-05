#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
diff-versions.py —— 对比两个文件夹（旧版 / 新版），提取更新内容。

用途：把「上一版资料」和「这一版资料」放一起，自动算出：
    · 新增（added）    · 修改（modified）    · 删除（removed）
    · 每个文件的增删行数、以及逐行 diff 片段

三种用法
--------
1) 图形界面选文件夹（双击运行，不传参数）：
       python tools/diff-versions.py

2) 命令行指定：
       python tools/diff-versions.py --old ./v1.1 --new ./v1.2 --out changes.md

3) 同时给网页用（生成 JSON，供版本对比区渲染）：
       python tools/diff-versions.py --old ./v1.1 --new ./v1.2 --json changes.json --html changes.html

说明
----
· 只对「文本类」文件做逐行 diff；图片/音频/二进制只标记「已变更」。
· 默认忽略 .git / node_modules / __pycache__ / .DS_Store 等。
· 编码统一按 UTF-8 读；读不了就当二进制处理。
"""

from __future__ import annotations

import argparse
import difflib
import html
import json
import os
import sys
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple

IGNORE_DIRS = {".git", "node_modules", "__pycache__", ".idea", ".vscode", "dist", "build"}
IGNORE_FILES = {".DS_Store", "Thumbs.db", "desktop.ini"}

TEXT_EXT = {
    ".md", ".txt", ".json", ".js", ".mjs", ".cjs", ".ts", ".css", ".html", ".htm",
    ".xml", ".ini", ".cfg", ".yml", ".yaml", ".toml", ".py", ".hx", ".hxml",
    ".sh", ".bat", ".ps1", ".java", ".c", ".h", ".cpp", ".cs", ".lua",
}
MAX_TEXT_BYTES = 2 * 1024 * 1024   # 超过 2MB 的文本也不做逐行 diff


@dataclass
class FileChange:
    path: str
    status: str                  # added | modified | removed
    is_binary: bool = False
    added_lines: int = 0
    removed_lines: int = 0
    diff: str = ""               # unified diff（仅文本）


def walk(root: str) -> Dict[str, str]:
    """返回 {相对路径: 绝对路径}"""
    table: Dict[str, str] = {}
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for name in files:
            if name in IGNORE_FILES:
                continue
            full = os.path.join(base, name)
            rel = os.path.relpath(full, root).replace("\\", "/")
            table[rel] = full
    return table


def read_text(path: str) -> Optional[str]:
    """能当文本读就返回内容，否则 None"""
    try:
        if os.path.getsize(path) > MAX_TEXT_BYTES:
            return None
        with open(path, "r", encoding="utf-8", errors="strict") as f:
            return f.read()
    except (UnicodeDecodeError, OSError):
        return None


def looks_text(path: str, old_root: str, new_root: str) -> bool:
    ext = os.path.splitext(path)[1].lower()
    if ext in TEXT_EXT:
        return True
    # 无扩展名（如 LICENSE）也尝试一次
    return ext == ""


def diff_file(rel: str, old_path: Optional[str], new_path: Optional[str]) -> FileChange:
    if old_path and not new_path:
        return FileChange(rel, "removed", is_binary=not looks_text(rel, "", ""))
    if new_path and not old_path:
        return FileChange(rel, "added", is_binary=not looks_text(rel, "", ""))

    assert old_path and new_path
    a = read_text(old_path)
    b = read_text(new_path)
    if a is None or b is None:
        return FileChange(rel, "modified", is_binary=True)

    al = a.splitlines()
    bl = b.splitlines()
    if al == bl:
        return FileChange(rel, "modified", added_lines=0, removed_lines=0, diff="")

    udiff = list(difflib.unified_diff(
        al, bl,
        fromfile=f"a/{rel}", tofile=f"b/{rel}",
        lineterm="", n=3,
    ))
    added = sum(1 for ln in udiff if ln.startswith("+") and not ln.startswith("+++"))
    removed = sum(1 for ln in udiff if ln.startswith("-") and not ln.startswith("---"))
    return FileChange(rel, "modified", added_lines=added, removed_lines=removed,
                      diff="\n".join(udiff))


def compare(old_root: str, new_root: str) -> List[FileChange]:
    old = walk(old_root) if old_root else {}
    new = walk(new_root) if new_root else {}

    changes: List[FileChange] = []
    for rel in sorted(set(old) | set(new)):
        o = old.get(rel)
        n = new.get(rel)
        if o and n:
            changes.append(diff_file(rel, o, n))
        elif n:
            changes.append(diff_file(rel, None, n))
        else:
            changes.append(diff_file(rel, o, None))

    # 无变化的 modified 去掉
    return [c for c in changes if not (c.status == "modified" and c.is_binary is False
                                       and c.added_lines == 0 and c.removed_lines == 0
                                       and c.diff == "")]


def stats(changes: List[FileChange]) -> Dict[str, int]:
    return {
        "added": sum(1 for c in changes if c.status == "added"),
        "modified": sum(1 for c in changes if c.status == "modified"),
        "removed": sum(1 for c in changes if c.status == "removed"),
        "lines_added": sum(c.added_lines for c in changes),
        "lines_removed": sum(c.removed_lines for c in changes),
    }


def to_markdown(changes: List[FileChange], old_root: str, new_root: str, max_diff_lines: int = 200) -> str:
    s = stats(changes)
    out = []
    out.append("# 更新对比报告\n")
    out.append(f"- 旧版：`{old_root or '（空）'}`")
    out.append(f"- 新版：`{new_root or '（空）'}`")
    out.append(f"- 新增 **{s['added']}** 个文件 / 修改 **{s['modified']}** / 删除 **{s['removed']}**")
    out.append(f"- 代码行：+{s['lines_added']} / -{s['lines_removed']}\n")

    groups = [("added", "新增文件"), ("modified", "修改文件"), ("removed", "删除文件")]
    for key, title in groups:
        items = [c for c in changes if c.status == key]
        if not items:
            continue
        out.append(f"## {title}（{len(items)}）\n")
        for c in items:
            flag = "（二进制）" if c.is_binary else f"+{c.added_lines}/-{c.removed_lines}"
            out.append(f"- `{c.path}` — {flag}")
        out.append("")

    # 逐文件 diff
    texts = [c for c in changes if c.diff]
    if texts:
        out.append("## 逐行改动\n")
        for c in texts:
            lines = c.diff.splitlines()
            shown = lines[:max_diff_lines]
            out.append(f"### `{c.path}`\n")
            out.append("```diff")
            out.extend(shown)
            out.append("```")
            if len(lines) > max_diff_lines:
                out.append(f"> 其余 {len(lines) - max_diff_lines} 行已省略\n")
    return "\n".join(out)


def to_json(changes: List[FileChange], old_root: str, new_root: str) -> str:
    payload = {
        "old": old_root,
        "new": new_root,
        "stats": stats(changes),
        "files": [asdict(c) for c in changes],
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def to_html(changes: List[FileChange], old_root: str, new_root: str) -> str:
    """生成一段可以直接贴进网页的 HTML 片段"""
    s = stats(changes)
    rows = []
    for c in changes:
        cls = {"added": "add", "modified": "mod", "removed": "del"}[c.status]
        rows.append(
            f'<li class="{cls}"><code>{html.escape(c.path)}</code>'
            f'<span>{c.status} · +{c.added_lines}/-{c.removed_lines}</span></li>'
        )
    return (
        f'<section class="diffreport">\n'
        f'  <p class="diffreport__sum">新增 {s["added"]} · 修改 {s["modified"]} · '
        f'删除 {s["removed"]} · 行 +{s["lines_added"]}/-{s["lines_removed"]}</p>\n'
        f'  <ul class="diffreport__list">\n    ' + "\n    ".join(rows) + "\n  </ul>\n</section>"
    )


def pick_folder(title: str) -> str:
    try:
        import tkinter as tk
        from tkinter import filedialog
    except Exception:
        print("未安装 tkinter，无法弹出选择框；请用 --old / --new 指定路径。", file=sys.stderr)
        sys.exit(2)
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)
    path = filedialog.askdirectory(title=title)
    root.destroy()
    return path or ""


def main() -> int:
    ap = argparse.ArgumentParser(description="对比两个文件夹，提取更新内容")
    ap.add_argument("--old", help="旧版文件夹（可以不存在）")
    ap.add_argument("--new", help="新版文件夹")
    ap.add_argument("--out", help="输出 Markdown 文件（默认打印到终端）")
    ap.add_argument("--json", help="输出 JSON")
    ap.add_argument("--html", help="输出 HTML 片段")
    ap.add_argument("--max-diff-lines", type=int, default=200, help="每个文件最多保留多少行 diff")
    args = ap.parse_args()

    old_root = args.old
    new_root = args.new

    if not old_root:
        old_root = pick_folder("选择【旧版】文件夹（取消则视为空）")
    if not new_root:
        new_root = pick_folder("选择【新版】文件夹")
        if not new_root:
            print("没有选择新版文件夹，退出。", file=sys.stderr)
            return 1

    for label, p in (("旧版", old_root), ("新版", new_root)):
        if p and not os.path.isdir(p):
            print(f"{label}路径不存在或不是文件夹：{p}", file=sys.stderr)
            return 1

    changes = compare(old_root, new_root)
    md = to_markdown(changes, old_root, new_root, args.max_diff_lines)

    if args.out:
        with open(args.out, "w", encoding="utf-8", newline="\n") as f:
            f.write(md)
        print(f"已写出 Markdown：{args.out}")
    else:
        print(md)

    if args.json:
        with open(args.json, "w", encoding="utf-8", newline="\n") as f:
            f.write(to_json(changes, old_root, new_root))
        print(f"已写出 JSON：{args.json}")

    if args.html:
        with open(args.html, "w", encoding="utf-8", newline="\n") as f:
            f.write(to_html(changes, old_root, new_root))
        print(f"已写出 HTML：{args.html}")

    s = stats(changes)
    print(f"\n合计：新增 {s['added']} / 修改 {s['modified']} / 删除 {s['removed']}；"
          f"行 +{s['lines_added']}/-{s['lines_removed']}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
