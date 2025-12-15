"use client";

import React, { useRef, useEffect, useState } from "react";
// 引入 Lucide 图标，并使用 size 属性强制控制大小，防止样式失效导致图标巨大
import { ChevronDown, X, Check } from "lucide-react"; 

interface ScrollColumnProps {
  items: string[];
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

// 单列滚动组件
const ScrollColumn = ({ items, value, onChange, label }: ScrollColumnProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 44; // iOS 标准行高
  const containerHeight = 220; // 5行的高度
  const paddingY = (containerHeight - itemHeight) / 2;

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 初始化位置
  useEffect(() => {
    if (containerRef.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value]);

  // 滚动吸附逻辑
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    const container = e.currentTarget;
    
    // 滚动停止 100ms 后执行吸附
    scrollTimeout.current = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        
        if (index >= 0 && index < items.length) {
            const targetValue = items[index];
            if (targetValue !== value) {
                onChange(targetValue);
            }
            // 平滑吸附回正
            container.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
        }
    }, 100);
  };

  return (
    <div className="relative h-[220px] flex-1 overflow-hidden group select-none cursor-grab active:cursor-grabbing z-20">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
      >
        {items.map((item) => {
          const isActive = item === value;
          return (
            <div
              key={item}
              className={`h-[44px] flex items-center justify-center snap-center transition-all duration-300 ${
                isActive 
                  ? "text-white font-medium text-xl opacity-100 scale-110" // 选中
                  : "text-white/40 font-normal text-base opacity-40 scale-95 blur-[0.5px]" // 未选中
              }`}
            >
              <span>{item}</span>
              {label && <span className="text-xs ml-1 mt-1 opacity-50">{label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DatePickerWheelProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DatePickerWheel({ value, onChange }: DatePickerWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // 每次打开时，重置临时值为当前真实值
  useEffect(() => {
    if(isOpen) setTempValue(value);
  }, [isOpen, value]);

  const [y, m, d] = tempValue.split("-");

  // 数据生成
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - 80 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  const getDaysInMonth = (year: string, month: string) => new Date(parseInt(year), parseInt(month), 0).getDate();
  const days = Array.from({ length: getDaysInMonth(y || "2000", m || "1") }, (_, i) => (i + 1).toString());

  const handleWheelChange = (type: "year" | "month" | "day", val: string) => {
    let [nY, nM, nD] = [y, m, d];
    if (type === "year") nY = val;
    if (type === "month") nM = val;
    if (type === "day") nD = val;
    
    // 修正日期 (如 2月没有30号)
    const maxDay = getDaysInMonth(nY, nM);
    if (parseInt(nD) > maxDay) nD = maxDay.toString();
    
    setTempValue(`${nY}-${nM}-${nD}`);
  };

  const confirm = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. 触发条 (仿输入框) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative w-full h-[60px] bg-[rgba(30,30,50,0.4)] border border-white/10 rounded-2xl flex items-center px-5 cursor-pointer hover:bg-white/5 transition-colors group select-none overflow-hidden"
      >
        <span className="flex-1 text-white text-base font-medium tracking-wide">
             {y}年 {m}月 {d}日
        </span>
        {/* 使用 Lucide 图标并强制指定 size，确保绝不会变大 */}
        <ChevronDown size={20} className="text-white/30 group-hover:text-white/70 transition-colors" />
      </div>

      {/* 2. 底部抽屉弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsOpen(false)} />
            
            {/* 抽屉面板 */}
            <div className="relative w-full bg-[#1c1c1e] rounded-t-[24px] shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden border-t border-white/10">
                
                {/* 顶部工具栏 */}
                <div className="flex justify-between items-center px-6 py-4 bg-[#252528] border-b border-white/5">
                    <button onClick={() => setIsOpen(false)} className="text-white/40 text-[15px] hover:text-white transition-colors">取消</button>
                    <span className="text-white font-semibold text-[15px]">选择出生日期</span>
                    <button onClick={confirm} className="text-[#D4AF37] text-[15px] font-bold hover:brightness-110 transition-colors">完成</button>
                </div>

                {/* 滚轮区域 */}
                <div className="relative h-[250px] bg-[#1c1c1e] w-full flex justify-center items-center">
                    
                    {/* A. 中间高亮条 (无边框，仅微亮背景) */}
                    <div className="absolute left-0 right-0 h-[44px] bg-white/5 pointer-events-none z-0" />

                    {/* B. 滚轮 (带遮罩) */}
                    <div className="flex w-full px-6 relative z-10" 
                         style={{ 
                           maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', 
                           WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' 
                         }}>
                        <ScrollColumn items={years} value={y} onChange={(v) => handleWheelChange("year", v)} label="年" />
                        <ScrollColumn items={months} value={m} onChange={(v) => handleWheelChange("month", v)} label="月" />
                        <ScrollColumn items={days} value={d} onChange={(v) => handleWheelChange("day", v)} label="日" />
                    </div>

                </div>
            </div>
        </div>
      )}
    </>
  );
}