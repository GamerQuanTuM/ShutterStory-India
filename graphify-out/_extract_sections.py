import re, json
from pathlib import Path

report = Path('graphify-out/GRAPH_REPORT.md').read_text(encoding='utf-8')

sections = {}

# God Nodes
m = re.search(r'## God Nodes.*?(?=## |\Z)', report, re.DOTALL)
if m: sections['god_nodes'] = m.group().strip()

# Surprising Connections
m = re.search(r'## Surprising Connections.*?(?=## |\Z)', report, re.DOTALL)
if m: sections['surprising'] = m.group().strip()

# Suggested Questions
m = re.search(r'## Suggested Questions.*?(?=## |\Z)', report, re.DOTALL)
if m: sections['questions'] = m.group().strip()

output_path = Path('graphify-out/_report_sections.json')
output_path.write_text(json.dumps(sections, indent=2), encoding='utf-8')
print(f'Wrote {len(sections)} sections')
