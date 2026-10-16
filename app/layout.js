import "./globals.css";

export const metadata = {
  title: "TEACH",
  description: "Teaching Excellence and Christianity at Home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
