"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AuthFooter, AuthMenu } from "../components/auth-shell";
import { Button, Container, Input, PhoneInput, toast } from "../components/ui";
import { cn } from "@/lib/utils";
import { login, signupStart, signupVerify, signupComplete } from "@/lib/api/auth";
import { ApiError } from "@/lib/api";
import { setToken } from "@/lib/auth";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  const pageMeta = useMemo(() => {
    if (mode === "signup") {
      return {
        title: "Sign Up",
        subtitle: "Create your account",
        cta: "Sign Up",
      };
    }

    return {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      cta: "Login",
    };
  }, [mode]);

  return (
    <div className="flex min-h-screen flex-col bg-[#050d0c] px-5 pt-6 pb-[18px] text-white sm:px-14 sm:pt-14 sm:pb-6">
      <AuthMenu />

      <div className="flex flex-1 items-center justify-center py-8">
        <main className="w-full">
          <Container className="max-w-[560px]">
            <section className="rounded-[24px] border border-[#1e2b2a] bg-[radial-gradient(110%_180%_at_50%_0%,rgba(8,27,25,0.95)_0%,rgba(4,12,11,0.95)_62%)] px-4 py-6 shadow-[0_14px_44px_rgba(0,0,0,0.35)] sm:px-8 sm:py-9">
              <header className="mb-7 text-center sm:mb-8">
                <h1 className="mb-2 text-[30px] leading-[1.1] font-semibold text-white sm:text-[40px]">
                  {pageMeta.title}
                </h1>
                <p className="text-[14px] font-semibold text-[#a3a8a7] sm:text-[16px]">{pageMeta.subtitle}</p>
              </header>

              <div className="mb-7 grid h-[50px] grid-cols-2 rounded-xl bg-[linear-gradient(90deg,#1b2324,#1b2324)] p-1 sm:mb-8 sm:h-[56px]">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={cn(
                    "rounded-[10px] text-[15px] font-semibold transition-colors sm:text-[18px]",
                    mode === "login"
                      ? "bg-[#bca066] text-[#121415]"
                      : "text-[#9ea3a4] hover:text-white",
                  )}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={cn(
                    "rounded-[10px] text-[15px] font-semibold transition-colors sm:text-[18px]",
                    mode === "signup"
                      ? "bg-[#bca066] text-[#121415]"
                      : "text-[#9ea3a4] hover:text-white",
                  )}
                >
                  Sign Up
                </button>
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {mode === "login" ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                    >
                      <LoginForm onSwitchToSignup={() => setMode("signup")} cta={pageMeta.cta} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                    >
                      <SignupForm onSwitchToLogin={() => setMode("login")} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>            </section>
          </Container>
        </main>
      </div>

      <AuthFooter />
    </div>
  );
}

