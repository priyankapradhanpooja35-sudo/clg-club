'use client';
import Button from '@/components/ui/Button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1B4B] to-[#1E293B] p-4">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Something went wrong</h1>
        <p className="text-white/60 max-w-md mx-auto mb-6 text-sm">{error.message || 'An unexpected error occurred. Please try again.'}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="gradient" onClick={reset}>Try Again</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
