"use client";

import { createContext, useContext } from "react";
import type { NavigationData, SiteConfig } from "@/types/cms";
import type { SearchResult } from "@/types";

type SiteDataContextValue = {
  site: SiteConfig;
  navigation: NavigationData;
  searchIndex: SearchResult[];
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({
  site,
  navigation,
  searchIndex,
  children,
}: SiteDataContextValue & { children: React.ReactNode }) {
  return (
    <SiteDataContext.Provider value={{ site, navigation, searchIndex }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return context;
}

export function useSiteDataSafe() {
  return useContext(SiteDataContext);
}