function LoginForm({ onSwitchToSignup, cta }: { onSwitchToSignup: () => void; cta: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const identifier = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setIsLoading(true);
    try {
      const res = await login({ identifier, password });
      setToken(res.data!.token);
      toast.success(res.message);
      const next = searchParams.get("next") ?? "/dashboard";
      router.push(next);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <FieldLabel htmlFor="login-email">Email Address or Phone *</FieldLabel>
      <Input
        id="login-email"
        type="text"
        name="email"
        placeholder="john@example.com"
        className="mb-5 h-[50px] border-[#314041] bg-[linear-gradient(90deg,#182123,#1f2a2b)] px-4 text-[15px] placeholder:text-[#7b8283] sm:mb-6 sm:h-[54px] sm:text-[17px]"
      />

      <FieldLabel htmlFor="login-password">Password *</FieldLabel>
      <Input
        id="login-password"
        type="password"
        name="password"
        placeholder="Enter your password"
        className="mb-6 h-[50px] border-[#314041] bg-[linear-gradient(90deg,#182123,#1f2a2b)] px-4 text-[15px] placeholder:text-[#7b8283] sm:mb-7 sm:h-[54px] sm:text-[17px]"
      />

      <Button className="mb-6 h-[52px] text-[17px] sm:mb-8 sm:h-[58px] sm:text-[21px]" type="submit" isLoading={isLoading}>
        {cta}
      </Button>

      <Link
        href="/login/forgot-password"
        className="mb-3 text-center text-[13px] font-semibold text-[#9ba0a1] no-underline transition-colors hover:text-[#bca066] sm:text-[14px]"
      >
        Forgot password?
      </Link>

      <p className="text-center text-[13px] font-semibold text-[#9ba0a1] sm:text-[14px]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#bca066] underline decoration-[#bca066] underline-offset-2"
        >
          Sign up here
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Data carried across steps
  const [phone, setPhone] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [signupToken, setSignupToken] = useState("");

  // ── Step 1 — personal info + send OTP ─────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = [
      (form.elements.namedItem("firstName") as HTMLInputElement).value,
      (form.elements.namedItem("lastName") as HTMLInputElement).value,
    ]
      .filter(Boolean)
      .join(" ");
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    if (!phoneInput) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      await signupStart({ name, email, phone: phoneInput });
      setPhone(phoneInput);
      toast.success("Verification code sent to your phone!");
      setStep(2);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2 — OTP verification ──────────────────────────────────────────────
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const isOtpComplete = otp.every((d) => d.length === 1);

  const updateOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      (document.getElementById(`sotp-${index + 1}`) as HTMLInputElement | null)?.focus();
    }
  };

  const onOtpBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace" || otp[index]) return;
    if (index > 0) {
      (document.getElementById(`sotp-${index - 1}`) as HTMLInputElement | null)?.focus();
    }
  };

  const onOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length <= 1) return;
    e.preventDefault();
    setOtp((prev) => {
      const next = [...prev];
      for (let i = 0; i < 6; i++) next[i] = digits[i] ?? "";
      return next;
    });
    const focusIndex = Math.min(digits.length, 6) - 1;
    (document.getElementById(`sotp-${focusIndex}`) as HTMLInputElement | null)?.focus();
  };

  const handleStep2 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signupVerify({ phone, code: otp.join("") });
      setSignupToken(res.data!.signupToken);
      setStep(3);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Invalid code. Please try again.");
      setOtp(Array(6).fill(""));
      (document.getElementById("sotp-0") as HTMLInputElement | null)?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3 — set password ─────────────────────────────────────────────────
  const handleStep3 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signupComplete({ signupToken, password });
      setToken(res.data!.token);
      toast.success(res.message);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        {([1, 2, 3] as const).map((s) => (
          <div
            key={s}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-colors duration-300",
              step >= s ? "bg-[#bca066]" : "bg-[#1e2b2c]",
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {/* ── Step 1 ── */}
        {step === 1 && (
          <motion.form
            key="signup-step-1"
            className="flex flex-col"
            onSubmit={handleStep1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-4 grid grid-cols-2 gap-3">
              <Input
                id="signup-first-name"
                type="text"
                name="firstName"
                placeholder="First name"
                required
                className="h-[50px] border-[#1e2b2c] bg-[#090c0e] px-4 text-[15px] placeholder:text-[#5a5a5e] sm:h-[56px] sm:text-[17px]"
              />
              <Input
                id="signup-last-name"
                type="text"
                name="lastName"
                placeholder="Last name"
                className="h-[50px] border-[#1e2b2c] bg-[#090c0e] px-4 text-[15px] placeholder:text-[#5a5a5e] sm:h-[56px] sm:text-[17px]"
              />
            </div>
            <Input
              id="signup-email"
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="mb-4 h-[50px] border-[#1e2b2c] bg-[#090c0e] px-4 text-[15px] placeholder:text-[#5a5a5e] sm:h-[56px] sm:text-[17px]"
            />
            <PhoneInput
              value={phoneInput}
              onChange={setPhoneInput}
              required
              className="mb-6"
            />
            <Button
              className="mb-4 h-[56px] text-[18px] sm:mb-5 sm:h-[60px] sm:text-[22px]"
              type="submit"
              isLoading={isLoading}
            >
              Send Code
            </Button>
            <p className="text-center text-[13px] font-semibold text-[#9ba0a1] sm:text-[14px]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#bca066] underline decoration-[#bca066] underline-offset-2"
              >
                Log in
              </button>
            </p>
          </motion.form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <motion.form
            key="signup-step-2"
            className="flex flex-col"
            onSubmit={handleStep2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <p className="mb-6 text-center text-[14px] text-[#a3a8a7]">
              We texted a 6-digit code to <span className="font-semibold text-white">{phone}</span>
            </p>
            <div className="mb-6 grid grid-cols-6 gap-2.5 sm:mb-8 sm:gap-3.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`sotp-${index}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => updateOtpDigit(index, e.target.value)}
                  onKeyDown={(e) => onOtpBackspace(index, e)}
                  onPaste={onOtpPaste}
                  className={cn(
                    "h-[54px] w-full rounded-lg border border-[#1e2125] bg-[#090c0e] text-center text-[20px] font-semibold text-white outline-none transition-colors focus:border-[#3f4349] sm:h-[64px] sm:text-[24px]",
                    digit ? "border-[#414a4d]" : "",
                  )}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            <Button
              className="mb-4 h-[56px] text-[18px] sm:mb-5 sm:h-[60px] sm:text-[22px]"
              type="submit"
              isLoading={isLoading}
              disabled={!isOtpComplete}
            >
              Verify Code
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-center text-[13px] font-semibold text-[#9ba0a1] transition-colors hover:text-white"
            >
              ← Back
            </button>
          </motion.form>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <motion.form
            key="signup-step-3"
            className="flex flex-col"
            onSubmit={handleStep3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Password (min. 8 characters)"
              required
              minLength={8}
              className="mb-4 h-[50px] border-[#1e2b2c] bg-[#090c0e] px-4 text-[15px] placeholder:text-[#5a5a5e] sm:h-[56px] sm:text-[17px]"
            />
            <Input
              id="signup-confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              minLength={8}
              className="mb-5 h-[50px] border-[#1e2b2c] bg-[#090c0e] px-4 text-[15px] placeholder:text-[#5a5a5e] sm:h-[56px] sm:text-[17px]"
            />
            <label className="mb-5 inline-flex items-center gap-2 text-[12px] text-[#5a5a5e] sm:gap-3 sm:text-[14px]">
              <input
                type="checkbox"
                name="terms"
                required
                className="h-4 w-4 border border-[#3b3b3b] bg-transparent accent-[#bca066] sm:h-5 sm:w-5"
              />
              I agree to Aleet&apos;s Terms &amp; Conditions.
            </label>
            <Button
              className="mb-4 h-[56px] text-[18px] sm:mb-5 sm:h-[60px] sm:text-[22px]"
              type="submit"
              isLoading={isLoading}
            >
              Create Account
            </Button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-center text-[13px] font-semibold text-[#9ba0a1] transition-colors hover:text-white"
            >
              ← Back
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[14px] font-semibold text-white sm:text-[16px]">
      {children}
    </label>
  );
}
