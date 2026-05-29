export default function GameNewsLoading() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#ff3b30]/20 h-7 w-28 rounded-full animate-pulse mb-4" />
          <div className="h-10 w-64 bg-white/10 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-slate-700 rounded" />
                <div className="h-5 bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
