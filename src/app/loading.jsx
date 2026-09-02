export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        
        <div className="relative h-20 w-16">
          <div className="absolute inset-0 animate-pulse rounded-md bg-primary/20" />

          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-primary/40" />
        </div>

       
        <div className="text-center">
          <h2 className="text-2xl font-bold">Fable</h2>

          <p className="mt-1 text-sm opacity-60">Loading your next story...</p>
        </div>

       
        <div className="flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />

          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />

          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
