import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (state?.scrollRestored) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, state]);
  return null;
};

export default ScrollToTop;