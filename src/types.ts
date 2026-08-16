/** 網站所有資料的型別定義（就是「資料長什麼樣子」） */

export interface Profile {
  name: string;
  tagline: string;      // 一句自我介紹
  school: string;
  grade: string;
  interests: string[];  // 興趣
  intro: string;        // 關於我
  direction: string;    // 學習方向
  learning: string;     // 目前正在學什麼
  future: string;       // 未來想挑戰的事
  photoId: string | null; // 個人照片（存在 projectImages 的文件 id）
  photoUrl: string;       // 沒有上傳照片時使用的預設圖片
}

export interface Project {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  challenge: string;
  solution: string;
  reflection: string;
  imageIds: string[];   // 對應 projectImages 的文件 id（最多 3 張）
  videoUrl: string;     // Google Drive 影片分享連結
  order: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  order: number;
}

export interface Settings {
  accent: string;       // 主色
}

export interface SiteData {
  profile: Profile;
  projects: Project[];
  timeline: TimelineItem[];
  skills: Skill[];
  settings: Settings;
  /** 這些區塊目前顯示的是「示範資料」（Firestore 還沒有正式資料） */
  usingSample: {
    profile: boolean;
    projects: boolean;
    timeline: boolean;
    skills: boolean;
  };
}
