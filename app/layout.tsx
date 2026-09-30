import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CAVA366", template: "%s · CAVA366" },
  description: "Vinos, catas y experiencias para descubrir, compartir y recordar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="es"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
