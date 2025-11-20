import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// SplitText is loaded from CDN in index.html
declare global {
    interface Window {
        SplitText: any;
    }
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: string;
    splitType?: string;
    from?: any;
    to?: any;
    threshold?: number;
    rootMargin?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
    tag?: string;
    onLetterAnimationComplete?: () => void;
}

const SplitText = ({
    text,
    className = '',
    delay = 100,
    duration = 0.6,
    ease = 'power3.out',
    splitType = 'chars',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = '-100px',
    textAlign = 'center',
    tag = 'p',
    onLetterAnimationComplete
}: SplitTextProps) => {
    const ref = useRef(null);
    const animationCompletedRef = useRef(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        if (document.fonts.status === 'loaded') {
            setFontsLoaded(true);
        } else {
            document.fonts.ready.then(() => {
                setFontsLoaded(true);
            });
        }
    }, []);

    useGSAP(
        () => {
            if (!ref.current || !text || !fontsLoaded) return;
            const el = ref.current;

            if (el._rbsplitInstance) {
                try {
                    el._rbsplitInstance.revert();
                } catch (_) {
                    /* noop */
                }
                el._rbsplitInstance = null;
            }

            const startPct = (1 - threshold) * 100;
            const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
            const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
            const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
            const sign =
                marginValue === 0
                    ? ''
                    : marginValue < 0
                        ? `-=${Math.abs(marginValue)}${marginUnit}`
                        : `+=${marginValue}${marginUnit}`;
            const start = `top ${startPct}%${sign}`;

            let targets;
            const assignTargets = self => {
                if (splitType.includes('chars') && self.chars.length) targets = self.chars;
                if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
                if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
                if (!targets) targets = self.chars || self.words || self.lines;
            };

            if (!window.SplitText) return;

            const splitInstance = new window.SplitText(el, {
                type: splitType,
                smartWrap: true,
                autoSplit: splitType === 'lines',
                linesClass: 'split-line',
                wordsClass: 'split-word',
                charsClass: 'split-char',
                reduceWhiteSpace: false,
                onSplit: self => {
                    assignTargets(self);
                    const tween = gsap.fromTo(
                        targets,
                        { ...from },
                        {
                            ...to,
                            duration,
                            ease,
                            stagger: delay / 1000,
                            scrollTrigger: {
                                trigger: el,
                                start,
                                once: true,
                                fastScrollEnd: true,
                                anticipatePin: 0.4
                            },
                            onComplete: () => {
                                animationCompletedRef.current = true;
                                onLetterAnimationComplete?.();
                            },
                            willChange: 'transform, opacity',
                            force3D: true
                        }
                    );
                    return tween;
                }
            });

            el._rbsplitInstance = splitInstance;

            return () => {
                ScrollTrigger.getAll().forEach(st => {
                    if (st.trigger === el) st.kill();
                });
                try {
                    splitInstance.revert();
                } catch (_) {
                    /* noop */
                }
                el._rbsplitInstance = null;
            };
        },
        {
            dependencies: [
                text,
                delay,
                duration,
                ease,
                splitType,
                JSON.stringify(from),
                JSON.stringify(to),
                threshold,
                rootMargin,
                fontsLoaded,
                onLetterAnimationComplete
            ],
            scope: ref
        }
    );

    const renderTag = () => {
        const style: React.CSSProperties = {
            textAlign: textAlign as any,
            overflow: 'hidden',
            display: 'inline-block',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            willChange: 'transform, opacity'
        };
        const classes = `split-parent ${className}`;

        // Safety check: if SplitText is not loaded, just render the text without animation
        if (typeof window !== 'undefined' && !window.SplitText) {
            return (
                <div className={className} style={{ textAlign: textAlign as any }}>
                    {text}
                </div>
            );
        }

        switch (tag) {
            case 'h1':
                return (
                    <h1 ref={ref} style={style} className={classes}>
                        {text}
                    </h1>
                );
            case 'h2':
                return (
                    <h2 ref={ref} style={style} className={classes}>
                        {text}
                    </h2>
                );
            case 'h3':
                return (
                    <h3 ref={ref} style={style} className={classes}>
                        {text}
                    </h3>
                );
            case 'h4':
                return (
                    <h4 ref={ref} style={style} className={classes}>
                        {text}
                    </h4>
                );
            case 'h5':
                return (
                    <h5 ref={ref} style={style} className={classes}>
                        {text}
                    </h5>
                );
            case 'h6':
                return (
                    <h6 ref={ref} style={style} className={classes}>
                        {text}
                    </h6>
                );
            default:
                return (
                    <p ref={ref} style={style} className={classes}>
                        {text}
                    </p>
                );
        }
    };
    return renderTag();
};

export default SplitText;
