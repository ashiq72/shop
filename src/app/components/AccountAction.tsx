"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  hasAccountSession,
  logoutAccount,
} from "@/lib/authClient";

export default function AccountAction() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const update = () => setSignedIn(hasAccountSession());
    update();
    window.addEventListener("commerce360-auth-changed", update);
    return () => window.removeEventListener("commerce360-auth-changed", update);
  }, []);

  if (!signedIn) {
    return (
      <Link href="/account/login" aria-label="Sign in" title="Sign in">
        <UserRound size={20} />
        <span>Sign in</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={logoutAccount}
      aria-label="Sign out"
      title="Sign out"
    >
      <LogOut size={20} />
      <span>Sign out</span>
    </button>
  );
}

