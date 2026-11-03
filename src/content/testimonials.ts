/**
 * Only testimonials that can be checked belong here: anything seeded can
 * reach the public site. Each one names where it was verified.
 */
export const testimonials = [
  {
    author_name: "Hamza I.",
    author_role: "Social Media Executive",
    // Shown on the Upwork profile as a verified client testimonial.
    author_company: "Client, Sep 2025 (verified on Upwork)",
    content:
      "I highly recommend Shakeel K for their professionalism, communication, and vision, which made the project smooth and successful. It was an absolute pleasure collaborating, and I'd be glad to work together again in the future.",
  },
] as const;
