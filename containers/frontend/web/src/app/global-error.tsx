'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <body>
        <h1>Something went wrong</h1>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
