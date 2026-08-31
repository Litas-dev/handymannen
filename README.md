# Handymannen

Nettside for **Handymannen** – håndverker i Oslo, Akershus og Innlandet.
"*Ingen jobb er for liten.*"

Statisk nettside laget med ren HTML/CSS/JS. Kan kjøres på GitHub Pages.

[Se siden](https://litas-dev.github.io/handymannen/)

## Administration (login panel)

The site has a password-protected admin panel at **`/admin/`** (e.g. `https://your-site.com/admin/`).
It is written in PHP and runs on any normal shared/FTP host — there is no database.

After logging in you can:
- **Upload / delete photos** in the gallery.
- **Edit any text** on the website.

The panel is simple and in English. The password is stored only as an encrypted
(bcrypt) hash in `admin/config.php` (created on first use).

### First-time setup
1. Open `https://your-site.com/admin/`.
2. Create a password (min. 6 characters) — it is saved as an encrypted hash.
3. Log in and start editing.

### If you deploy with FTP
Make sure the `admin/` folder and `img/gallery/` folder are **writable** by the
server (the panel needs to write to them). `admin/config.php` is automatically
created when you set the password.

### Local testing
The frontend loads editable text from `content.json`. To test the text-editing
without PHP, serve the folder (e.g. `python3 -m http.server`) and open the site.

## Galleri

Bildene i galleriet hentes automatisk fra `img/gallery/`.

1. Legg prosjektbildene dine i `img/gallery/` (jpg, png, webp, svg …).
2. Kjør: `python3 update-gallery.py` (only needed if you're not using the admin panel).
3. Commit og push. Galleriet oppdateres automatisk – ingen koding nødvendig.

> De gamle `gal-*.svg`-filene er bare plassholdere. Slett dem når du har riktige bilder.
