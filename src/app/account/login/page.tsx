"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { loginAccount } from "@/lib/authClient";

export default function ShopLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginAccount(email, password);
      router.replace("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      if (message.toLowerCase().includes("verify your email")) {
        router.push(
          `/account/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="account-page store-shell">
      <section className="account-intro">
        <p>Welcome back</p>
        <h1>Your store account, ready when you are.</h1>
        <span>
          Sign in with your verified email to continue shopping with this
          tenant.
        </span>
      </section>
      <section className="account-panel">
        <div className="account-panel-title">
          <p>Member access</p>
          <h2>Sign in</h2>
          <span>Use the email address you verified during registration.</span>
        </div>
        <form onSubmit={submit} className="account-form">
          <label>
            Email address
            <div>
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>
          <label>
            Password
            <div>
              <LockKeyhole size={17} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          {error ? <p className="account-error">{error}</p> : null}
          <button className="account-submit" type="submit" disabled={loading}>
            {loading ? <LoaderCircle size={17} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign in"}
            {!loading ? <ArrowRight size={17} /> : null}
          </button>
        </form>
        <p className="account-switch">
          New customer? <Link href="/account/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

