import { TRPCProvider } from "@/lib/trpc/provider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <TRPCProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
