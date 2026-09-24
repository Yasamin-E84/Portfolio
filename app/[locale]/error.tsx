"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="message-page">
      <h1>
        A small interruption.
        <br />
        یک وقفه کوتاه.
      </h1>
      <p>Please try again. / لطفاً دوباره تلاش کنید.</p>
      <button className="button button-dark" onClick={reset}>
        Try again / تلاش دوباره
      </button>
      <p>
        <a href="mailto:foryxolabels@gmail.com">foryxolabels@gmail.com</a>
      </p>
    </main>
  );
}
