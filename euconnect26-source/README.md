# EU Connect 2026 planner (beta)

**Live site:** https://smccawille88.github.io/euconnect26-planner/

A personal schedule builder for **PHUSE EU Connect 2026** (SEC Glasgow, 15–18 November 2026). Describe your role, what you already know well and what you want to learn, and it builds a clash-free plan from all 238 sessions, workshops, panels and posters.

> A personal open-source community project, currently in beta and independent of PHUSE's official tools.

## Writing your description

- **Help me write it** lets you tap your role, experience and the topics you know or want to learn, and writes the description for you. It runs in your browser.
- **Polish my description with AI** tidies rough notes into a clear description, without adding anything you didn't say. There is an Undo if you prefer your own wording.

## Two ways to build a plan

- **Quick match** runs entirely in your browser. It matches your description against topic tags and short summaries of every session. It is instant and free.
- **Build my programme** uses an AI model to read every session and explain each pick in a sentence. It takes about 30 seconds. The ten example descriptions come with ready-made plans, so they appear straight away without an AI call.

## What it does

- Prioritises what you want to learn, while keeping a few sessions on what you already know so you stay current
- Only uses the days you say you're attending
- Lets you mark sessions "More like this" or "Less like this" and rebuild the plan with that feedback
- Always includes the keynotes, a Sunday hands-on workshop and a few poster picks with suggested visit times
- Adds a few "You may also like" sessions from outside your usual topics
- Shows what else is on at the same time, so you can swap sessions
- Shows a CONSORT-style flow above your plan: how many sessions were screened, matched your interests and made it into your plan
- Gives poster visit times with a ±5 minute visit window
- Lets you download your plan as a PDF, in a standard layout or as a TLF, or copy it as a shareable link or plain text
- In the TLF view, can also show your plan as ARD (Analysis Results Data in long format, following CDISC Analysis Results Standards), just for fun
- Offers the full agenda as a PDF too, in standard or TLF format

## Data

- Session titles, times, rooms and speakers come from the public EU Connect 2026 agenda, as published on 30 October 2026.
- Topic tags and one-line summaries were written from the public abstracts. Full abstracts stay on the PHUSE pages.
- Later changes to the agenda are not reflected. Always check the official agenda and app.

## Privacy

- **Quick match:** everything runs in your browser. Nothing you type is sent anywhere.
- **Build my programme and Polish my description:** your description is sent, through a small proxy, to the AI provider's API to build the plan or tidy the text. It is not stored by this tool. Don't include personal or confidential details.
- Shared plan links contain only session IDs, not your description.

## How the AI part works

The page never contains an API key. Requests go to a Cloudflare Worker (`worker.js`), which holds the key as a secret, only accepts requests from this site, limits how many plans one visitor can build per hour, and caches the programme text so repeat requests cost less. The model is set on one line at the top of `worker.js`.

## Files

- `index.html`: the whole app in a single file, with the programme data built in
- `.nojekyll`: tells GitHub Pages to serve the file as it is
- `worker.js`: the Cloudflare Worker that passes AI requests on without exposing the key
- `source/`: the agenda data, session summaries, page template and build script used to generate `index.html`. See `source/REBUILD.md` for how to update the agenda, rebuild, and switch the AI part on or off.
