export default function Loading() {
  return (
    <main className="loading-page" aria-busy="true">
      <div
        className="loading-orbit"
        role="status"
        aria-label="Loading / در حال بارگذاری"
      />
    </main>
  );
}
