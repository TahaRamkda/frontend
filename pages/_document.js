import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body themebg-pattern="theme1">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
