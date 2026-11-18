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

Keep local values in ignored .env.local. To initialize an empty Neon
database or safely retry the existing migration, run npm run db:migrate.

GET /api/health returns 200 with ready true only when the real signup table
is reachable. The form exposes no listing of applicants. It deduplicates
lowercase email plus recruitment cycle, retains recorded consent, and allows
120 requests per ten-minute connection window to accommodate shared campus Wi-Fi.

For a permanent deployment, claim the temporary Vercel project and connect
the Git repository or deploy from an authenticated Vercel account. Claiming
the temporary Neon project rotates its connection credentials. Retrieve the
new connection string from the owned Neon project, update Vercel's
DATABASE_URL, and redeploy before sending recruitment traffic to the form.

Actual account credentials and private claim links are outside the source tree.
