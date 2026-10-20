#!/usr/bin/env python3
"""Strip compression timestamp suffixes from EmoPose video filenames.

Example:
  01_agreeing_high_five_20260713_22401154.mp4
  -> 01_agreeing_high_five.mp4
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


TIMESTAMP_SUFFIX = re.compile(
    r"^(?P<base>.+)_\d{8}_\d{6,9}(?P<ext>\.mp4)$",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class RenameOp:
    source: Path
    target: Path


def default_video_root() -> Path:
    return Path(__file__).resolve().parents[1] / "static" / "videos"


def strip_timestamp_name(path: Path) -> Path | None:
    match = TIMESTAMP_SUFFIX.match(path.name)
    if not match:
        return None
    return path.with_name(f"{match.group('base')}{match.group('ext')}")


def collect_ops(root: Path) -> list[RenameOp]:
    ops: list[RenameOp] = []
    for path in sorted(root.rglob("*.mp4")):
        target = strip_timestamp_name(path)
        if target is not None and target != path:
            ops.append(RenameOp(source=path, target=target))
    return ops


def unique_backup_path(path: Path) -> Path:
    backup = path.with_name(f"{path.name}.bak")
    if not backup.exists():
        return backup

    index = 1
    while True:
        candidate = path.with_name(f"{path.name}.bak{index}")
        if not candidate.exists():
            return candidate
        index += 1


def apply_op(op: RenameOp, on_conflict: str, dry_run: bool) -> str:
    if op.target.exists():
        if on_conflict == "skip":
            return "skip target-exists"

        if on_conflict == "replace":
            if dry_run:
                return "replace target"
            op.source.replace(op.target)
            return "replaced"

        if on_conflict == "backup":
            backup = unique_backup_path(op.target)
            if dry_run:
                return f"backup target -> {backup.name}"
            op.target.rename(backup)
            op.source.rename(op.target)
            return f"backed-up {backup.name}"

        raise ValueError(f"Unknown conflict policy: {on_conflict}")

    if dry_run:
        return "rename"
    op.source.rename(op.target)
    return "renamed"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Remove trailing _YYYYMMDD_HHMMSS-style suffixes from .mp4 files.",
    )
    parser.add_argument(
        "root",
        nargs="?",
        type=Path,
        default=default_video_root(),
        help="Directory to scan recursively. Defaults to EmoPose/static/videos.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Actually rename files. Without this flag the script only previews changes.",
    )
    parser.add_argument(
        "--on-conflict",
        choices=("skip", "replace", "backup"),
        default="skip",
        help=(
            "What to do if the timestamp-free filename already exists: "
            "skip, replace it, or move it to .bak first."
        ),
    )
    args = parser.parse_args()

    root = args.root.resolve()
    if not root.exists():
        raise SystemExit(f"Video root does not exist: {root}")
    if not root.is_dir():
        raise SystemExit(f"Video root is not a directory: {root}")

    ops = collect_ops(root)
    if not ops:
        print(f"No timestamp-suffixed mp4 files found under: {root}")
        return 0

    dry_run = not args.apply
    mode = "DRY-RUN" if dry_run else "APPLY"
    print(f"{mode}: {len(ops)} timestamp-suffixed mp4 file(s) found under {root}")
    print(f"Conflict policy: {args.on_conflict}")

    counts: dict[str, int] = {}
    for op in ops:
        status = apply_op(op, args.on_conflict, dry_run)
        counts[status] = counts.get(status, 0) + 1
        print(f"[{status}] {op.source.relative_to(root)} -> {op.target.relative_to(root)}")

    print("Summary:")
    for status, count in sorted(counts.items()):
        print(f"  {status}: {count}")

    if dry_run:
        print("Preview only. Re-run with --apply to rename files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
