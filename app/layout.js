import "./globals.css";
import ImageInteractionPolicy from "./components/ImageInteractionPolicy";
import PrintCopyright from "./components/PrintCopyright";

export const metadata = {
  title: "TEACH",
  description: "Teaching Excellence and Christianity at Home",
  other: {pinterest: "nopin"},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><ImageInteractionPolicy />{children}<PrintCopyright /></body>
    </html>
  );
}
