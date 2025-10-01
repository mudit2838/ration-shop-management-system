
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthenticatedUser, UserRole } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  login: (role: UserRole, id: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const { users, shops, admins } = useData();

  const login = (role: UserRole, identifier: string, pass: string): boolean => {
    let userToAuth = null;
    let details: any = null;

    if (role === UserRole.USER) {
      details = users.find(u => (u.rationCardNumber === identifier || u.aadhaarNumber === identifier) && u.password === pass);
      if (details) userToAuth = { id: details.id, name: details.name, role: UserRole.USER, details };
    } else if (role === UserRole.DEALER) {
      details = shops.find(s => s.dealerId === identifier && s.password === pass);
      if (details) userToAuth = { id: details.id, name: details.dealerName, role: UserRole.DEALER, details };
    } else if (role === UserRole.ADMIN) {
      details = admins.find(a => a.adminId === identifier && a.password === pass);
      if (details) userToAuth = { id: details.id, name: details.name, role: UserRole.ADMIN, details };
    }

    if (userToAuth) {
      setCurrentUser(userToAuth);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
