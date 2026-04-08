import React, { createContext, useContext, useState, useEffect } from 'react';

const AchievementContext = createContext(undefined);

const API_BASE_URL = 'http://localhost:8080/api/achievements';

export function AchievementProvider({ children }) {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            // Backend returns date as components if not configured right, but let's assume it returns standard json
            // Sorting to have newest first if not sorted by backend
            setAchievements(data.reverse());
        } catch (error) {
            console.error('Error fetching achievements:', error);
        }
    };

    const addAchievement = async (achievement) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(achievement),
            });
            const newAchievement = await response.json();
            setAchievements(prev => [newAchievement, ...prev]);
        } catch (error) {
            console.error('Error adding achievement:', error);
        }
    };

    const updateAchievement = async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            const updatedAchievement = await response.json();
            setAchievements(prev =>
                prev.map(a => (String(a.id) === String(id) ? updatedAchievement : a))
            );
        } catch (error) {
            console.error('Error updating achievement:', error);
        }
    };

    const deleteAchievement = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
            setAchievements(prev => prev.filter(a => String(a.id) !== String(id)));
        } catch (error) {
            console.error('Error deleting achievement:', error);
        }
    };

    return (
        <AchievementContext.Provider
            value={{
                achievements,
                addAchievement,
                updateAchievement,
                deleteAchievement,
                refreshAchievements: fetchAchievements
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
