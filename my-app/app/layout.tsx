import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Esmalte — cerâmica feita à mão",
  description: "Vasos, tigelas e canecas em cerâmica esmaltada, feitos em pequenas fornadas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="bg-[#EDF0EE] text-[#17262B] antialiased [font-family:var(--font-body)]">
        {children}
      </body>
    </html>
  );
}