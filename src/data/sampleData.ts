/**
 * 示範資料：第一次打開網站、Firestore 還沒有任何資料時顯示。
 * 一旦你從 /admin 儲存過正式資料，這裡的內容就不會再蓋掉你的資料。
 */
import type { Profile, Project, Skill, TimelineItem } from '../types';
import { DEFAULT_ACCENT } from '../config';

export const sampleProfile: Profile = {
  name: '楊博勛',
  tagline: '喜歡透過科技與創作，解決生活中的問題。',
  school: '家齊高中',
  grade: '高中一年級',
  interests: ['程式設計', '打網球', 'AI 應用', '攝影'],
  intro:
    '我是楊博勛，目前就讀家齊高中一年級。我喜歡動手把想法做出來，從一個小小的點子開始，'
    + '慢慢變成可以被別人使用的作品。做專題的過程中，我最享受的是「卡住 → 想辦法 → 成功」的那一刻。',
  direction: '資訊科技與 AI 應用，並結合設計，把技術變成真的好用的東西。',
  learning: '正在學 Python、網頁前端（React），以及怎麼用 AI 工具幫自己加速學習。',
  future: '希望完成一個能真正被同學使用的校園小工具，並挑戰參加全國性的資訊或機器人競賽。',
  photoId: null,
  photoUrl: '/profile.jpg',
};

export const sampleProjects: Project[] = [
  {
    id: 'sample-1',
    title: '我的第一個 AI 專題',
    date: '2026-03',
    category: 'AI',
    summary: '用 AI 幫同學整理筆記，把上課講義自動變成重點條列與練習題。',
    content:
      '這是我第一次自己完整做完的 AI 專題。我先訪問了班上 10 位同學，發現大家最花時間的不是讀書，'
      + '而是「整理筆記」。所以我做了一個小工具：把講義文字貼上去，就會自動輸出重點整理與 5 題練習題。',
    challenge: '一開始 AI 產生的重點常常太籠統，而且偶爾會亂編內容，同學看了反而更混亂。',
    solution:
      '我把一次問完改成分成三步：先摘要、再分類、最後才出題，並要求每個重點都要標出處。'
      + '這樣結果穩定很多，也比較不會亂寫。',
    reflection:
      '我學到 AI 不是「問一次就好」，而是要把問題拆小。這個想法後來也影響我寫程式的方式：先拆解，再動手。',
    imageIds: [],
    videoUrl: '',
    order: 1,
  },
  {
    id: 'sample-2',
    title: '機器人挑戰',
    date: '2025-11',
    category: '機器人',
    summary: '和隊友一起用 Arduino 做出能自動避障、走完指定路線的小車。',
    content:
      '我負責感測器與程式的部分，隊友負責結構。我們用超音波感測器判斷前方距離，'
      + '再用簡單的邏輯決定要左轉還是右轉，最後在校內比賽完成全程路線。',
    challenge: '小車在轉彎時常常撞到牆，因為感測器讀到的距離會忽大忽小。',
    solution:
      '我把單次讀值改成「連續讀 5 次取中位數」，再加上一點延遲，讓數值穩定下來，撞牆情況幾乎消失。',
    reflection: '硬體跟軟體要一起想。程式再漂亮，如果感測器裝的角度不對，一樣不會動。',
    imageIds: [],
    videoUrl: '',
    order: 2,
  },
  {
    id: 'sample-3',
    title: '我的學習反思',
    date: '2026-06',
    category: '學習歷程',
    summary: '整理高一這一年的學習方式改變，找出真正適合自己的節奏。',
    content:
      '我把這學期每一次考試前的準備方式記錄下來，發現「提前七天、每天 30 分鐘」的效果，'
      + '遠比考前一天熬夜好很多，而且隔天上課精神也差很多。',
    challenge: '一開始我以為只要花的總時間一樣就好，所以常常拖到最後一天。',
    solution: '我用行事曆把讀書時間切成小塊，並且每天結束時寫下一句「今天學會什麼」。',
    reflection: '學習不是比誰熬夜久，而是比誰更了解自己。這個習慣我打算高二繼續維持。',
    imageIds: [],
    videoUrl: '',
    order: 3,
  },
];

export const sampleTimeline: TimelineItem[] = [
  { id: 'st-1', year: '2024', title: '第一次學習程式設計', description: '在課堂上寫出第一支 Python 程式，第一次覺得電腦聽我的話。', order: 1 },
  { id: 'st-2', year: '2025', title: '第一次完成專題', description: '和隊友完成機器人挑戰，學會怎麼分工與溝通。', order: 2 },
  { id: 'st-3', year: '2026', title: '第一次使用 AI 做專題', description: '把 AI 當成工具而不是答案，完成第一個 AI 小應用。', order: 3 },
  { id: 'st-4', year: '2026', title: '完成我的學習歷程網站', description: '自己動手做出可以持續更新的個人網站。', order: 4 },
  { id: 'st-5', year: '未來', title: '下一個學習目標', description: '做出一個真的有人使用的校園小工具，並挑戰對外比賽。', order: 5 },
];

export const sampleSkills: Skill[] = [
  { id: 'ss-1', name: 'AI', order: 1 },
  { id: 'ss-2', name: '程式設計', order: 2 },
  { id: 'ss-3', name: '機器人', order: 3 },
  { id: 'ss-4', name: '簡報', order: 4 },
  { id: 'ss-5', name: '設計', order: 5 },
  { id: 'ss-6', name: 'Arduino', order: 6 },
  { id: 'ss-7', name: '攝影', order: 7 },
];

export const sampleSettings = { accent: DEFAULT_ACCENT };
