import clsx from 'clsx';
import type { Metadata } from 'next';
import { PublicEnvScript } from 'next-runtime-env';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from './ApolloWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Model Gateway',
  description: 'Model Gateway',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <PublicEnvScript />
      </head>
      <body className={clsx(inter.className, 'h-full bg-neutral text-neutral')}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
