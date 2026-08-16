/**
 * 資料存取層：整個網站只有這個檔案會直接碰資料庫。
 *
 * - 有設定 Firebase → 讀寫 Firestore（資料永久保存）
 * - 沒有設定 Firebase → 讀寫瀏覽器 localStorage（本機示範模式，畫面照樣完整）
 *
 * Firestore 結構（刻意保持簡單）：
 *   siteProfile/main      基本資料
 *   settings/site         網站設定（主色）
 *   projects/{id}         作品文字資料
 *   projectImages/{id}    圖片（一張圖一份文件，避免單一文件過大）
 *   timeline/{id}         學習歷程
 *   skills/{id}           技能
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getDbSafe, isFirebaseReady } from '../firebase';
import type { Profile, Project, Settings, SiteData, Skill, TimelineItem } from '../types';
import {
  sampleProfile,
  sampleProjects,
  sampleSettings,
  sampleSkills,
  sampleTimeline,
} from '../data/sampleData';
import { DEFAULT_ACCENT } from '../config';

export type Backend = 'firebase' | 'local';
export const backend: Backend = isFirebaseReady ? 'firebase' : 'local';

const LOCAL_KEY = 'learning-portfolio-data';
const LOCAL_IMAGE_KEY = 'learning-portfolio-images';

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/* ------------------------------------------------------------------ */
/* 本機模式（localStorage）                                            */
/* ------------------------------------------------------------------ */

interface LocalShape {
  profile: Profile | null;
  settings: Settings | null;
  projects: Project[];
  timeline: TimelineItem[];
  skills: Skill[];
}

function readLocal(): LocalShape {
  const empty: LocalShape = { profile: null, settings: null, projects: [], timeline: [], skills: [] };
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as Partial<LocalShape>) };
  } catch {
    return empty;
  }
}

function writeLocal(data: LocalShape): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

