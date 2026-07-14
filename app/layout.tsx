import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/Wapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}