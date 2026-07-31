/**
 * Confetti helper — wraps canvas-confetti with BEC Club Hub branding colours.
 * Runs only in the browser (safe to import in client components).
 */

export async function fireConfetti(options?: {
  origin?: { x: number; y: number };
  particleCount?: number;
}) {
  if (typeof window === 'undefined') return;

  const confetti = (await import('canvas-confetti')).default;

  confetti({
    particleCount: options?.particleCount ?? 140,
    spread: 80,
    origin: options?.origin ?? { x: 0.5, y: 0.55 },
    colors: ['#7C3AED', '#F59E0B', '#ffffff', '#3B82F6', '#EC4899'],
    zIndex: 9999,
    startVelocity: 45,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Second burst slightly delayed for dramatic effect
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 120,
      origin: options?.origin ?? { x: 0.5, y: 0.55 },
      colors: ['#7C3AED', '#F59E0B', '#ffffff'],
      zIndex: 9999,
      startVelocity: 30,
      gravity: 1,
    });
  }, 300);
}
