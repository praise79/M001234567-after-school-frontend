# Praise frontend

This is a static Vue 3 frontend made from ordinary HTML, CSS, and JavaScript files. Vue is loaded from the pinned CDN global build; there is no Vite project, Node dependency, Single File Component import, or frontend build step.

The entry pages are `index.html`, `home.html`, `activities.html`, `cart.html`, `activity-details.html`, and `booking-confirmation.html`. Shared styling is in `styles.css`, and the shared Vue app/API logic is in `app.js`.

## Run locally

Open `index.html` through a small HTTP server. Browsers block some API requests from a `file://` URL, so use VS Code Live Server or Python's built-in server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. The page calls `https://m001234567-after-school-toot.onrender.com` by default. To use another API origin, edit the `apiBaseUrl` constant near the top of `app.js`.

The app uses the browser's native `fetch()` API with Promise handling. It does not use Axios or XMLHttpRequest. The lessons page loads ten lessons, sends search and teacher filters to the backend, supports subject/location/price/spaces sorting, and updates remaining spaces through `PUT /lessons/:id`. The cart is a separate hash route. Removing a lesson restores its space; checkout validates names with `^[a-zA-Z\\s]+$`, phones with `^[0-9]+$`, posts to `/order`, and displays an "Order submitted" message.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` copies the HTML, CSS, and JavaScript files into the Pages artifact. It does not install Node, run Vite, or require frontend secrets. The static pages continue to call the existing Render API; Express, MongoDB Atlas, and their deployment are separate and unchanged.
