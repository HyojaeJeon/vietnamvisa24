
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronUp } from 'lucide-react';

function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showScrollTop) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-0"
      style={{
        background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <ChevronUp className="h-5 w-5 animate-bounce" />
    </Button>
  );
}

export default ScrollToTop;
