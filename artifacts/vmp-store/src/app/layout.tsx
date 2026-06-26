import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GlobalStateProvider } from './components/context/GlobalStateContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollVideoBg } from './components/background/ScrollVideoBg';

export const metadata: Metadata = {
  title: 'Veer Mahadev Plastic Worldwide',
  description: 'Eco-friendly B2B wholesale packaging manufacturer with multi-currency bulk pricing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-emerald-50 text-slate-950 antialiased">
        <GlobalStateProvider>
          <ScrollVideoBg />
          <Header />
          {children}
          <Footer />
        </GlobalStateProvider>
      </body>
    </html>
  );
}
