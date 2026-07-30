import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E293B] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      <div className="relative text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 border border-white/10 mb-8">
          <span className="text-4xl">🏛️</span>
        </div>
        <h1 className="text-8xl font-black text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white/80 mb-3">Page Not Found</h2>
        <p className="text-white/60 max-w-md mx-auto mb-8">
          This page doesn't exist on the BEC Club Hub. Perhaps you took a wrong turn on campus?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="gradient" size="lg">Go to Homepage</Button>
          </Link>
          <Link href="/clubs">
            <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Explore Clubs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
