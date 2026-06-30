"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle, MailCheck, RotateCcw } from "lucide-react";
import {
  resendAccountVerification,
  verifyAccountEmail,
} from "@/lib/authClient";

export default function ShopVerifyEmailForm({
  initialEmail,
}: {
  initialEmail: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [developmentCode, setDevelopmentCode] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDevelopmentCode(sessionStorage.getItem("shop_verification_code") || "");
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyAccountEmail(email, code);
      sessionStorage.removeItem("shop_verification_code");
      router.replace(`/account/login?verified=1&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setError("");
    try {
      const response = await resendAccountVerification(email);
      const devCode = response.data?.developmentCode;
      if (devCode) {
        sessionStorage.setItem("shop_verification_code", devCode);
        setDevelopmentCode(devCode);
      }
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="account-page store-shell">
      <section className="account-intro">
        <p>Email security</p>
        <h1>One small step protects your account.</h1>
        <span>
          Verification codes expire quickly and can only be used for this
          tenant.
        </span>
      </section>
      <section className="account-panel">
        <div className="account-panel-title">
          <p>Check your inbox</p>
          <h2>Verify your email</h2>
          <span>Enter the six-digit code sent to your email address.</span>
        </div>
        <form onSubmit={submit} className="account-form">
          <label>
            Email address
            <div>
              <MailCheck size={17} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>
          <label>
            Verification code
            <div className="verification-input">
              <input
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                placeholder="000000"
                required
              />
            </div>
          </label>
          {developmentCode ? (
            <p className="development-code">
              Development code: <strong>{developmentCode}</strong>
            </p>
          ) : null}
          {error ? <p className="account-error">{error}</p> : null}
          <button
            className="account-submit"
            type="submit"
            disabled={loading || code.length !== 6}
          >
            {loading ? <LoaderCircle size={17} className="animate-spin" /> : null}
            {loading ? "Verifying..." : "Verify email"}
            {!loading ? <ArrowRight size={17} /> : null}
          </button>
        </form>
        <button
          className="account-resend"
          type="button"
          onClick={resend}
          disabled={resending || cooldown > 0 || !email}
        >
          <RotateCcw size={16} />
          {resending
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
        </button>
        <p className="account-switch">
          Already verified? <Link href="/account/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

