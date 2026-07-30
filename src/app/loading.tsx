export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-900" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-500">Loading BEC Club Hub...</p>
      </div>
    </div>
  );
}
