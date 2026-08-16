/** 載入整站資料，並提供「重新載入」的方法 */
import { useCallback, useEffect, useState } from 'react';
import { loadSiteData } from '../lib/store';
import type { SiteData } from '../types';

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setError('');
    try {
      const result = await loadSiteData();
      setData(result);
    } catch (e) {
      console.error(e);
      setError('資料暫時無法載入，請稍後重新整理。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}
