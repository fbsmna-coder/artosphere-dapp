"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Something went wrong</h2>
        <p className="text-white/60 mb-6">{error.message}</p>
        <button onClick={reset} className="px-6 py-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30">
          Try Again
        </button>
      </div>
    </div>
  );
}
