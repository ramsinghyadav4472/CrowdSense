import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

interface AuthContextType {
    user: any;
    login: (user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setUser(user);
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
