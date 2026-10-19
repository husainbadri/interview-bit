import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-variable",
  weight: ["400", "500", "600"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campus OS — AI Mock Interview Platform",
  description:
    "A quiet, near-monochrome productivity canvas for interview preparation. Practice role-adaptive questions with instant STAR evaluations and cohort diagnostics.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Campus OS — AI Mock Interview Platform",
    description:
      "A quiet, near-monochrome productivity canvas for interview preparation. Practice role-adaptive questions with instant STAR evaluations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
        <body className="font-sans antialiased bg-[#fafafa] text-[#141414]">
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </SessionProvider>
  );
}
