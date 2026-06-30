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
  UserRound,
} from "lucide-react";
import { createAccount } from "@/lib/authClient";

export default function ShopRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) {
      setError("Use at least six characters with a letter and number");
      return;
    }

    setLoading(true);
    try {
      const response = await createAccount({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (response.data?.developmentCode) {
        sessionStorage.setItem(
          "shop_verification_code",
          response.data.developmentCode,
        );
      }
      router.push(
        `/account/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Account could not be created");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="account-page store-shell">
      <section className="account-intro">
        <p>Store membership</p>
        <h1>A faster way through checkout.</h1>
        <span>
          Create your account, verify your email, and use the same trusted
          identity across this tenant.
        </span>
      </section>
      <section className="account-panel">
        <div className="account-panel-title">
          <p>New account</p>
          <h2>Create your store profile</h2>
          <span>We will email a six-digit verification code.</span>
        </div>
        <form onSubmit={submit} className="account-form">
          <label>
            Full name
            <div>
              <UserRound size={17} />
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                autoComplete="name"
                required
              />
            </div>
          </label>
          <label>
            Email address
            <div>
              <Mail size={17} />
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
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
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                autoComplete="new-password"
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
          <label>
            Confirm password
            <div>
              <LockKeyhole size={17} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                autoComplete="new-password"
                required
              />
            </div>
          </label>
          {error ? <p className="account-error">{error}</p> : null}
          <button className="account-submit" type="submit" disabled={loading}>
            {loading ? <LoaderCircle size={17} className="animate-spin" /> : null}
            {loading ? "Creating account..." : "Create account"}
            {!loading ? <ArrowRight size={17} /> : null}
          </button>
        </form>
        <p className="account-switch">
          Already registered? <Link href="/account/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

