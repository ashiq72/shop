"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { AccountUser } from "@/lib/types";
import { apiGetAuth, getAccountToken } from "@/lib/clientApi";
import { logoutAccount } from "@/lib/authClient";

type AccountContextValue = {
  user: AccountUser | null;
  ready: boolean;
  signedIn: boolean;
  refreshAccount: () => Promise<void>;
  signOut: () => void;
};

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined,
);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [ready, setReady] = useState(false);

  const refreshAccount = useCallback(async () => {
    if (!getAccountToken()) {
      setUser(null);
      setReady(true);
      return;
    }
    try {
      const response = await apiGetAuth<AccountUser>("/users/me");
      setUser(response.data || null);
    } catch {
      logoutAccount();
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refreshAccount();
    const handleAuthChange = () => void refreshAccount();
    window.addEventListener("commerce360-auth-changed", handleAuthChange);
    return () =>
      window.removeEventListener("commerce360-auth-changed", handleAuthChange);
  }, [refreshAccount]);

  const signOut = useCallback(() => {
    logoutAccount();
    setUser(null);
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signedIn: Boolean(user),
      refreshAccount,
      signOut,
    }),
    [ready, refreshAccount, signOut, user],
  );

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return context;
}

