import re

NATIONAL_ID_RE = re.compile(r"^[A-Z0-9]{6,12}$")
MEMBER_ID_RE = re.compile(r"^[A-Z0-9]{6,12}$")
FACILITY_ID_RE = re.compile(r"^[A-Z0-9]{6,12}$")
UNIQUE_ID_RE = re.compile(r"^[A-Z0-9-]{6,20}$")

def is_valid(pattern, value: str) -> bool:
    return bool(pattern.match(value or ""))

def validate_ids(row: dict) -> list[dict]:
    errs = []
    if not is_valid(NATIONAL_ID_RE, row.get("national_id","")):
        errs.append({"rule":"TECH-ID-001","field":"national_id","msg":"Invalid national_id format"})
    if not is_valid(MEMBER_ID_RE, row.get("member_id","")):
        errs.append({"rule":"TECH-ID-002","field":"member_id","msg":"Invalid member_id format"})
    if not is_valid(FACILITY_ID_RE, row.get("facility_id","")):
        errs.append({"rule":"TECH-ID-003","field":"facility_id","msg":"Invalid facility_id format"})
    if not is_valid(UNIQUE_ID_RE, row.get("unique_id","")):
        errs.append({"rule":"TECH-ID-004","field":"unique_id","msg":"Invalid unique_id format"})
    return errs
