// app/page.jsx
import LiveReport from '../TestPage/index.jsx';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Next.js Live Reporting Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This page demonstrates a live reporting dashboard that auto-refreshes data at a
          customizable interval. Adjust the refresh interval and watch the countdown timer
          and data update in real-time.
        </p>
      </div>

      {/* Live Report Component */}
      
    </main>
  );
}