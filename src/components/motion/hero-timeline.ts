/**
 * Shared cinematic timeline for the home hero (seconds from mount).
 *
 * Story:
 *   silence → spark → gather → awaken → identity → presence
 *
 * The orb tells the story; the type does not wait for it. Copy, actions and
 * the header land in the first second so the page is readable (and its LCP
 * element painted) while the orb is still gathering behind it.
 */
export const HERO = {
  /** Anticipation in darkness */
  silence: 0.2,
  /** First light appears */
  spark: 0.8,
  /** Particles discover form */
  gather: 1.8,
  /** Spark becomes a world */
  awaken: 2.8,
  /** Settles into living presence */
  live: 3.6,
  /** Typography chapter: starts almost immediately, sequenced in ~0.8s. */
  type: {
    header: 0,
    badge: 0.1,
    location: 0.15,
    name: 0.2,
    title: 0.45,
    description: 0.55,
    actions: 0.7,
    cue: 1.6,
  },
} as const;

export const HERO_EASE = [0.16, 1, 0.3, 1] as const;
export const HERO_EASE_SOFT = [0.22, 1, 0.36, 1] as const;
export const HERO_EASE_DRAMATIC = [0.12, 0.8, 0.2, 1] as const;
