import { Metadata } from "next";
import { Toaster } from "sonner";
import { ChatProvider } from "../contexts/ChatContext";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";


import "./globals.css";
import { NavbarWrapper } from "@/components/custom/navbar-wrapper";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL("https://chat.vercel.ai"),
  title: "Agente 007",
  description: "Agente 007",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChatProvider>
        
            <Toaster position="top-center" />
            <NavbarWrapper />
            {children}
        </ChatProvider>
      </body>
    </html>
  );
}
