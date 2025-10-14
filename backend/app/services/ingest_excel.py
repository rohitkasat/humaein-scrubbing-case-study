import pandas as pd
from datetime import datetime

COL_MAP = {
    "encounter_type":"encounter_type",
    "service_date":"service_date",
    "national_id":"national_id",
    "member_id":"member_id",
    "facility_id":"facility_id",
    "unique_id":"unique_id",
    "diagnosis_codes":"diagnosis_codes",
    "approval_number":"approval_number",
    "service_code":"service_code",
    "paid_amount_aed":"paid_amount_aed",
}

def read_claims_excel(path: str) -> list[dict]:
    df = pd.read_excel(path, dtype=str)
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    missing = [v for v in COL_MAP.values() if v not in df.columns]
    if missing:
        present = ", ".join(df.columns)
        raise ValueError(f"Missing columns: {missing}. Found: {present}")
    def parse_date(x):
        if pd.isna(x) or not str(x).strip():
            return None
        for fmt in ("%m/%d/%y","%m/%d/%Y","%d/%m/%y","%d/%m/%Y","%Y-%m-%d"):
            try:
                return datetime.strptime(str(x).split()[0], fmt).date()
            except Exception:
                continue
        return None
    records = []
    for _, r in df.iterrows():
        row = {k: r[COL_MAP[k]] if COL_MAP[k] in df.columns else None for k in COL_MAP}
        row["service_date"] = parse_date(row["service_date"])
        try:
            row["paid_amount_aed"] = float(str(row["paid_amount_aed"]).replace(",",""))
        except Exception:
            row["paid_amount_aed"] = 0.0
        records.append(row)
    return records
