# EU Connect 2026 planner (unofficial tool)

**Live site:** https://smccawille88.github.io/euconnect26-planner/

A personal schedule builder for **PHUSE EU Connect 2026** (SEC Glasgow, 15–18 November 2026). Describe your role, what you already know well and what you want to learn, and it builds a clash-free plan from all 238 sessions, workshops, panels and posters.

> This is an unofficial tool. It is not run or endorsed by PHUSE.

## Two ways to build a plan

- **Quick match** runs entirely in your browser. It matches your description against topic tags and short summaries of every session. It is instant and free.
- **Build my programme** uses an AI model to read every session and explain each pick in a sentence. It takes about 30 seconds. The ten example descriptions come with ready-made plans, so they appear straight away without an AI call.

## What it does

- Prioritises what you want to learn over what you already know
- Always includes the keynotes, a Sunday hands-on workshop and a few poster picks with suggested visit times
- Adds a few "You may also like" sessions from outside your usual topics
- Shows what else is on at the same time, so you can swap sessions
- Offers a printable TLF-style view, a shareable link and a plain-text copy of your plan

## Data

- Session titles, times, rooms and speakers come from the public EU Connect 2026 agenda, as published on 30 October 2026.
- Topic tags and one-line summaries were written from the public abstracts. Full abstracts stay on the PHUSE pages.
- Later changes to the agenda are not reflected. Always check the official agenda and app.

## Privacy

- **Quick match:** everything runs in your browser. Nothing you type is sent anywhere.
- **Build my programme:** your description is sent, through a small proxy, to the AI provider's API to build the plan. It is not stored by this tool. Don't include personal or confidential details.
- Shared plan links contain only session IDs, not your description.

## How the AI part works

The page never contains an API key. Requests go to a Cloudflare Worker (`worker.js`), which holds the key as a secret, only accepts requests from this site, limits how many plans one visitor can build per hour, and caches the programme text so repeat requests cost less. The model is set on one line at the top of `worker.js`.

## Files

- `index.html`: the whole app in a single file, with the programme data built in
- `.nojekyll`: tells GitHub Pages to serve the file as it is
- `worker.js`: the Cloudflare Worker that passes AI requests on without exposing the key
- `source/`: the agenda data, session summaries, page template and build script used to generate `index.html`. See `source/REBUILD.md` for how to update the agenda, rebuild, and switch the AI part on or off.
