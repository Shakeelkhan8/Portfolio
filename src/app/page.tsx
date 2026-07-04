import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <main className="container-content text-center">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Phase 1 complete
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {siteConfig.title}
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted">
          Planning, information architecture, wireframes, component inventory,
          and design tokens are ready. Phase 2 will build the design system.
        </p>
      </main>
    </div>
  );
}
