import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <main className="w-full max-w-lg text-center">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Portfolio
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {siteConfig.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {siteConfig.title}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
          Project environment is ready. Design system and pages will be built
          in the next phase.
        </p>
      </main>
    </div>
  );
}
