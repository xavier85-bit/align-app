"use client"

import React, { useState, useEffect, useRef } from "react"
// 引入图标
import { Sparkles, User, Briefcase, Heart, PartyPopper, Monitor, Home as HomeIcon, Plane, FileText, ArrowLeft, RotateCcw, Star, Lightbulb, Shirt, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ZODIAC_SIGNS, MBTI_TYPES } from "@/lib/constants"
import type { FormData, Occasion, Gender } from "@/lib/types"

// --- 0. 动态星空背景组件 ---
const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; radius: number; alpha: number; targetAlpha: number; speed: number }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth + 200;
      canvas.height = window.innerHeight + 200;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 3500); 
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8,
          alpha: Math.random(),
          targetAlpha: Math.random(),
          speed: Math.random() * 0.015 + 0.005 
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach(star => {
        if (star.alpha < star.targetAlpha) { star.alpha += star.speed; } else { star.alpha -= star.speed; }
        if (Math.abs(star.alpha - star.targetAlpha) < 0.05) { star.targetAlpha = Math.random(); }
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
        ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => { window.removeEventListener('resize', resizeCanvas); cancelAnimationFrame(animationFrameId); };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: '-100px',
        left: '-100px',
        width: 'calc(100% + 200px)',
        height: 'calc(100% + 200px)',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

// --- 1. 数据 ---
const SOCIAL_ARCHETYPES = [
  { value: "creator", label: "创造者 Creator", desc: "设计师 · 艺术家 · 开发者 [输出能量]" },
  { value: "explorer", label: "探索者 Explorer", desc: "自由职业 · 学生 · 旅行者 [流动能量]" },
  { value: "leader", label: "领导者 Leader", desc: "创业者 · 高管 · 产品经理 [掌控能量]" },
  { value: "guardian", label: "守护者 Guardian", desc: "公务员 · 教师 · 医生 [稳固能量]" },
  { value: "connector", label: "连接者 Connector", desc: "运营 · 销售 · 公关 [交互能量]" },
  { value: "observer", label: "观察者 Observer", desc: "分析师 · 研究员 · 咨询师 [内省能量]" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male 男" },
  { value: "female", label: "Female 女" },
  { value: "non-binary", label: "Non-binary 非二元" },
  { value: "secret", label: "Secret 保密" }
];

const occasions: { id: Occasion; icon: any; label: string; labelCn: string }[] = [
  { id: "solo", icon: User, label: "Solo", labelCn: "独处" },
  { id: "work", icon: Monitor, label: "Work", labelCn: "工作" },
  { id: "business", icon: Briefcase, label: "Business", labelCn: "商务" },
  { id: "date", icon: Heart, label: "Date", labelCn: "约会" },
  { id: "party", icon: PartyPopper, label: "Party", labelCn: "聚会" },
  { id: "family", icon: HomeIcon, label: "Family", labelCn: "家庭" },
  { id: "travel", icon: Plane, label: "Travel", labelCn: "出行" },
  { id: "interview", icon: FileText, label: "Interview", labelCn: "面试" },
]

const getZodiacSign = (month: string, day: string) => {
  const m = parseInt(month);
  const d = parseInt(day);
  if (!m || !d) return "";
  if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return "水瓶座";
  if ((m == 2 && d >= 19) || (m == 3 && d <= 20)) return "双鱼座";
  if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return "白羊座";
  if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return "金牛座";
  if ((m == 5 && d >= 21) || (m == 6 && d <= 21)) return "双子座";
  if ((m == 6 && d >= 22) || (m == 7 && d <= 22)) return "巨蟹座";
  if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return "狮子座";
  if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return "处女座";
  if ((m == 9 && d >= 23) || (m == 10 && d <= 23)) return "天秤座";
  if ((m == 10 && d >= 24) || (m == 11 && d <= 22)) return "天蝎座";
  if ((m == 11 && d >= 23) || (m == 12 && d <= 21)) return "射手座";
  return "摩羯座";
};

// --- 2. 样式系统 ---
const BASE_GLASS_COLOR = 'rgba(20, 20, 40, 0.55)'; 
const BORDER_COLOR = 'rgba(100, 100, 255, 0.1)';

const globalGlassContainerStyle = {
    background: 'rgba(15, 15, 30, 0.4)', 
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: '32px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
};

const glassCardStyle = {
  background: BASE_GLASS_COLOR, 
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${BORDER_COLOR}`,
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  padding: '24px'
};

const activeStyle = {
  ...glassCardStyle,
  background: 'rgba(212, 175, 55, 0.2)',
  border: '1px solid rgba(212, 175, 55, 0.6)', 
  padding: '0'
};

const occasionCardStyle = {
  ...glassCardStyle,
  background: 'linear-gradient(145deg, rgba(40, 30, 70, 0.4) 0%, rgba(10, 10, 20, 0.6) 100%)',
  border: '1px solid rgba(120, 120, 255, 0.15)', 
  padding: '0',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)' 
}

const inputStyle = {
  height: '60px',
  backgroundColor: 'rgba(30, 30, 50, 0.4)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  color: 'white',
  fontSize: '16px',
  paddingLeft: '20px',
  width: '100%'
};

const smallInputStyle = {
  ...inputStyle,
  height: '56px',
  paddingLeft: '0', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const
}

const dropdownContentClass = "bg-[#101018]/95 backdrop-blur-2xl border-white/10 text-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border p-1";
const dropdownItemClass = "focus:bg-white/10 focus:text-[#D4AF37] cursor-pointer py-3 text-base my-1 rounded-md text-white/80 data-[state=checked]:text-[#D4AF37] flex justify-center items-center text-center";


// --- 3. 辅助组件 ---
function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => { setTimeout(onFinish, 2500); }, [onFinish]);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-in zoom-in duration-1000 relative z-10">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-[#D4AF37] blur-[80px] opacity-20 animate-pulse"></div>
        <Sparkles className="w-24 h-24 text-[#D4AF37] relative z-10" />
      </div>
      
      <div className="text-center space-y-2">
         <h2 className="text-2xl font-serif text-[#D4AF37] tracking-[0.5em] ml-3 animate-in slide-in-from-bottom-2 duration-700">合相</h2>
         <h1 className="text-5xl font-serif tracking-[0.3em] text-white font-light">ALIGN</h1>
      </div>

      <p className="text-xs text-white/50 tracking-[0.4em] mt-8 uppercase animate-in fade-in duration-1000 delay-300">
        契合宇宙的韵律
      </p>
    </div>
  )
}

function RitualLoading({ onFinish }: { onFinish: () => void }) {
  const [textIndex, setTextIndex] = useState(0);
  const steps = ["连接本命星盘...", "排布先天卦象...", "推算五行旺衰...", "天机显现..."];
  useEffect(() => {
    if (textIndex < steps.length - 1) {
      setTimeout(() => setTextIndex(prev => prev + 1), 800);
    } else {
      setTimeout(onFinish, 1000);
    }
  }, [textIndex, onFinish]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center relative z-10">
       <div className="flex flex-col items-center justify-center h-full">
         <p className="text-2xl font-serif text-white tracking-[0.2em] animate-pulse transition-all duration-500 min-h-[40px]">
           {steps[textIndex]}
         </p>
         <div className="w-12 h-1 bg-[#D4AF37] rounded-full mt-6 opacity-50"></div>
       </div>
    </div>
  )
}

// --- 4. 结果展示 ---
function ResultView({ data, onReset }: { data: any, onReset: () => void }) {
  if (!data) return null;

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-bottom-10 duration-700 pb-40 relative z-10">
       <div className="relative p-10 text-center flex flex-col items-center justify-center mb-10 shrink-0"
            style={{
              ...glassCardStyle,
              background: 'linear-gradient(180deg, rgba(40, 20, 80, 0.5) 0%, rgba(20, 20, 40, 0.8) 100%)',
            }}>
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-4 block">今日幸运色</span>
          <div className="w-20 h-20 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.3)] border-2 border-white/20 flex items-center justify-center mb-4 mx-auto" 
               style={{ backgroundColor: data.hexCode || '#333' }}>
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">{data.fortuneTitle}</h2>
          <p className="text-xs text-[#D4AF37] tracking-[0.2em] uppercase font-bold">{data.luckyColor}</p>
       </div>

       <div className="flex-1 flex flex-col gap-8">
          
          <div style={glassCardStyle} className="flex flex-col items-center text-center">
             <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-purple-400" />
                <h3 className="text-xs text-white/50 font-bold tracking-widest uppercase">星象洞察</h3>
             </div>
             <p className="text-sm text-white/90 font-light leading-relaxed">{data.astrologyInsight}</p>
          </div>

          {data.synastryInsight && (
            <div style={glassCardStyle} className="flex flex-col items-center text-center border-t-2 border-[#D4AF37]/20">
               <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 text-[#D4AF37]">💞</span>
                  <h3 className="text-xs text-[#D4AF37] font-bold tracking-widest uppercase">双人磁场</h3>
               </div>
               <p className="text-sm text-white/90 font-light leading-relaxed">{data.synastryInsight}</p>
            </div>
          )}

          <div style={glassCardStyle} className="flex flex-col items-center text-center">
             <div className="flex items-center gap-2 mb-4">
                <Shirt className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-xs text-white/50 font-bold tracking-widest uppercase">穿搭策略</h3>
             </div>
             <p className="text-sm text-white/90 font-light leading-relaxed mb-6">
                {data.styleStrategy}
             </p>
             
             <div className="flex flex-col items-center justify-center gap-2 p-4 w-full bg-[#D4AF37]/10 border border-[#D4AF37]/20" style={{ borderRadius: '24px' }}>
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-lg mb-1">💎</div>
                <div className="flex flex-col items-center">
                   <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-1">能量单品</span>
                   <span className="text-sm text-white font-medium">{data.itemRecommendation}</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="flex flex-col items-center justify-center text-center gap-3 p-4" style={glassCardStyle}>
                <span className="text-xs text-white/60 font-bold uppercase tracking-widest">财位</span>
                <span className="text-sm text-[#D4AF37] font-medium leading-snug">{data.energyCompass?.wealth}</span>
             </div>
             <div className="flex flex-col items-center justify-center text-center gap-3 p-4" style={glassCardStyle}>
                <span className="text-xs text-white/60 font-bold uppercase tracking-widest">贵人位</span>
                <span className="text-sm text-purple-300 font-medium leading-snug">{data.energyCompass?.noble}</span>
             </div>
          </div>
          
          <div style={{...glassCardStyle, background: 'rgba(255,255,255,0.05)'}} className="flex flex-col items-center text-center gap-4">
             <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-xs text-[#D4AF37] font-bold tracking-widest uppercase">天机锦囊</h3>
             </div>
             <p className="italic text-white/90 text-sm leading-relaxed">
                “{data.dailyTip}”
             </p>
          </div>
       </div>

       <div className="mt-16 flex justify-center">
         <Button onClick={onReset} className="btn-primary bg-white text-black hover:bg-gray-200 border-none hover:scale-105">
            <RotateCcw className="w-4 h-4 mr-2" /> 开启新推演
         </Button>
       </div>
    </div>
  )
}

// --- 5. 主程序 ---
export default function Home() {
  const [appState, setAppState] = useState<"SPLASH" | "INPUT" | "LOADING" | "RESULT">("SPLASH")
  const [resultData, setResultData] = useState<any>(null)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  
  // 日期三级联动状态 (Year/Month/Day/Hour)
  const [selYear, setSelYear] = useState("")
  const [selMonth, setSelMonth] = useState("")
  const [selDay, setSelDay] = useState("")
  const [selHour, setSelHour] = useState("") // ✨ 新增：时辰状态

  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // 数据生成
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => (currentYear - 10 - i).toString()); // 过去80年
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  // ✨ 新增：00:00 - 23:00 的小时选择
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ":00");
  
  // 动态计算当月天数
  const getDays = (y: string, m: string) => {
    if (!y || !m) return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const d = new Date(parseInt(y), parseInt(m), 0).getDate();
    return Array.from({ length: d }, (_, i) => (i + 1).toString());
  }

  // 监听日期变化，自动合成 dateStr (精确到时)
  useEffect(() => {
    if (selYear && selMonth && selDay) {
      // ✨ 修改：将时辰拼接到日期字符串中，默认 00:00
      const hourStr = selHour || "00:00"; 
      const fullDate = `${selYear}-${selMonth}-${selDay} ${hourStr}`;
      setFormData(prev => ({ ...prev, birthDate: fullDate }));
      
      const autoZodiac = getZodiacSign(selMonth, selDay);
      if (autoZodiac) {
        setFormData(prev => ({ ...prev, zodiac: autoZodiac }))
      }
    }
  }, [selYear, selMonth, selDay, selHour]) // ✨ 监听 selHour

  const handleStartDivination = async () => {
    setAppState("LOADING")
    try {
      const response = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if(data.error) throw new Error(data.error);

      setTimeout(() => {
        setResultData(data)
        setAppState("RESULT")
      }, 1000)
    } catch (error: any) {
      console.error(error)
      setAppState("INPUT")
      alert("连接失败: " + error.message)
    }
  }

  const isStepValid = () => {
    // ✨ 修改：现在时辰也是推荐项，虽然不是必须，但我们通常默认认为有了年月日就可以。
    // 如果你想强制时辰，可以在这里加上 && selHour
    if (step === 1) return formData.identity && formData.gender && formData.birthDate && formData.zodiac;
    if (step === 2) return formData.occasion;
    return false;
  }

  if (!mounted) return null;

  const renderInput = () => (
    <div className="w-full flex flex-col animate-in fade-in relative z-10 pb-20">
       
       <div className="text-center space-y-4 mb-12 shrink-0">
         <h2 className="text-3xl font-serif text-white">
           {step === 1 ? "合盘推演" : "推演场景"}
         </h2>
         <div className="flex justify-center gap-3">
            {[1, 2].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-10 bg-[#D4AF37]' : 'w-2 bg-white/20'}`}></div>
            ))}
         </div>
       </div>

       <div>
          {step === 1 && (
            <div style={globalGlassContainerStyle} className="flex flex-col gap-10">
              
              <div className="space-y-4">
                <Label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold block pl-1 w-full text-center">Role 你的角色</Label>
                <Select onValueChange={(v) => setFormData({...formData, identity: v})}>
                  <SelectTrigger className="w-full" style={inputStyle}>
                    <SelectValue placeholder="选择你的社会原型..." />
                  </SelectTrigger>
                  
                  <SelectContent className={dropdownContentClass}>
                    {SOCIAL_ARCHETYPES.map(r => (
                      <SelectItem key={r.value} value={r.value} className={dropdownItemClass}>
                        <div className="flex flex-col items-center gap-1 text-center">
                          <span className="font-medium">{r.label}</span>
                          <span className="text-[10px] text-white/50">{r.desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold block pl-1 w-full text-center">Gender 你的性别</Label>
                <Select onValueChange={(v) => setFormData({...formData, gender: v as Gender})}>
                  <SelectTrigger className="w-full" style={inputStyle}>
                    <SelectValue placeholder="选择你的性别..." />
                  </SelectTrigger>
                  <SelectContent className={dropdownContentClass}>
                    {GENDER_OPTIONS.map(g => <SelectItem key={g.value} value={g.value} className={dropdownItemClass}>{g.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* ✨ 日期+时辰栏 (四列式) ✨ */}
              <div>
                <Label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold block mb-4 pl-1 w-full text-center">Birth Date & Time 出生时间</Label>
                <div className="flex gap-2">
                    <div className="flex-[1.2]">
                      <Select onValueChange={setSelYear}>
                          <SelectTrigger className="w-full px-1" style={smallInputStyle}><SelectValue placeholder="Year" /></SelectTrigger>
                          <SelectContent className={`${dropdownContentClass} max-h-[300px]`}>
                              {years.map(y => <SelectItem key={y} value={y} className={dropdownItemClass}>{y}</SelectItem>)}
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select onValueChange={setSelMonth}>
                          <SelectTrigger className="w-full px-1" style={smallInputStyle}><SelectValue placeholder="Mon" /></SelectTrigger>
                          <SelectContent className={`${dropdownContentClass} max-h-[300px]`}>
                              {months.map(m => <SelectItem key={m} value={m} className={dropdownItemClass}>{m}月</SelectItem>)}
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select onValueChange={setSelDay}>
                          <SelectTrigger className="w-full px-1" style={smallInputStyle}><SelectValue placeholder="Day" /></SelectTrigger>
                          <SelectContent className={`${dropdownContentClass} max-h-[300px]`}>
                              {getDays(selYear, selMonth).map(d => <SelectItem key={d} value={d} className={dropdownItemClass}>{d}日</SelectItem>)}
                          </SelectContent>
                      </Select>
                    </div>
                    {/* ✨ 第四列：时辰选择 */}
                    <div className="flex-[1.2]">
                       <Select onValueChange={setSelHour}>
                          <SelectTrigger className="w-full px-1" style={smallInputStyle}>
                              {/* 这里的文字稍微小一点防止溢出 */}
                              <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent className={`${dropdownContentClass} max-h-[300px]`}>
                              {hours.map(h => <SelectItem key={h} value={h} className={dropdownItemClass}>{h}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold block pl-1 w-full text-center">Zodiac 星座</Label>
                <Select value={formData.zodiac} onValueChange={(v) => setFormData({...formData, zodiac: v})}>
                    <SelectTrigger className="w-full" style={inputStyle}>
                        <SelectValue placeholder="星座 (自动生成)" />
                    </SelectTrigger>
                    <SelectContent className={dropdownContentClass + " h-[300px]"}>
                        {ZODIAC_SIGNS.map(s => <SelectItem key={s} value={s} className={dropdownItemClass}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>

              <Select onValueChange={(v) => setFormData({...formData, mbti: v})}>
                    <SelectTrigger className="w-full" style={inputStyle}>
                        <SelectValue placeholder="MBTI 类型 (选填)" />
                    </SelectTrigger>
                    <SelectContent className={dropdownContentClass + " h-[300px]"}>
                        {MBTI_TYPES.map(t => <SelectItem key={t} value={t} className={dropdownItemClass}>{t}</SelectItem>)}
                    </SelectContent>
              </Select>
              
              <div className="pt-6 border-t border-white/10">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#D4AF37]"/><span className="text-sm text-white/90 font-medium tracking-wider">加入对方信息，解锁双人磁场</span>
                    </div>
                    <Switch checked={!!formData.knowTarget} onCheckedChange={(c) => setFormData({...formData, knowTarget: c})}
                        className="data-[state=checked]:bg-[#D4AF37] border-2 border-white/20" style={{ width: '52px', height: '30px', borderRadius: '99px' }} />
                 </div>
                 
                 {formData.knowTarget && (
                    <div className="space-y-5 pt-2 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Select onValueChange={(v) => setFormData({...formData, targetInfo: {zodiac: v} as any})}>
                                <SelectTrigger className="w-full" style={inputStyle}>
                                    <SelectValue placeholder="对方星座" />
                                </SelectTrigger>
                                <SelectContent className={dropdownContentClass + " h-[200px]"}>
                                    {ZODIAC_SIGNS.map(s => <SelectItem key={s} value={s} className={dropdownItemClass}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Select onValueChange={(v) => setFormData({...formData, targetInfo: {...formData.targetInfo, gender: v} as any})}>
                                <SelectTrigger className="w-full" style={inputStyle}>
                                    <SelectValue placeholder="性别" />
                                </SelectTrigger>
                                <SelectContent className={dropdownContentClass}>
                                    {GENDER_OPTIONS.map(g => <SelectItem key={g.value} value={g.value} className={dropdownItemClass}>{g.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(v) => setFormData({...formData, targetInfo: {...formData.targetInfo, relation: v} as any})}>
                                <SelectTrigger className="w-full" style={inputStyle}>
                                    <SelectValue placeholder="关系" />
                                </SelectTrigger>
                                <SelectContent className={dropdownContentClass}>
                                    {[{ value: "soulmate", label: "Soulmate 灵魂伴侣" }, { value: "crush", label: "Crush 心动对象" }, { value: "partner", label: "Partner 长期伴侣" },
                                      { value: "karmic", label: "Karmic 宿命纠缠" }, { value: "business", label: "Business 事业合伙" }, { value: "friend", label: "Friend 知己好友" }, { value: "enemy", label: "Opponent 竞争对手" }]
                                      .map(r => <SelectItem key={r.value} value={r.value} className={dropdownItemClass}>{r.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                 )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-5 pb-4">
              {occasions.map((occ) => (
                <button key={occ.id} onClick={() => setFormData({...formData, occasion: occ.id})}
                  className="aspect-[5/4] relative overflow-hidden transition-all duration-300 group"
                  style={{...formData.occasion === occ.id ? activeStyle : occasionCardStyle, color: 'white'}}>
                  <div className="flex flex-col items-center justify-center h-full gap-3 relative z-10">
                      <div className={`transform transition-transform ${formData.occasion === occ.id ? 'text-[#D4AF37] scale-110' : 'text-white'}`}><occ.icon className="w-8 h-8" strokeWidth={1.5} /></div>
                      <span className="text-xs font-bold tracking-wide" style={{color: 'white'}}>{occ.labelCn}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
       </div>

       <div className="mt-16 flex items-center gap-4 shrink-0 pb-4">
         {step > 1 && (<button onClick={() => setStep(step - 1)} className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 border border-white/5"><ArrowLeft className="w-6 h-6" /></button>)}
         <Button onClick={() => step < 2 ? setStep(step + 1) : handleStartDivination()} disabled={!isStepValid()} 
           className={`btn-primary flex-1 transition-all ${isStepValid() ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'opacity-50 cursor-not-allowed text-white/50'}`}>
           {step === 2 ? <><Sparkles className="w-5 h-5 mr-2" /> 开启天机</> : "下一步"}
         </Button>
       </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent font-sans text-white overflow-hidden selection:bg-[#D4AF37]/30 py-20 relative">
      <StarBackground />
      <div className="w-full max-w-[480px] relative z-10 px-6 my-auto">
        {appState === "SPLASH" && <SplashScreen onFinish={() => setAppState("INPUT")} />}
        {appState === "INPUT" && renderInput()}
        {appState === "LOADING" && <RitualLoading onFinish={() => {}} />} 
        {appState === "RESULT" && <ResultView data={resultData} onReset={() => {setAppState("INPUT"); setStep(1); setFormData({});}} />}
      </div>
    </div>
  )
}