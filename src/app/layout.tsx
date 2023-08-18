import "./globals.scss";
import { Space_Grotesk, Inter } from "next/font/google";

const headings = Space_Grotesk({ subsets: ["latin"], variable: "--durhack-font" });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DurHack MegaTeams",
  description: "The UK's largest student hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className + " h-full " + headings.variable}>{children}</body>
    </html>
  );
}
