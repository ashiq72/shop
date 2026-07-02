"use client";

import {
  ChevronDown,
  Heart,
  KeyRound,
  LogIn,
  LogOut,
  Package,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "./AccountProvider";
import styles from "./AccountAction.module.css";

export default function AccountAction() {
  const { user, ready, signedIn, signOut } = useAccount();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenu = () => setOpen(false);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Account";

  return (
    <div className={styles.account} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Open user menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        disabled={!ready}
      >
        <span className={styles.avatar}>
          <User size={17} strokeWidth={1.9} />
        </span>
        <span className={styles.triggerText}>
          {signedIn ? firstName : "Account"}
        </span>
        <ChevronDown
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          size={14}
        />
      </button>

      {open ? (
        <div className={styles.menu} role="menu">
          {signedIn && user ? (
            <>
              <div className={styles.identity}>
                <span className={styles.identityAvatar}>
                  {user.name?.trim().charAt(0).toUpperCase() || "U"}
                </span>
                <span className={styles.identityCopy}>
                  <strong>{user.name || "Customer"}</strong>
                  <small>{user.email}</small>
                </span>
              </div>

              <div className={styles.menuGroup}>
                <MenuLink
                  href="/account/profile"
                  icon={<User size={16} />}
                  onClick={closeMenu}
                >
                  My profile
                </MenuLink>
                <MenuLink
                  href="/wishlist"
                  icon={<Heart size={16} />}
                  onClick={closeMenu}
                >
                  Wishlist
                </MenuLink>
                <MenuLink
                  href="/account/profile?tab=orders"
                  icon={<Package size={16} />}
                  onClick={closeMenu}
                >
                  My orders
                </MenuLink>
                <MenuLink
                  href="/account/profile?tab=password"
                  icon={<KeyRound size={16} />}
                  onClick={closeMenu}
                >
                  Change password
                </MenuLink>
              </div>

              <button
                type="button"
                className={styles.logout}
                role="menuitem"
                onClick={() => {
                  closeMenu();
                  void signOut();
                }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className={styles.guestIntro}>
                <strong>Your account</strong>
                <span>Sign in to manage orders and saved products.</span>
              </div>
              <div className={styles.guestActions}>
                <MenuLink
                  href="/account/login"
                  icon={<LogIn size={16} />}
                  onClick={closeMenu}
                  primary
                >
                  Sign in
                </MenuLink>
                <MenuLink
                  href="/account/register"
                  icon={<UserPlus size={16} />}
                  onClick={closeMenu}
                >
                  Create account
                </MenuLink>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

type MenuLinkProps = {
  children: ReactNode;
  href: string;
  icon: ReactNode;
  onClick: () => void;
  primary?: boolean;
};

function MenuLink({
  children,
  href,
  icon,
  onClick,
  primary = false,
}: MenuLinkProps) {
  return (
    <Link
      className={`${styles.menuLink} ${primary ? styles.primaryLink : ""}`}
      href={href}
      role="menuitem"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
