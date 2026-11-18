# Vercel and Neon

The site builds from the original V2 homepage plus the page fragments in
site/pages. Shared styling and interactions are in site/site.css and
site/site.js.

    npm install
    npm run check
    npm test
    npm run dev

The local preview runs at http://127.0.0.1:8770.

Vercel uses vercel.json, builds dist, and deploys the Node endpoints in
api. Configure these runtime values in the Vercel project.

- DATABASE_URL from the owned Neon project.
- RATE_LIMIT_SECRET, a server-only random value.
- RUSH_SEASON, the recruitment cycle identifier.
- SITE_URL, the public origin used for canonical links and the sitemap.

Keep local values in ignored .env.local. To initialize an empty Neon
database or safely retry the existing migration, run npm run db:migrate.

GET /api/health returns 200 with ready true only when the real signup table
is reachable. The form exposes no listing of applicants. It deduplicates
lowercase email plus recruitment cycle, retains recorded consent, and allows
120 requests per ten-minute connection window to accommodate shared campus Wi-Fi.

Production is [pct-zeta-rho.vercel.app](https://pct-zeta-rho.vercel.app).
The Vercel project is racing-piano-j8yzm5u. Its production settings point
to the owner's Neon project pct-zeta-rho. The connection was rotated when
the database was claimed. Keep the credentials in the provider settings.

Publish from the pct/vercel-neon-site branch and the linked Vercel project
using an authenticated CLI with `vercel deploy --prod`. GitHub Pages uses
the repository’s separate main branch. After a production release check
/api/health and submit a synthetic interest entry to verify the save.
