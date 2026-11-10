# Freshers 2026 – Digital Invitation
Vidya Dayini College of Information Technology & Management · 14 November 2026

## Run locally
Open the folder in VS Code and use the Live Server extension on index.html,
or run `npx serve .` (or `python3 -m http.server`) and open the shown address.
(Opening index.html by double-click also works, but a server is better for audio.)

## Update event details
Open script.js and edit the CONFIG block at the top:
- time and venue are shown in the details card
- eventDate: the countdown target; dateText: the text shown

## Replace music
Put your piano track at assets/music/piano.mp3 (keep the file name, under ~5 MB).
Music is not included; use a track you have the right to use.

## Replace gallery images
Add photos to assets/images/gallery/ (JPG/WebP, ~1200px wide) and list them in
CONFIG.galleryImages in script.js.

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. Go to vercel.com, click Add New > Project, import the repo.
3. Framework preset: Other. No build command, output directory: leave empty (root).
4. Click Deploy, then share the .vercel.app link.
(Alternative: `npm i -g vercel`, then run `vercel` inside this folder.)