function readLocalImages(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOCAL_IMAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeLocalImages(images: Record<string, string>): void {
  localStorage.setItem(LOCAL_IMAGE_KEY, JSON.stringify(images));
}

/* ------------------------------------------------------------------ */
/* 讀取整站資料                                                        */
/* ------------------------------------------------------------------ */

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function fallback(
  profile: Profile | null,
  settings: Settings | null,
  projects: Project[],
  timeline: TimelineItem[],
  skills: Skill[],
): SiteData {
  return {
    profile: profile ?? sampleProfile,
    settings: settings ?? { accent: sampleSettings.accent || DEFAULT_ACCENT },
    projects: projects.length ? sortByOrder(projects) : sampleProjects,
    timeline: timeline.length ? sortByOrder(timeline) : sampleTimeline,
    skills: skills.length ? sortByOrder(skills) : sampleSkills,
    usingSample: {
      profile: !profile,
      projects: projects.length === 0,
      timeline: timeline.length === 0,
      skills: skills.length === 0,
    },
  };
}

export async function loadSiteData(): Promise<SiteData> {
  if (backend === 'local') {
    const local = readLocal();
    return fallback(local.profile, local.settings, local.projects, local.timeline, local.skills);
  }

  const db = getDbSafe();
  if (!db) return fallback(null, null, [], [], []);

  const [profileSnap, settingsSnap, projectsSnap, timelineSnap, skillsSnap] = await Promise.all([
    getDoc(doc(db, 'siteProfile', 'main')),
    getDoc(doc(db, 'settings', 'site')),
    getDocs(collection(db, 'projects')),
    getDocs(collection(db, 'timeline')),
    getDocs(collection(db, 'skills')),
  ]);

  const profile = profileSnap.exists() ? (profileSnap.data() as Profile) : null;
  const settings = settingsSnap.exists() ? (settingsSnap.data() as Settings) : null;
  const projects = projectsSnap.docs.map((d) => ({ ...(d.data() as Project), id: d.id }));
  const timeline = timelineSnap.docs.map((d) => ({ ...(d.data() as TimelineItem), id: d.id }));
  const skills = skillsSnap.docs.map((d) => ({ ...(d.data() as Skill), id: d.id }));

  return fallback(profile, settings, projects, timeline, skills);
}

/* ------------------------------------------------------------------ */
/* 寫入：基本資料 / 網站設定                                            */
/* ------------------------------------------------------------------ */

export async function saveProfile(profile: Profile): Promise<void> {
  if (backend === 'local') {
    const local = readLocal();
    writeLocal({ ...local, profile });
    return;
  }
  const db = getDbSafe();
  if (!db) throw new Error('Firestore 尚未初始化');
  await setDoc(doc(db, 'siteProfile', 'main'), profile);
}

export async function saveSettings(settings: Settings): Promise<void> {
  if (backend === 'local') {
    const local = readLocal();
    writeLocal({ ...local, settings });
    return;
  }
  const db = getDbSafe();
  if (!db) throw new Error('Firestore 尚未初始化');
  await setDoc(doc(db, 'settings', 'site'), settings);
}

/* ------------------------------------------------------------------ */
/* 寫入：作品 / 學習歷程 / 技能（三者寫法一模一樣）                      */
/* ------------------------------------------------------------------ */

type CollectionName = 'projects' | 'timeline' | 'skills';
type LocalListKey = 'projects' | 'timeline' | 'skills';

async function saveItem<T extends { id: string }>(name: CollectionName, item: T): Promise<string> {
  const id = item.id && !item.id.startsWith('sample-') && !item.id.startsWith('ss-') && !item.id.startsWith('st-')
    ? item.id
    : newId();
  const payload = { ...item, id };

  if (backend === 'local') {
    const local = readLocal();
    const key = name as LocalListKey;
    const list = [...(local[key] as unknown as T[])];
    const index = list.findIndex((x) => x.id === id);
    if (index >= 0) list[index] = payload;
    else list.push(payload);
    writeLocal({ ...local, [key]: list } as LocalShape);
    return id;
  }

  const db = getDbSafe();
  if (!db) throw new Error('Firestore 尚未初始化');
  const { id: _ignored, ...data } = payload as Record<string, unknown> & { id: string };
  await setDoc(doc(db, name, id), data);
  return id;
}

async function removeItem(name: CollectionName, id: string): Promise<void> {
  if (backend === 'local') {
    const local = readLocal();
    const key = name as LocalListKey;
    const list = (local[key] as Array<{ id: string }>).filter((x) => x.id !== id);
    writeLocal({ ...local, [key]: list } as LocalShape);
    return;
  }
  const db = getDbSafe();
  if (!db) throw new Error('Firestore 尚未初始化');
  await deleteDoc(doc(db, name, id));
}

export const saveProject = (p: Project) => saveItem('projects', p);
export const deleteProject = (id: string) => removeItem('projects', id);

export const saveTimelineItem = (t: TimelineItem) => saveItem('timeline', t);
export const deleteTimelineItem = (id: string) => removeItem('timeline', id);

export const saveSkill = (s: Skill) => saveItem('skills', s);
export const deleteSkill = (id: string) => removeItem('skills', id);

/* ------------------------------------------------------------------ */
/* 圖片：一張圖一份文件                                                 */
/* ------------------------------------------------------------------ */

const imageCache = new Map<string, string>();

export async function saveImage(dataUrl: string): Promise<string> {
  const id = newId();

  if (backend === 'local') {
    const images = readLocalImages();
    images[id] = dataUrl;
    writeLocalImages(images);
    imageCache.set(id, dataUrl);
    return id;
  }

  const db = getDbSafe();
  if (!db) throw new Error('Firestore 尚未初始化');
  await setDoc(doc(db, 'projectImages', id), { data: dataUrl, createdAt: Date.now() });
  imageCache.set(id, dataUrl);
  return id;
}

export async function loadImage(id: string): Promise<string | null> {
  if (!id) return null;
  const cached = imageCache.get(id);
  if (cached) return cached;

  if (backend === 'local') {
    const images = readLocalImages();
    const value = images[id] ?? null;
    if (value) imageCache.set(id, value);
    return value;
  }

  const db = getDbSafe();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'projectImages', id));
  if (!snap.exists()) return null;
  const value = (snap.data() as { data?: string }).data ?? null;
  if (value) imageCache.set(id, value);
  return value;
}

export async function deleteImage(id: string): Promise<void> {
  imageCache.delete(id);

  if (backend === 'local') {
    const images = readLocalImages();
    delete images[id];
    writeLocalImages(images);
    return;
  }

  const db = getDbSafe();
  if (!db) return;
  await deleteDoc(doc(db, 'projectImages', id));
}

/* ------------------------------------------------------------------ */
/* 把示範資料複製成正式資料（只有管理員在後台按下才會執行）              */
/* ------------------------------------------------------------------ */

export async function copySampleDataToDatabase(): Promise<void> {
  await saveProfile(sampleProfile);
  await saveSettings({ accent: DEFAULT_ACCENT });
  for (const project of sampleProjects) {
    await saveProject({ ...project, id: '' });
  }
  for (const item of sampleTimeline) {
    await saveTimelineItem({ ...item, id: '' });
  }
  for (const skill of sampleSkills) {
    await saveSkill({ ...skill, id: '' });
  }
}
