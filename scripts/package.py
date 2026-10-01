"""Create portable source and static-site archives without caches or credentials."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import os

root = Path(__file__).resolve().parents[1]
target = root.parent / 'terracascade-delivery'
target.mkdir(exist_ok=True)
excluded = {'node_modules', '.next', 'out', '.venv', '__pycache__', '.git', 'test-results', 'playwright-report', '.npm-cache', '.cache'}
def source_files():
    for directory, folders, files in os.walk(root):
        folders[:] = [folder for folder in folders if folder not in excluded]
        for name in files:
            yield Path(directory) / name
with ZipFile(target / 'TerraCascade-source.zip', 'w', ZIP_DEFLATED) as archive:
    for item in sorted(source_files()):
        relative = item.relative_to(root)
        if any(part in excluded for part in relative.parts):
            continue
        if item.is_file() and not item.name.endswith('.tsbuildinfo') and (not item.name.startswith('.env') or item.name == '.env.example'):
            archive.write(item, Path('terracascade') / relative)
with ZipFile(target / 'TerraCascade-static-site.zip', 'w', ZIP_DEFLATED) as archive:
    for item in sorted((root / 'out').rglob('*')):
        if item.is_file():
            archive.write(item, item.relative_to(root / 'out'))
for item in target.glob('*.zip'):
    with ZipFile(item) as archive:
        assert archive.testzip() is None
        print(f'{item.name}: {len(archive.namelist())} files, {item.stat().st_size:,} bytes; verified')
