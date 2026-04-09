import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-400 mb-4">&phi;04</h1>
        <p className="text-white/60 mb-6">This page doesn&apos;t exist in the Artosphere</p>
        <Link href="/" className="px-6 py-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
