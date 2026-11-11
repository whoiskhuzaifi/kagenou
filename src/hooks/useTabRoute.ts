import { useCallback, useEffect, useState } from 'react';
import type { TabId } from '../types';

export type Route = TabId | 'not-found';

// Record<TabId, ...> memastikan TypeScript memaksa path ditambahkan setiap ada TabId baru.
const TAB_PATHS: Record<TabId, string> = {
  dashboard: '/',
  schedule: '/schedule',
  announcements: '/announcements',
  tasks: '/tasks',
  finance: '/finance',
  academic: '/academic',
  forum: '/forum',
};

const PATH_TO_TAB = new Map<string, TabId>(
  (Object.entries(TAB_PATHS) as Array<[TabId, string]>).map(([tab, path]) => [path, tab]),
);

function parsePath(pathname: string): Route {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return PATH_TO_TAB.get(clean) ?? 'not-found';
}

/** Routing ringan berbasis History API (tanpa dependency) — mendukung deep link, tombol back/forward, dan 404. */
export function useTabRoute() {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((tab: TabId) => {
    const path = TAB_PATHS[tab];
    if (window.location.pathname !== path) window.history.pushState(null, '', path);
    setRoute(tab);
  }, []);

  return { route, navigate };
}
