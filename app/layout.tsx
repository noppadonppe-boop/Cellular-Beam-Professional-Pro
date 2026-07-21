import type { Metadata } from "next";
import { headers } from "next/headers";
import { Hanken_Grotesk, JetBrains_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";

const uiFont = Hanken_Grotesk({ variable: "--font-ui", subsets: ["latin"] });
const reportFont = Noto_Serif({ variable: "--font-report", subsets: ["latin"] });
const dataFont = JetBrains_Mono({ variable: "--font-data", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const title = "Cellular Beam Professional";
  const description = "Analysis, design checks, and calculation reports for cellular steel beams.";
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${uiFont.variable} ${reportFont.variable} ${dataFont.variable}`}>{children}</body>
    </html>
  );
}
