import { useRoute } from './hooks/useRoute';
import PublicSite from './site/PublicSite';
import AdminPage from './admin/AdminPage';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * 整個網站只有兩個畫面：
 *   /       公開網站（訪客看到的乾淨版本，永遠沒有任何管理功能）
 *   /admin  管理後台（要先用 Google 登入）
 */
export default function App() {
  const [route] = useRoute();

  return (
    <ErrorBoundary>
      {route === 'admin' ? <AdminPage /> : <PublicSite />}
    </ErrorBoundary>
  );
}
