export type Occasion = "solo" | "work" | "business" | "date" | "party" | "family" | "travel" | "interview";

export type Gender = "male" | "female" | "non-binary" | "secret";

export interface TargetInfo {
  zodiac: string;
  gender: Gender;
  relation: string;
}

export interface FormData {
  identity: string;
  gender: Gender;
  // 👇 新增：出生日期字段
  birthDate: string; 
  zodiac: string;
  mbti?: string;
  occasion: Occasion;
  knowTarget: boolean;
  targetInfo?: TargetInfo;
}