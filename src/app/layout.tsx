import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JAGER CORE",
  description: "Intranet operativa JAGER",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
