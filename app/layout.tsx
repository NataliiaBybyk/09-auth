import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';

import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'An application for storing, creating, deleting, and searching notes',
  openGraph:{
     title: 'NoteHub',
  description: 'An application for storing, creating, deleting, and searching notes',
 url:"https://08-zustand-orcin-eight.vercel.app/",
 images:[
  {
    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
    width: 1200,
    height: 630,
    alt: "NoteHub"
  }
 ]
}
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal:React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>

        
          <Header />

 {children}
          {modal}

         

          <Footer />
            </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
