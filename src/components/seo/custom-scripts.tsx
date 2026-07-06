import Script from "next/script";
import { getEnabledCustomScripts } from "@/lib/db/queries/settings";

export async function CustomScripts() {
  const scripts = await getEnabledCustomScripts();

  if (!scripts.length) {
    return null;
  }

  return (
    <>
      {scripts.map((script) => (
        <Script
          key={script.id}
          id={`custom-script-${script.id}`}
          strategy={
            script.placement === "head" ? "beforeInteractive" : "lazyOnload"
          }
        >
          {script.scriptContent}
        </Script>
      ))}
    </>
  );
}
