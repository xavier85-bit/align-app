"use client";

import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

// 生成年份范围 (例如 1950 - 2010)
const years = Array.from({ length: 61 }, (_, i) => (1950 + i).toString());
// 生成月份 (1-12)
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
// 生成日期 (这里简化处理，实际需根据年月动态计算天数，或者简单列出1-31)
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

interface WheelDatePickerProps {
  onDateChange: (date: { year: string; month: string; day: string }) => void;
}

export default function WheelDatePicker({ onDateChange }: WheelDatePickerProps) {
  const [pickerValue, setPickerValue] = useState({
    year: "2000",
    month: "01",
    day: "01",
  });

  // 当选择改变时
  const handleChange = (newValue: any) => {
    setPickerValue(newValue);
    onDateChange(newValue);
  };

  return (
    <div className="bg-transparent w-full flex justify-center py-4">
       {/* 这里的样式是为了模拟 Moonly 的选中高亮条 */}
      <div className="relative w-full max-w-sm h-48 overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <Picker
          value={pickerValue}
          onChange={handleChange}
          wheelMode="normal" // 启用滚轮模式
          height={192} // 总高度
          itemHeight={44} // 每一项的高度，确保容易点击
        >
          <Picker.Column name="year">
            {years.map((year) => (
              <Picker.Item key={year} value={year}>
                <div className="text-white text-lg font-medium">{year}年</div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="month">
            {months.map((month) => (
              <Picker.Item key={month} value={month}>
                <div className="text-white text-lg font-medium">{month}月</div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="day">
            {days.map((day) => (
              <Picker.Item key={day} value={day}>
                <div className="text-white text-lg font-medium">{day}日</div>
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
        
        {/* 中间的高亮选中区覆盖层 (视觉效果) */}
        <div className="pointer-events-none absolute top-1/2 left-0 w-full -translate-y-1/2 h-11 bg-white/10 border-y border-primary/30 z-10" />
      </div>
    </div>
  );
}