# EU Connect 2026 planner (unofficial demo)

**Live demo:** https://smccawille88.github.io/euconnect26-planner/

A prototype personal schedule builder for **PHUSE EU Connect 2026** (SEC Glasgow, 15–18 November 2026). Describe your role, what you already know well and what you want to learn, and it builds a clash-free plan from all 238 sessions, workshops, panels and posters.

> This is an unofficial demo built to show the idea. It is not an official PHUSE tool.

## What it does

- Matches your description against topic tags and short summaries of every session
- Prioritises what you want to learn over what you already know
- Adds a few "You may also like" sessions from outside your usual topics
- Shows what else is on at the same time, so you can swap sessions
- Offers a printable TLF-style view and a shareable link to your plan

## Data

- Session titles, times, rooms and speakers come from the public EU Connect 2026 agenda, as published on 30 October 2026.
- Topic tags and one-line summaries were written from the public abstracts. Full abstracts stay on the PHUSE agenda.
- Later changes to the agenda are not reflected. Always check the official agenda and app.

## Privacy

Everything runs in your browser. Nothing you type is stored or sent anywhere.

## Files

- `index.html`: the whole app in a single file, with the programme data built in
- `.nojekyll`: tells GitHub Pages to serve the file as it is
- `source/`: the agenda data, session summaries, page template and build script used to generate `index.html`. See `source/REBUILD.md` for how to update the agenda and rebuild.
