import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google"; 
import "./globals.css"; 

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap", 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", 
  themeColor: "#0f0c29", 
};

export const metadata: Metadata = {
  title: {
    template: "%s | 合相 ALIGN",
    default: "合相 ALIGN",
  },
  description: "Metaphysics Style Guide",
  appleWebApp: {
    capable: true,
    title: "合相 ALIGN",
    statusBarStyle: "black-translucent", 
  },
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full">
      <body
        className={`
          ${inter.variable} 
          ${playfair.variable} 
          font-sans 
          antialiased 
          text-white 
          h-full 
          m-0 p-0
          /* ⚠️ 移除了 overflow-hidden，允许内容自然滚动，解决无法拉到底部的问题 */
        `}
      >
        {/* --- 背景层系统 --- */}
        
        {/* 1. 纯色衬底 (z-[-3]): 防止透明时透出白色，彻底消灭黑边 */}
        <div className="fixed inset-0 z-[-3] bg-[#0f0c29]" />

        {/* 2. 呼吸极光层 (z-[-2]): 使用内联样式确保渐变绝对生效 */}
        <div 
          className="fixed -top-[100px] -left-[100px] -right-[100px] -bottom-[100px] z-[-2] animate-breathe pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 15% 50%, rgba(27, 20, 100, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 85% 30%, rgba(67, 50, 180, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, #1B1464 0%, #0f0c29 60%, #050414 100%)
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* 3. 内容层 (z-10): 使用 relative 让其在背景之上自然流动 */}
        <main className="flex-grow flex flex-col relative z-10 w-full min-h-full">
          {children}
        </main>
      </body>
    </html>
  );
}