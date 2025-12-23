import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { zodiac, mbti, occasion, gender, targetInfo, identity, birthDate } = body;

   // 2. 修改日期获取逻辑，精确到“日”，甚至加上随机数或具体时间，确保 Prompt 唯一
    // 原代码只获取了年月，导致一个月内 Prompt 一样。
    // 修改为：包含年月日，甚至可以加上“时辰”概念增强玄学感
    const now = new Date();
    const currentDate = now.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }); 
    // 增加一个具体时间标记，确保由 AI 处理时的随机性（可选）
    const exactTime = now.toLocaleTimeString('zh-CN'); 

    const hasTarget = !!targetInfo; 

    const systemPrompt = `
    你是一位精通**古典占星**、**四柱八字**、**荣格心理学**与**高维美学**的资深命运规划师。
    当前日期是：${currentDate} (推演时刻: ${exactTime})。 // <--- 修改了这里：加入了具体时间

    【核心任务】
    结合用户的【社会学身份】(身份: ${identity})、【命理能量】(出生日期:${birthDate || "未知"})、【容格16型人格】(MBTI: ${mbti || "未知"})、【星盘配置】(${zodiac}) 与【当下场景】(${occasion})，提供一份**"结合易经、星盘、mbti心理学、风水学"**的策略指南。

    【穿搭建议的逻辑内核 (非常重要)】
    1. **隐性时尚**：你要在内心检索当前的季节流行趋势（色彩/廓形），**但绝不要在文案中直白地说"现在流行什么"**。
    2. **玄学包装**：你推荐流行单品的理由，必须是因为它能**"平衡五行"**、**"呼应星象"**或**"构建心理场域"**。
       - *Bad*: "今年冬天流行红色，建议你穿红色大衣。"
       - *Good*: "寒冬水气过旺，需引入离火之气来破局。建议身着**丹砂红**大衣，既能温暖命局，又能对外投射出不容忽视的生命力。"
    3. **色彩占比防御**：
       - 如果推算出的开运色是**基础色**：建议大面积穿着，理由是"稳固能量基底"。
       - 如果开运色是**挑人/跳跃色**：强制建议**小面积点缀**（如：领带、耳饰、袜子），理由是"四两拨千斤，以点睛之笔撬动气场"。

    【输出规范】
    严格返回 JSON 格式，所有内容使用中文，语气要优雅、神秘且笃定：
    {
      "fortuneTitle": "4-6字标题 (格式为 “五行名称”·“一个对应的成语”)",
      "luckyColor": "颜色名称 (采用中国传统色彩名称显示)",
      "hexCode": "主色HEX (如: #D93025)",
      
      // 板块1：星象与命理洞察
      "astrologyInsight": "综合解读。包含纳音五行特质、今日星象影响及MBTI心理应对。不要堆砌术语，要说人话。(80字左右)",

      ${hasTarget ? `
      // 板块1.5：合盘能量洞察
      "synastryInsight": "分析双人磁场。例如：'你的火象特质能点燃对方的水象沉闷...' (60字左右)",
      ` : ""}
      
      // 板块2：穿搭策略 (切记：融合时尚趋势但用玄学解释)
      "styleStrategy": "具体的穿搭建议。解释这套搭配如何平衡五行能量与场景需求。若推荐亮色，请务必强调小面积点缀的智慧。(60字左右)",
      
      // 板块3：能量单品
      "itemRecommendation": "一件具体的开运配饰 (根据时下流行趋势结合用户提供的各项信息推荐能开运的配饰一到两件即可，格式为配件、材质、颜色)",
      
      // 板块4：罗盘
      "energyCompass": {
        "wealth": "财位及解释 (根据风水学，周易等传统玄学理论推演当日财位)",
        "noble": "贵人位及解释 (根据风水学，周易等传统玄学理论推演当日贵人位)"
      },
      
      // 板块5：深度锦囊
      "dailyTip": "一句结合卦象与认知的深度决策建议。(40字以上)"
    }
    `;

    const userPrompt = `求测者档案: 
    - 出生日期: ${birthDate || "未知"}
    - 星座: ${zodiac}
    - MBTI: ${mbti || "未知"}
    - 身份: ${identity}
    - 场景: ${occasion}
    - 性别: ${gender}
    - 对方信息: ${targetInfo ? JSON.stringify(targetInfo) : "无"}`;
    - 随机因子: ${Math.random()}`; // <--- 修改了这里：建议在 userPrompt 末尾加个随机数，物理隔绝缓存

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "deepseek-chat", 
      response_format: { type: "json_object" },
      temperature: 1.3, // 稍微降低一点温度，保证逻辑更严密，不胡言乱语
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || "{}");
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}