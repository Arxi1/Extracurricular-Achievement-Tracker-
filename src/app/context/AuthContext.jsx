import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

const API_BASE_URL = 'http://localhost:8080/api/users';

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
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                return true;
            }
        } catch (err) {
            console.error('Login failed', err);
        }
        return false;
    };

    const register = async (userData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (res.ok) {
                const newUser = await res.json();
                setUser(newUser);
                return true;
            }
        } catch (err) {
            console.error('Registration failed', err);
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
