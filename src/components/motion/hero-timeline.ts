/**
 * Shared cinematic timeline for the home hero.
 * Visual beats and typography stay locked to the same story clock.
 *
 * Story:
 *   silence → spark → gather → awaken → identity → presence
 */
export const HERO = {
  /** Anticipation in darkness */
  silence: 0.45,
  /** First light appears */
  spark: 1.35,
  /** Particles discover form */
  gather: 2.75,
  /** Spark becomes a world */
  awaken: 4.1,
  /** Settles into living presence */
  live: 5.2,
  /** Typography chapter — begins as the world opens */
  type: {
    badge: 3.15,
    location: 3.35,
    name: 3.5,
    title: 4.15,
    description: 4.5,
    actions: 4.85,
    cue: 5.45,
    header: 2.15,
  },
} as const;

export const HERO_EASE = [0.16, 1, 0.3, 1] as const;
export const HERO_EASE_SOFT = [0.22, 1, 0.36, 1] as const;
export const HERO_EASE_DRAMATIC = [0.12, 0.8, 0.2, 1] as const;
