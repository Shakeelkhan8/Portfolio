import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { SkipLink } from "@/components/layout/skip-link";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <SkipLink />
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </>
  );
}
