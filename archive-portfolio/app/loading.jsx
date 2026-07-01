export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-accent/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    </div>
  );
} 