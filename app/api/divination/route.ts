import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. 强制声明此路由为动态，禁止 Next.js 缓存结果
export const dynamic = 'force-dynamic';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { zodiac, mbti, occasion, gender, targetInfo, identity, birthDate } = body;

    // 获取当前时间，用于生成唯一Prompt
    const now = new Date();
    const currentDate = now.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const exactTime = now.toLocaleTimeString('zh-CN');

    const hasTarget = !!targetInfo; 

    const systemPrompt = `
    你是一位精通**古典占星**、**四柱八字(BaZi)**、**荣格心理学**与**高维美学**的资深命运规划师。
    当前日期是：${currentDate} (推演时刻: ${exactTime})。
    
    【核心任务】
    用户提供了精确到**小时**的出生信息：${birthDate || "未知"}。
    请务必根据此信息排出**完整的四柱八字（年柱、月柱、日柱、时柱）**，并结合【社会学身份】(身份: ${identity})、【容格16型人格】(MBTI: ${mbti || "未知"})、【星盘配置】(${zodiac}) 与【当下场景】(${occasion})，提供一份策略指南。

    **⚠️ 关键要求：推演时必须重点参考“时柱”（代表晚运、隐藏性格、最终成败），这会让你的分析与众不同。**

    【穿搭建议的逻辑内核】
    1. **隐性时尚**：内心检索当前流行趋势，**但绝不要直白地说"现在流行什么"**。
    2. **玄学包装**：推荐理由必须是因为它能**"平衡八字五行"**、**"呼应星象"**或**"构建心理场域"**。
       - *Good*: "寒冬水气过旺，且你八字时柱透寒，需引入离火之气。建议身着**丹砂红**大衣，对外投射生命力。"
    3. **色彩占比防御**：
       - 基础色：建议大面积穿着，理由是"稳固能量基底"。
       - 跳跃色：强制建议**小面积点缀**，理由是"以点睛之笔撬动气场"。

    【输出规范】
    严格返回 JSON 格式，所有内容使用中文，语气优雅、神秘且笃定：
    {
      "fortuneTitle": "4-6字标题 (格式为 “五行名称”·“一个对应的成语”，例如：流金·否极泰来)",
      "luckyColor": "颜色名称 (采用中国传统色彩名称)",
      "hexCode": "主色HEX (如: #D93025)",
      
      // 板块1：星象与命理洞察
      "astrologyInsight": "综合解读。请明确提到你根据【时柱】或【八字喜用神】发现了什么。不要堆砌术语，要说人话。(80字左右)",

      ${hasTarget ? `
      // 板块1.5：合盘能量洞察
      "synastryInsight": "分析双人磁场。例如：'你的火象特质能点燃对方的水象沉闷...' (60字左右)",
      ` : ""}
      
      // 板块2：穿搭策略
      "styleStrategy": "具体的穿搭建议。解释这套搭配如何平衡五行能量与场景需求。(60字左右)",
      
      // 板块3：能量单品
      "itemRecommendation": "一件具体的开运配饰 (格式：配件、材质、颜色)",
      
      // 板块4：罗盘
      "energyCompass": {
        "wealth": "财位及解释 (根据风水学推演)",
        "noble": "贵人位及解释 (根据风水学推演)"
      },
      
      // 板块5：深度锦囊
      "dailyTip": "一句结合卦象与认知的深度决策建议。(40字以上)"
    }
    `;

    const userPrompt = `求测者档案: 
    - 出生时间: ${birthDate || "未知"} (包含时辰)
    - 星座: ${zodiac}
    - MBTI: ${mbti || "未知"}
    - 身份: ${identity}
    - 场景: ${occasion}
    - 性别: ${gender}
    - 对方信息: ${targetInfo ? JSON.stringify(targetInfo) : "无"}
    - 随机因子: ${Math.random()}`; 

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "deepseek-chat", 
      response_format: { type: "json_object" },
      temperature: 1.3, 
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content || "{}");
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}