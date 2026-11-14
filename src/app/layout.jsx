import './globals.css';

export const metadata = {
  metadataBase: new URL('https://ecostore-rouge.vercel.app'),
  title: {
    template: '%s | Eco Store',
    default: 'Eco Store | Sustainable Living in Ormoc City', 
  },
  description: 'Discover our curated collection of plastic-free, eco-friendly essentials for your everyday life in Brgy. Alegria, Ormoc City.',
  keywords: ['eco store', 'sustainable products', 'zero waste philippines', 'ormoc city', 'reusable essentials'],
  openGraph: {
    title: 'Eco Store | Sustainable Living',
    description: 'Plastic-free, eco-friendly essentials delivered to your door.',
    url: 'https://ecostore-rouge.vercel.app',
    siteName: 'Eco Store',
    images: [
      {
        url: '/og-image.jpg', // Create a 1200x630 image and put it in your public/ folder
        width: 1200,
        height: 630,
        alt: 'Eco Store Banner',
      },
    ],
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eco Store',
    description: 'Sustainable Living, Delivered.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
