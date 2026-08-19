import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCProvider } from "@/lib/trpc/provider";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/ui/theme/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "azar-pouyan",
  description: "azar-pouyan admin & storefront",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before React hydrates. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider defaultTheme="light">
          <TRPCProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
