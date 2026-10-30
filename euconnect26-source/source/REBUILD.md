# How to update and rebuild the planner

Everything the site needs is generated from the files in this folder into one file, `../index.html`. There is no server and no database.

## Files

| File | What it holds |
|---|---|
| `sessions.tsv` | One row per session: times, rooms, speakers, topic tags |
| `summaries.tsv` | One-line summary per session, shown when you hover over a title |
| `template.html` | The page itself (layout, styles, matching logic, animations) |
| `build.py` | Combines the three files above into `../index.html` |

Edit the `.tsv` files in Excel or any text editor, but keep them **tab-separated** and saved as **UTF-8**.

## Rebuild

1. Make your changes to `sessions.tsv` and/or `summaries.tsv`.
2. From this folder, run: `python build.py` (any Python 3, no extra packages needed).
3. It writes a new `index.html` one level up and lists any sessions that are missing a summary.
4. Upload the new `index.html` to the site. On GitHub Pages it goes live within a minute or two.

## sessions.tsv columns

| Column | Example | Notes |
|---|---|---|
| `id` | `b5defd5d-94c8-4318-b7f4-c5d89984880f` | The session ID from the PHUSE agenda. Must be unique. Leave blank only for keynotes. Shared plan links use the first 6 characters. |
| `day` | `16` | Day of November 2026 (15 to 18) |
| `time` | `11:30-12:00` | Start and end, 24-hour, local time (GMT) |
| `code` | `ML02` | Paper code. Leave blank for workshops and keynotes. |
| `stream` | `Machine Learning, AI & Large Language Models` | Stream name, without the code in brackets |
| `room` | `Boisdale 2` | |
| `level` | `B` | `B`, `I` or `A` for Beginner, Intermediate, Advanced. Blank if not given. |
| `sponsor` | `Posit` | Sponsors of workshops only |
| `title` | | Session title |
| `people` | `Name\|Organisation\|Name\|Organisation` | Speakers and organisations separated by `\|`. Job titles are dropped automatically. |
| `tags` | `5.6.11.19` | Topic tag numbers separated by full stops. See the list in `build.py` (0 = R, 1 = Python, 6 = AI / LLMs, and so on). |

Special streams:
- `Keynote` sessions are always added to every plan.
- `Poster Presentations` are grouped into the poster section and the poster figure.
- `Hands-on Workshops` show as `HOW` in the TLF view.

## summaries.tsv columns

| Column | Notes |
|---|---|
| `id8` | First 8 characters of the session `id` |
| `summary` | One or two plain sentences on what the talk covers. Write it in your own words rather than copying the abstract. |

## Adding or changing a session

- **New session:** add a row to `sessions.tsv` with its ID, tags and details, and add a row to `summaries.tsv`. Without tags or a summary it can still be found by title words, but it will match less often.
- **Changed time or room:** edit the row in `sessions.tsv`. Shared plan links keep working because they use the session ID.
- **Withdrawn session:** delete its row. Any shared plan link that included it simply skips it.

## Moving to an official version

To turn this into an official PHUSE page, edit `template.html`:
- Remove the `Unofficial demo · not an official PHUSE tool` label (search for `demo-flag`) and change the footer wording.
- Update the "as published 2026-10-30" date in the footer and TLF footnotes when the data is refreshed.

## Getting fresh agenda data

The easiest source is an export of the session list from the event system (Cvent), with titles, times, rooms, codes, speakers and abstracts. Map its columns onto `sessions.tsv` above. Topic tags and summaries for new sessions need adding by hand, or with help from an AI assistant reading the abstracts.
