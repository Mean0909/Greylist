import json
from pathlib import Path
import pandas as pd

excel_path = Path("data/Grey list.xlsx")
json_path = Path("data/data.json")

df = pd.read_excel(excel_path)
df = df.fillna("")

records = df.to_dict(orient="records")

json_path.parent.mkdir(parents=True, exist_ok=True)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(records)} rows to {json_path}")
