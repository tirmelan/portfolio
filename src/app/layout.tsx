import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiril Meland",
  metadataBase: new URL("https://tirilmeland.no"),
  openGraph: {
    title: "Tiril Meland",
    url: "https://tirilmeland.no",
    siteName: "Meland design",
    locale: "nb_NO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yfv1rla.css" />
        <link rel="stylesheet" href="https://use.typekit.net/pfc0jny.css" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
