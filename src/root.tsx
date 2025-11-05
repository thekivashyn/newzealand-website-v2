import { component$, isDev } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
// Import KaTeX CSS for math rendering
import "katex/dist/katex.min.css";

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <RouterHead />
      </head>
      <body lang="en" class="dark">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
