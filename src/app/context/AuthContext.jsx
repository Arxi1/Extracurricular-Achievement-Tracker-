import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

import API_BASE_URL from '@/config/api';

const AUTH_API_URL = `${API_BASE_URL}/users`;


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${AUTH_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                return true;
            }
            console.error('Login failed with status:', res.status);
        } catch (err) {
            console.error('Login network error:', err);
        }
        return false;
    };

    const register = async (userData) => {
        try {
            const res = await fetch(`${AUTH_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (res.ok) {
                const newUser = await res.json();
                setUser(newUser);
                return true;
            }
            console.error('Registration failed with status:', res.status);
        } catch (err) {
            console.error('Registration network error:', err);
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};
