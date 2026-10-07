# baldip.com — living résumé

A single-page site for Baldip-Robin Singh. Plain HTML, CSS and vanilla JavaScript: no framework, no build step. It runs on GitHub Pages at **baldip.com**.

```
/index.html     page shell, meta tags, password gate
/styles.css     all styling (dark default, light mode, responsive, reduced motion)
/app.js         gate, router, rendering, scroll effects, contact form
/data.js        ALL content — the only file you need to edit day to day
/assets/        headshot.jpg (you add it), resume.pdf (placeholder)
/CNAME          baldip.com
```

> **About the password gate:** it is cosmetic, not security. The content ships to every visitor's browser and can be read in `data.js`. Don't put anything confidential on the site. Search engines and link previews only see the gate screen and the meta tags in `index.html`.

## 1. Run it locally

Either open `index.html` directly in a browser, or (closer to how GitHub Pages serves it) run a tiny local server from the project folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The password is `Robin`. The unlock is remembered for the browser tab's session; close the tab (or run `sessionStorage.clear()` in the console) to see the gate again.

## 2. Update content (edit `data.js` only)

Everything you see is rendered from the `window.SITE_DATA` object in `data.js`: profile, bio, chapters, timeline, the "What I do" grid and filters, skills, and contact details. Search the file for `TODO` to find placeholders.

**Example: add a timeline milestone.** Add an object to the `timeline` array in the position you want it to appear:

```js
timeline: [
  // …existing milestones…
  {
    when: "2027",
    title: "Launched the sports analytics newsletter",
    track: "Ventures",
    detail: "Weekly, transparent, data-driven picks with a public track record.",
  },
],
```

Other quick edits:
- **New chapter:** add `{ id, title, lede, body: [..] }` to `chapters`. The `id` must be unique (letters, numbers, dashes); it powers links like `#story/your-id`.
- **New "What I do" item:** add `{ title, tags: ["Ventures"], text, link? }` to `work`. Tags should match names in `filters`.
- **Skills:** each has a `level` from 1 to 5 that drives the meter.

## 3. Change the password

The site stores only the SHA-256 hash of the password, in `data.js` → `profile.passwordHash`. To change it, generate the hash of your new password and paste it in.

macOS / Linux:
```bash
printf '%s' 'YourNewPassword' | shasum -a 256      # macOS
printf '%s' 'YourNewPassword' | sha256sum          # Linux
```

Or in any browser console:
```js
crypto.subtle.digest("SHA-256", new TextEncoder().encode("YourNewPassword"))
  .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("")));
```

Use `printf`, not `echo`, so no trailing newline gets hashed. The password is case-sensitive.

## 4. Deploy to GitHub Pages

1. Create a new public repository on GitHub (for example `baldip.com`).
2. Push these files to the `main` branch, with `index.html` at the repository root:
   ```bash
   git init
   git add .
   git commit -m "First version of baldip.com"
   git branch -M main
   git remote add origin https://github.com/[GITHUB_USERNAME]/baldip.com.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://[GITHUB_USERNAME].github.io/baldip.com/`.

## 5. Point baldip.com at GitHub Pages (Squarespace Domains)

In Squarespace, open **Domains → baldip.com → DNS → DNS Settings**. Remove any default Squarespace records that conflict with `@` or `www`, then add:

| Type  | Host | Data |
|-------|------|------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| CNAME | www  | [GITHUB_USERNAME].github.io |

Then, back in the repo's **Settings → Pages**:

1. Under **Custom domain**, enter `baldip.com` and save. (The `CNAME` file in this repo already contains `baldip.com`, so it stays set between deploys.)
2. Wait for the DNS check to pass. DNS changes can take anywhere from a few minutes to 48 hours.
3. Tick **Enforce HTTPS** once it becomes available (GitHub has to issue the certificate first).

Optional but recommended: verify the domain under your GitHub account's **Settings → Pages → Verified domains** so no one else can claim it.

## 6. Contact form (Formspree)

1. Create a free account at [formspree.io](https://formspree.io) and add a new form.
2. Copy the ID from its endpoint (`https://formspree.io/f/abcdwxyz` → `abcdwxyz`).
3. Paste it into `data.js` → `contact.formspreeId`.

Until then, the form tells visitors to use LinkedIn or email instead.

## 7. Headshot and résumé

- Add your photo as `assets/headshot.jpg` (a 4:5 or square portrait, around 800px wide). Until the file exists, a styled "BRS" placeholder appears.
- Replace `assets/resume.pdf` with your real résumé.
