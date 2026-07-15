import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/Wapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Home & Kitchen Finds",
  description: "Elevating daily living with curated kitchenware",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1c2a21",
              border: "1px solid #e2e8e2",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}