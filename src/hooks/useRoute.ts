/**
 * 超輕量路由：只有兩條路線 —— 首頁 '/' 與後台 '/admin'。
 * 不使用額外套件，避免任何 build / 部署問題。
 *
 * 兩種網址都認得（部署平台若不支援 SPA fallback，用 #/admin 一定進得去）：
 *   https://你的網站/admin
 *   https://你的網站/#/admin
 */
import { useEffect, useState } from 'react';

export type Route = 'home' | 'admin';

function currentRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (path.endsWith('/admin') || hash === 'admin') return 'admin';
  return 'home';
}

export function useRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    const onChange = () => setRoute(currentRoute());
    window.addEventListener('popstate', onChange);
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('hashchange', onChange);
    };
  }, []);

  function navigate(next: Route) {
    const url = next === 'admin' ? '/admin' : '/';
    try {
      window.history.pushState({}, '', url);
    } catch {
      window.location.hash = next === 'admin' ? '#/admin' : '';
    }
    setRoute(next);
    window.scrollTo({ top: 0 });
  }

  return [route, navigate];
}
