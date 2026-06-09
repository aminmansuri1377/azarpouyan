import { TRPCProvider } from "@/lib/trpc/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}