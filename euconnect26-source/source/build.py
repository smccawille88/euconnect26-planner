"""Rebuild index.html for the EU Connect planner.

Usage (from this folder):  python build.py
Reads sessions.tsv, summaries.tsv and template.html, and writes ../index.html.
Needs only standard Python 3, no extra packages.
"""
import json, re, pathlib

HERE = pathlib.Path(__file__).parent

# Topic tags. The numbers in the "tags" column of sessions.tsv refer to positions in this list (0 = R).
TAGS = ["R","Python","Shiny","Open source","GxP / compliance","Validation / QC","AI / LLMs","Agentic AI","CDISC","ADaM",
        "Data engineering","Automation","Governance / strategy","SDTM","Define-XML","USDM / digital protocol","Metadata",
        "Regulatory submission","Package validation / risk","Data visualisation","Leadership / careers","Quarto / reporting",
        "Safety","ARS / ARD","Data management / EDC","SAS","pharmaverse / admiral","RWE / RWD","Data transparency / privacy",
        "HTA / market access","Cloud / platforms","Training / upskilling","Digital health / wearables","SEND / nonclinical",
        "Oncology","Statistics / estimands","RAG / retrieval","Machine learning"]

# Job titles are dropped from the speaker list so only names and organisations show.
JOB = re.compile(r"(Director|Manager|Lead\b|Programmer|Scientist|Consultant|Specialist|Head\b|Officer|Engineer|Statistician|"
                 r"Analyst|CEO|COO|Coordinator|Developer|Architect|Strategist|Advocate|Expert|Student|President|Co-Chair|"
                 r"Team lead|Data Manager|Biostatistician|Clinical Programmer|Strategic Solutions|Technical Sales|Senior Associate)", re.I)

def read_tsv(name):
    lines = (HERE / name).read_text(encoding="utf-8").splitlines()
    return [l.split("\t") for l in lines[1:] if l.strip()]

summaries = {r[0]: r[1] for r in read_tsv("summaries.tsv")}
rows = []
for f in read_tsv("sessions.tsv"):
    f += [""] * (11 - len(f))
    sid, day, tm, code, stream, room, lvl, spons, title, people, tags = f[:11]
    start, _, end = tm.partition("-")
    ppl = []
    for p in (x.strip() for x in people.split("|")):
        if p and not JOB.search(p) and p not in ppl:
            ppl.append(p)
    tg = sorted({int(t) for t in tags.split(".") if t.strip()})
    rows.append([sid, int(day), start, end or start, code, stream, room, lvl, spons, title,
                 " · ".join(ppl), tg, summaries.get(sid[:8] if sid else "KEY" + day, "")])

rows.sort(key=lambda r: (r[1], r[2], r[5], r[4]))
tpl = (HERE / "template.html").read_text(encoding="utf-8")
# Optional: put the Cloudflare Worker address in proxy_url.txt to switch on "Build my programme".
proxy = HERE / "proxy_url.txt"
if proxy.exists() and proxy.read_text(encoding="utf-8").strip():
    tpl = tpl.replace('const PROXY_URL = "";', 'const PROXY_URL = ' + json.dumps(proxy.read_text(encoding="utf-8").strip()) + ';')
out = tpl.replace("/*__DATA__*/null", json.dumps({"tags": TAGS, "s": rows}, ensure_ascii=False, separators=(",", ":")))
(HERE.parent / "index.html").write_text(out, encoding="utf-8")
missing = [r[9] for r in rows if r[0] and not r[12]]
print(f"Wrote index.html with {len(rows)} sessions.")
if missing:
    print(f"{len(missing)} session(s) have no summary yet:", *missing, sep="\n  ")
