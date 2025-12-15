import type { Metadata } from "next";
// 引入两种高级字体：Inter (无衬线) 和 Playfair Display (衬线)
import { Inter, Playfair_Display } from "next/font/google"; 
import "./globals.css"; // 👈 关键！必须保留以加载 Tailwind 和自定义样式

// 1. 配置字体
// Inter 用于 UI 元素、按钮、正文，给人现代、清晰的感觉
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap", // 优化加载策略
});

// Playfair Display 用于大标题、Slogan，给人优雅、神秘的感觉
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

// 2. 配置 SEO 元数据
export const metadata: Metadata = {
  title: {
    template: "%s | 合相 ALIGN", // 子页面标题模版
    default: "合相 ALIGN",       // 默认标题
  },
  description: "Metaphysics Style Guide - 你的形而上学生活指南",
  icons: {
    icon: "/favicon.ico", // 建议后续放一个 favicon 文件在 public 文件夹
  },
};

// 3. 根布局组件
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
          overflow-hidden
        `}
      >
        {/* ✨ 修复点：z-index 改为 0 (原为 -2) ✨ */}
        <div className="fixed -top-[100px] -left-[100px] -right-[100px] -bottom-[100px] z-0 bg-aurora-animate pointer-events-none" />

        {/* 内容层 z-index 保持 10 不变，确保浮在背景之上 */}
        <main className="flex-grow flex flex-col relative z-10 w-full h-full overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}