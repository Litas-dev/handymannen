# Handymannen – Presentasjon (Digital Signage)

A full-screen, auto-running presentation for big screens (TV, monitors, kiosk).
Just open the folder on your domain and it plays on a loop, forever.

**URL:** `https://your-domain.com/presentation/`

---

## How it works

- **Full-screen** slides with a Ken Burns zoom effect on each photo
- **Auto-plays on a loop** forever (8 seconds per slide, change in `app.js`)
- Text **fades and slides in** elegantly on each slide
- Brand colors (cyan / red) match the website
- Works with your existing gallery photos — just drop images into `img/gallery/`

## How to use

1. **Upload** the whole `presentation/` folder to your host via FTP into the same
   place as your main site (so `../img/gallery/` path still matches).
2. Open `https://your-domain.com/presentation/`.

> **Important:** the presentation folder loads photos from `../img/gallery/`
> (the main site's gallery). Make sure the `img/gallery/` folder exists one level
> up from `presentation/`.

## Editing the slides

Open `presentation/app.js` and edit the `SLIDES` array near the top.

Each slide has:
- `image` — the background photo (use `IMG + "2.jpg"` for gallery images, or `HERO`)
- `kicker` — small text above the title
- `title` — big headline (use `<span class='accent'>` for cyan word, `accent-red` for red)
- `text` — description paragraph
- `align` — `"left"` (default), `"center"`, or `"right"`
- `list` — optional array of service chips (only on the kind `"content"` slide)
- `kind` — `"brand"`, `"content"`, `"stat"` (big number), or `"contact"`

To change the timing/speed, edit `autoDelay` in `app.js` (milliseconds per slide).

## Extra controls (also useful for a kiosk)

- `?start=4` — begin on slide index 4 (0-based)
- `?pause=1` — do not auto-play (stays on first slide, you navigate manually)

Example: `https://your-domain.com/presentation/?pause=1`

On screen you can also:
- **Click** right/left sides of the screen to go next/prev
- Use **arrow keys** to navigate, **space** for next
- **P** to pause/play, **F** for fullscreen
- Swipe on a touch screen
