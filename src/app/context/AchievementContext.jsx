import React, { createContext, useContext, useState } from 'react';
import { mockAchievements } from '../data/mockData';

const AchievementContext = createContext(undefined);

export function AchievementProvider({ children }) {
    const [achievements, setAchievements] = useState(mockAchievements);

    const addAchievement = (achievement) => {
        setAchievements(prev => [achievement, ...prev]);
    };

    const updateAchievement = (id, updates) => {
        setAchievements(prev =>
            prev.map(a => (a.id === id ? { ...a, ...updates } : a))
        );
    };

    const deleteAchievement = (id) => {
        setAchievements(prev => prev.filter(a => a.id !== id));
    };

    return (
        <AchievementContext.Provider
            value={{
                achievements,
                addAchievement,
                updateAchievement,
                deleteAchievement,
            }}
        >
            {children}
        </AchievementContext.Provider>
    );
}

export function useAchievements() {
    const context = useContext(AchievementContext);
    if (context === undefined) {
        throw new Error('useAchievements must be used within an AchievementProvider');
    }
    return context;
}
