import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Inject Amplitude API key for widget.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.NEXT_PUBLIC_AMPLITUDE_API_KEY = "${process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || ''}";`
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 