# LlamaStay

A shearing record book for llamas. Each entry tracks a llama's name, fiber
color, the date it was last sheared, and how much wool came off. Records go
past due after a year and get stamped.

Go + PocketBase on the back, React + Redux on the front.

## Requirements

- [Go](https://go.dev/doc/install) 1.27 or newer
- [Node](https://nodejs.org) 20.19+ or 22.12+

## Getting started

```bash
npm install     # installs the frontend workspace
npm run seed    # creates the database and adds six sample llamas
npm run dev     # starts the API on :8090 and the app on :5173
```

Open http://localhost:5173.

`npm run seed` is safe to re-run — it does nothing if the ledger already has
records. To start over, delete `backend/pb_data/` and seed again.

| Command | What it does |
|---|---|
| `npm run dev` | Runs the API and the web app together |
| `npm run seed` | Fills an empty ledger with sample data |
| `npm run smoke` | Checks the API and the ledger rules against a running backend |
| `npm run build` | Production build of both halves |

## How the code is organized

```
backend/     Go. PocketBase as a library, so it builds to one binary.
  main.go         server, the create hook, and the shear endpoint
  seed.go         the `seed` command
  migrations/     schema, applied automatically on startup
frontend/    React + Redux on Vite.
```

The frontend is layered by what each piece needs to know:

| Layer | Path | Knows about |
|---|---|---|
| Helpers | `src/lib/` | Colors, the overdue rule, entry numbers and date formatting are pure functions. `notice.jsx` is the exception — it owns the stamped notices the other layers raise. |
| Presentation | `src/components/ledger/` | Props only. No Redux, no network. |
| Containers | `src/components/*.jsx` | Redux and dispatch. They resolve data and hand plain props down. |

`src/lib/llama.js` holds `FIBER_COLORS`, the single source for both the form
dropdown and the swatch tint. It has to stay in step with the `color` options
in `backend/migrations/`, and `npm run smoke` asserts that it does.

## Data

One collection, `llamas`:

| Field | Type | Notes |
|---|---|---|
| `id` | string | 15 characters, generated |
| `name` | text | required, max 100 |
| `color` | select | one of the eleven fiber colors |
| `lastShear` | date | see the note below |
| `lastShearAmount` | number | integer, millimeters |

PocketBase returns dates as UTC midnight with a space separator —
`2026-09-04 00:00:00.000Z`, not `...T00:00:00Z`. Two things fall out of that,
both handled in `src/lib/dates.js`: splitting on `"T"` does not work, and
formatting without `timeZone: 'UTC'` renders the previous day for anyone west
of UTC.

## Shearing

Wool grows at 0.3mm a day. The calculation lives on the server so there is one
copy of the rule:

```
POST /api/llamas/{id}/shear
```

It sets `lastShearAmount` from the time elapsed since `lastShear`, resets
`lastShear` to now, and returns the updated record.

## Known gaps

- **No authentication.** The collection's API rules are open, so anyone who can
  reach the server can read and write every record. Fine bound to localhost;
  it needs auth before going anywhere else.
- **Entry numbers are positional.** They come from a record's place in creation
  order rather than a stored column, so deleting an entry renumbers the ones
  after it.
- The PocketBase admin UI is at http://127.0.0.1:8090/_/ and needs a superuser:
  `cd backend && go run . superuser create <email> <password>`.
