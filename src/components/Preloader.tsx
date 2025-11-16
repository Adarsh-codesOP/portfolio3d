import { useEffect, useState, useRef } from 'react';
import './Preloader.css';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const startTimeRef = useRef(Date.now());
  const pageLoadedRef = useRef(false);
  const minDisplayTime = 2000; // 2 seconds minimum

  useEffect(() => {
    const handlePageLoad = () => {
      pageLoadedRef.current = true;
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      // Wait for minimum display time, then fade out
      setTimeout(() => {
        setIsFading(true);
        // Remove from DOM after fade animation
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Match CSS transition duration 
      }, remainingTime);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
      // Also set a fallback timeout to ensure it shows for at least 2 seconds
      const fallbackTimeout = setTimeout(() => {
        if (!pageLoadedRef.current) {
          handlePageLoad();
        }
      }, minDisplayTime);

      return () => {
        window.removeEventListener('load', handlePageLoad);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader-wrapper ${isFading ? 'fade-out' : 'active'}`}>
      <div id="colorWrapper" className="preloader-theme">
        <div className="grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="cube">
              <div className="lifter">
                <div className="cube__face"></div>
                <div className="cube__face"></div>
                <div className="cube__face"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;

