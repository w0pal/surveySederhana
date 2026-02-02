import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 title: 'Survei Prakiraan Pergerakan Masyarakat - Lebaran 2026',
 description:
  'Survei Prakiraan Pergerakan Masyarakat Dalam Rangka Persiapan Penyelenggaraan Angkutan Lebaran 2026 - Kementerian Perhubungan',
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <html lang="id">
   <body className={inter.className}>
    <Toaster position="top-center" />
    {children}
   </body>
  </html>
 );
}
