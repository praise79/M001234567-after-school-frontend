# Bright Futures frontend

Vue 3/Vite frontend for the Bright Futures after-school activities coursework.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Use `VITE_USE_MOCK_DATA=true` while building the frontend without the API. This gives the catalogue and booking form isolated sample data.
3. For API integration, set `VITE_USE_MOCK_DATA=false` and set `VITE_API_BASE_URL` to the backend origin, for example `http://localhost:5000`.
4. Run `npm run dev`.

The app uses the browser's native `fetch()` API in `src/services/api.js`. It does not use Axios or XMLHttpRequest.

## Build

Run `npm run build` to create `dist`. `vite.config.js` uses `/after-school-frontend/` as its base path because this project is intended for a GitHub Pages project site with that repository name. Change the value only if the GitHub repository name changes.

For a production build, set `VITE_USE_MOCK_DATA=false` and point `VITE_API_BASE_URL` to the deployed Render backend. Do not use `localhost` or put secrets in frontend environment variables.
