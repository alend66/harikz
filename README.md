# HARIKZ Travels

A single-page, scroll-driven website for **HARIKZ** – travel, trips, tour packages and vehicle rental (5, 7, 10, 12 and 17 seaters, open 24x7).

The idea: **you are on a road trip while you scroll.** A real Force Traveller drives along the bottom of the screen, and the sky changes from dawn to day, sunset and night as you move down the page.

## Features

- **Scroll road trip** – the Traveller's wheels spin, the hills scroll with parallax, the van tilts with scroll speed and puffs exhaust. Headlights switch on at night.
- **Living sky** – sun and moon arcs, clouds, stars, birds, a plane, a hot-air balloon and fireflies at night.
- **Top bar** – a km odometer, the current "stop" name and a call button, plus a scroll progress bar.
- **Sections (Stops)**
  1. Hero and welcome (with Traveller photo backdrop)
  2. Services – Travel, Trips, Packages, Rental
  3. Fleet – boarding-pass style cards for each seater size
  4. Postcards – embedded Instagram reels and posts
  5. Destinations – Munnar, Alleppey, Wayanad, Thekkady, Kovalam, Guruvayur
  6. Why ride with us
  7. FAQ
  8. Reservation form and contact
- **Booking form** – fills a WhatsApp message (name, route, date, vehicle) and opens WhatsApp to send it to HARIKZ.
- **Floating WhatsApp button** and click-to-call links.
- Respects `prefers-reduced-motion`.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `style.css` | Design, layout, animations, responsive rules |
| `script.js` | Sky/time-of-day colours, parallax, wheel rotation, reveal-on-scroll, WhatsApp booking, Instagram embed cropping, Traveller background removal |
| `traveller-side.jpg` | Side view of the Traveller used for the driving vehicle (white background is removed in the browser with a canvas) |
| `hero.jpg`, `hills.jpg` | Traveller photos used as background and in the welcome section |

## How it works (short)

- `script.js` reads the scroll position (0 to 1) and blends between colour keyframes for sky and hills.
- The wheel overlays rotate based on scroll distance; the odometer shows `progress x 1240 km`.
- Instagram embeds are cross-origin, so likes/comments cannot be hidden with CSS. The page listens for each embed's height and crops the footer instead.
- The vehicle photo is drawn to a `<canvas>` and the white background is removed by flood-fill from the edges.

## Run locally

No build step is needed. Serve the folder with any static server:

```bash
npx http-server -p 8123
```

Then open <http://127.0.0.1:8123/>. (Opening `index.html` directly also works, but the vehicle background removal needs a server because it reads image pixels.)

## Deploy

It is a plain static site, so it deploys to Vercel with no configuration: import the GitHub repo and deploy with the default settings (no build command, root directory as output).

## Customise

- **Phone / WhatsApp number** – search for `8137037555` / `918137037555` in `index.html` and `script.js`.
- **Instagram posts** – edit the `.pcs` block in the Postcards section of `index.html`.
- **Destinations, FAQ, perks** – edit the matching sections in `index.html`.
- **Colours** – CSS variables at the top of `style.css` and the `KEYS` palette in `script.js`.

## Contact

HARIKZ – Travel · Trips · Packages · Rental  
Call or WhatsApp: **8137037555** (open 24x7)
