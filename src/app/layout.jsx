import './globals.css';

export const metadata = {
  title: 'Eco Store | Brgy. Alegria, Ormoc City',
  description:
    'Plastic-free, eco-friendly essentials for everyday life. Find the Eco Store in Brgy. Alegria, Ormoc City, Leyte, Philippines.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}