import React, { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceContextType {
    minimalFX: boolean;
    toggleMinimalFX: () => void;
    isLowEndDevice: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLowEndDevice, setIsLowEndDevice] = useState(false);
    // Default to false initially, will be updated in useEffect based on device/storage
    const [minimalFX, setMinimalFX] = useState(false);

    useEffect(() => {
        // Detect low-end device
        const checkLowEndDevice = () => {
            const navigatorAny = navigator as any;
            const ram = navigatorAny.deviceMemory || 4;
            const cores = navigator.hardwareConcurrency || 4;

            // Consider low end if RAM <= 4GB or Cores <= 4
            const isLowEnd = ram <= 4 || cores <= 4;
            setIsLowEndDevice(isLowEnd);
            return isLowEnd;
        };

        const lowEnd = checkLowEndDevice();

        // Initialize minimalFX from localStorage or device detection
        const storedPreference = localStorage.getItem('minimalFX');
        if (storedPreference !== null) {
            setMinimalFX(storedPreference === 'true');
        } else {
            // Default based on device capability: 
            // Low End -> Minimal FX (true)
            // High End -> Max FX (false)
            setMinimalFX(lowEnd);
        }
    }, []);

    const toggleMinimalFX = () => {
        setMinimalFX((prev) => {
            const newValue = !prev;
            localStorage.setItem('minimalFX', String(newValue));
            return newValue;
        });
    };

    return (
        <PerformanceContext.Provider value={{ minimalFX, toggleMinimalFX, isLowEndDevice }}>
            {children}
        </PerformanceContext.Provider>
    );
};

export const usePerformance = () => {
    const context = useContext(PerformanceContext);
    if (context === undefined) {
        throw new Error('usePerformance must be used within a PerformanceProvider');
    }
    return context;
};
