import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Mosaed AI - منصة الكوتشينغ وعجلة الحياة',
  description: 'منصة تفاعلية لتطوير جودة الحياة وتقييم عجلة الحياة الثمانية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}