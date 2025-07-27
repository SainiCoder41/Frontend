import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme class to the root element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    
    // Optionally save to localStorage
    localStorage.setItem('theme', mode);
  }, [mode]);

  return children;
};

export default ThemeProvider;