import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RouterContextValue {
  pathname: string;
  hash: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: '/',
  hash: '',
  navigate: () => {},
});

function normalizePath(path: string): string {
  const clean = path.split('#')[0].split('?')[0] || '/';
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1);
  }
  return clean;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => normalizePath(window.location.pathname));
  const [hash, setHash] = useState<string>(() => window.location.hash);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname));
      setHash(window.location.hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to hash anchor or top of page on route transition
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const attemptScroll = (tries = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (tries < 10) {
          window.setTimeout(() => attemptScroll(tries + 1), 60);
        }
      };
      attemptScroll();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  const navigate = useCallback((to: string) => {
    if (/^https?:\/\//.test(to) || to.startsWith('mailto:')) {
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }

    const url = new URL(to, window.location.origin);
    const nextPath = normalizePath(url.pathname);
    const nextHash = url.hash;
    const samePath = nextPath === pathname;

    if (samePath && nextHash) {
      window.history.pushState({}, '', `${nextPath}${nextHash}`);
      setHash(nextHash);
      const target = document.getElementById(nextHash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', `${nextPath}${nextHash}`);
    setPathname(nextPath);
    setHash(nextHash);
  }, [pathname]);

  return (
    <RouterContext.Provider value={{ pathname, hash, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  return useContext(RouterContext);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export const Link: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
