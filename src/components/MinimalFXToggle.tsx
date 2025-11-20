import { usePerformance } from '@/hooks/usePerformance';
import { Zap, ZapOff } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const MinimalFXToggle = () => {
    const { minimalFX, toggleMinimalFX } = usePerformance();
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const { scrollY } = useScroll();
    const isMobile = useIsMobile();

    // Don't render on mobile
    if (isMobile) return null;

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show if at top (within 100px) or if previously hidden and now scrolling up (optional, but user asked for top/hover)
        // User specific request: "hides ones you start scrolling only visible if you put your cursor over the notch or if you get to top of the page"
        if (latest < 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none h-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={{
                    y: (isVisible || isHovered) ? 0 : -100,
                    opacity: (isVisible || isHovered) ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto"
            >
                <button
                    onClick={toggleMinimalFX}
                    className={`
            group relative flex items-center gap-1 p-1 rounded-full 
            backdrop-blur-md border transition-all duration-500 ease-out
            ${minimalFX
                            ? 'bg-background/40 border-border/40 shadow-lg shadow-black/5'
                            : 'bg-background/20 border-white/10 shadow-lg shadow-primary/5'
                        }
          `}
                >
                    {/* Sliding Indicator */}
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`
              absolute top-1 bottom-1 rounded-full shadow-sm backdrop-blur-sm
              ${minimalFX
                                ? 'left-1 w-[calc(50%-2px)] bg-background/80 border border-white/5'
                                : 'left-[calc(50%+1px)] w-[calc(50%-2px)] bg-primary/80 border border-primary/20'
                            }
            `}
                    />

                    {/* Minimal FX Option */}
                    <div className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${minimalFX ? 'text-foreground' : 'text-muted-foreground/70 group-hover:text-muted-foreground'}`}>
                        <ZapOff size={14} strokeWidth={2.5} />
                        <span className="text-xs font-semibold tracking-wide">Minimal</span>
                    </div>

                    {/* High FX Option */}
                    <div className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${!minimalFX ? 'text-primary-foreground' : 'text-muted-foreground/70 group-hover:text-muted-foreground'}`}>
                        <Zap size={14} strokeWidth={2.5} />
                        <span className="text-xs font-semibold tracking-wide">High FX</span>
                    </div>
                </button>
            </motion.div>

            {/* Invisible hover trigger area when hidden */}
            {(!isVisible && !isHovered) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 pointer-events-auto cursor-pointer" />
            )}
        </div>
    );
};
