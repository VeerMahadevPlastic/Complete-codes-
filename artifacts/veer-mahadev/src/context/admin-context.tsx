import { createContext, useContext, useState, useCallback } from "react";

interface AdminContextValue {
  isAdmin: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER as string;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS as string;

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return sessionStorage.getItem("vm_admin") === "1"; } catch { return false; }
  });

  const login = useCallback((user: string, pass: string): boolean => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setIsAdmin(true);
      try { sessionStorage.setItem("vm_admin", "1"); } catch { /* */ }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try { sessionStorage.removeItem("vm_admin"); } catch { /* */ }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
