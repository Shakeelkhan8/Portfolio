# Phase 1 — Planning & Foundations

Planning artifacts for the portfolio build. Phase 1 defines **what** we build and **why** before any UI components or pages are implemented in Phase 2–3.

## Deliverables

| Document | Purpose |
| --- | --- |
| [Information Architecture](./information-architecture.md) | Site map, navigation, content hierarchy, URL structure |
| [User Flows](./user-flows.md) | Visitor journeys for recruiters, engineers, and hiring managers |
| [Wireframes](./wireframes.md) | Low-fidelity layout blueprints for every page |
| [Component Inventory](./component-inventory.md) | Full list of UI components with build priority |

## Code Foundations

Design tokens are codified in:

- `src/config/design-tokens.ts` — token definitions (source of truth)
- `src/config/navigation.ts` — nav structure derived from IA
- `src/app/globals.css` — CSS custom properties wired to Tailwind v4

## Visitor Story

The site follows a deliberate narrative arc:

**Who I am → What I build → How I think → Projects → Engineering decisions → Impact → Writing → Experience → Contact**

Every page and section maps to one step in this journey.

## Next Step

**Phase 2** — Build the design system: typography, spacing primitives, shadcn/ui setup, layout shell, and motion utilities using these tokens.
