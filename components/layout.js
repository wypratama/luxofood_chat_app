import Head from 'next/head';
import { cloneElement } from 'react';

export default function Layout({
  children,
  title = 'This is the default title',
}) {
  return (
    <div className="flex flex-col min-h-screen items-center bg-bg">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {children}
    </div>
  );
}
