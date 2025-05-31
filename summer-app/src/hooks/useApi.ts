import { useState, useEffect } from 'react';
import { DailyInsight } from '../types';

const API_BASE = 'https://sd-6310-2025-summer-express-app.onrender.com/api';

export function useApi() {
  const [insights, setInsights] = useState<DailyInsight>({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [quoteRes, fortuneRes, colorRes] = await Promise.all([
          fetch(`${API_BASE}/quote`).catch(() => null),
          fetch(`${API_BASE}/fortune-cookie`).catch(() => null),
          fetch(`${API_BASE}/color`).catch(() => null),
        ]);

        const data: DailyInsight = {};
        let successCount = 0;

        if (quoteRes?.ok) {
          const quote = await quoteRes.json();
          if (quote.quote) {
            data.quote = quote.quote;
            successCount++;
          }
        }

        if (fortuneRes?.ok) {
          const fortune = await fortuneRes.json();
          if (fortune.fortune) {
            data.fortune = fortune.fortune;
            successCount++;
          }
        }

        if (colorRes?.ok) {
          const color = await colorRes.json();
          if (color.color) {
            data.color = color.color;
            successCount++;
          }
        }

        setInsights(data);
        setConnected(successCount > 0);
      } catch (error) {
        console.error('API fetch error:', error);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { insights, loading, connected };
}