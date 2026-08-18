# PixelGame on GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. Every push to `main` builds the static PixelGame storefront and deploys it through **GitHub Pages**.

## One-time GitHub setting

In the GitHub repository, open **Settings → Pages** and choose **GitHub Actions** as the source. The workflow then publishes the site to:

`https://softalex96-creator.github.io/PixelGame/`

The GitHub Pages version uses hash routing. A checkout route is therefore represented as `https://softalex96-creator.github.io/PixelGame/#/checkout`.

> The deployed checkout and account remain local simulations. Orders, cart contents, and favourites are stored in the visitor's browser, and no real payment data or virtual currency delivery is processed.
