import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('ft_token');
        const stored = localStorage.getItem('ft_user');
        if (token && stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('ft_token', data.token);
        localStorage.setItem('ft_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (name, email, password, monthlyBudget) => {
        const { data } = await authAPI.register({ name, email, password, monthlyBudget });
        localStorage.setItem('ft_token', data.token);
        localStorage.setItem('ft_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('ft_token');
        localStorage.removeItem('ft_user');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('ft_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
