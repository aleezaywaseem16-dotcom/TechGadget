export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
        {/* Gallery skeleton */}
        <div className="lg:w-[500px] flex-shrink-0 space-y-3">
          <div className="aspect-square rounded-2xl bg-muted" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-muted" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-10 bg-muted rounded w-1/2" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/6" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-12 bg-muted rounded-xl flex-1" />
            <div className="h-12 bg-muted rounded-xl w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
