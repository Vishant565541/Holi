"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Globe,
  ArrowLeft, CheckCircle, AlertCircle, ChevronRight,
} from "lucide-react";
import API from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";

type Step = "login" | "signup" | "signup_otp" | "signup_profile" | "success" | "forget" | "forget_otp" | "reset_success";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const pageVariants: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.2 } },
};

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
}

interface OtpBoxesProps {
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}
function OtpBoxes({ value, onChange, disabled }: OtpBoxesProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const focusBox = (idx: number) => {
    if (idx >= 0 && idx < 6) refs.current[idx]?.focus();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[idx] = char;
    onChange(next);
    if (char && idx < 5) focusBox(idx + 1);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        const next = [...value];
        next[idx] = "";
        onChange(next);
      } else {
        focusBox(idx - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusBox(idx - 1);
    } else if (e.key === "ArrowRight") {
      focusBox(idx + 1);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...value];
    for (let i = 0; i < pasted.length; i++) {
      if (idx + i < 6) next[idx + i] = pasted[i];
    }
    onChange(next);
    focusBox(Math.min(idx + pasted.length, 5));
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={[
            "w-10 h-12 text-center text-lg font-bold rounded-xl border transition-all duration-200",
            "bg-white/5 text-white caret-gold",
            "focus:outline-none focus:border-gold/60 focus:bg-white/10 focus:scale-105",
            value[i] ? "border-gold/40 bg-white/8" : "border-white/10",
            disabled ? "opacity-40 cursor-not-allowed" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

const INPUT_CLS = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors placeholder-white/25 font-luxury";
const LABEL_CLS = "text-[10px] font-space uppercase tracking-widest text-gold/70 font-bold mb-1.5 block";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [step, setStep] = useState<Step>("login");
  const [showPass, setShowPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupGender, setSignupGender] = useState("Prefer not to say");
  const [signupDob, setSignupDob] = useState("");
  const [signupCity, setSignupCity] = useState("");
  const [signupState, setSignupState] = useState("");
  const [signupNationality, setSignupNationality] = useState("Indian");

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  // Forget Password fields
  const [forgetEmail, setForgetEmail] = useState("");
  const [forgetOtpValues, setForgetOtpValues] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!EMAIL_REGEX.test(loginEmail)) { setError("Please enter a valid email address."); return; }
    if (!loginPassword) { setError("Please enter your password."); return; }
    setLoading(true);
    try {
      const res = await API.post("/auth/password-login", {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      login(res.data.user, res.data.token);
      setStep("success");
      const targetRoute = res.data.user?.role === "admin" ? "/admin" : "/dashboard";
      setTimeout(() => router.push(targetRoute), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ── Signup Step 1: Send OTP ────────────────────────────────────────────────
  const handleSignupSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!EMAIL_REGEX.test(signupEmail)) { setError("Please enter a valid email address."); return; }
    // Skip OTP check and proceed directly to profile creation
    setStep("signup_profile");
  };

  // ── Signup Step 2: Verify OTP ──────────────────────────────────────────────
  const handleSignupVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/verify-signup-otp", {
        email: signupEmail.trim().toLowerCase(),
        otp: otp,
      });
      setStep("signup_profile");
    } catch (err: any) {
      setError(err.response?.data?.error || "Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Signup Step 3: Complete Registration ───────────────────────────────────
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!signupFirstName.trim()) { setError("First name is required."); return; }
    if (signupPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (signupPassword !== signupConfirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const otp = otpValues.join("");
    try {
      const res = await API.post("/auth/password-register", {
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        name: signupFirstName.trim(),
        last_name: signupLastName.trim(),
        phone: signupPhone.trim(),
        gender: signupGender,
        date_of_birth: signupDob,
        city_of_residence: signupCity.trim(),
        state: signupState.trim(),
        nationality: signupNationality,
        otp: otp,
      });
      login(res.data.user, res.data.token);
      setStep("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forget Password Step 1: Send Reset OTP ─────────────────────────────────
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!EMAIL_REGEX.test(forgetEmail)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await API.post("/auth/send-reset-otp", { email: forgetEmail.trim().toLowerCase() });
      setStep("forget_otp");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forget Password Step 2: Reset Password with OTP ────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = forgetOtpValues.join("");
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== newPasswordConfirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        email: forgetEmail.trim().toLowerCase(),
        otp: otp,
        password: newPassword,
      });
      setStep("reset_success");
      setTimeout(() => {
        setStep("login");
        setLoginEmail(forgetEmail);
        setForgetEmail("");
        setForgetOtpValues(Array(6).fill(""));
        setNewPassword("");
        setNewPasswordConfirm("");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo / brand */}
        <div className="text-center mb-8">
          <span className="font-space text-[10px] uppercase tracking-[0.3em] text-gold/50 font-bold">Roman Aviation & Tourism</span>
          <h1 className="font-space text-2xl font-bold text-white mt-2">
            {step === "login" ? "Welcome Back" :
             step.startsWith("signup") ? "Create Account" :
             step.startsWith("forget") ? "Account Recovery" : "Access Granted"}
          </h1>
          <p className="font-luxury text-xs text-grey-text mt-1">
            {step === "login" ? "Sign in to your executive travel portal" :
             step.startsWith("signup") ? "Join Roman's exclusive travel network" :
             step.startsWith("forget") ? "Verify your email to reset your password" :
             "Redirecting to your dashboard…"}
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── SUCCESS ──────────────────────────────────────────────────── */}
          {step === "success" && (
            <motion.div key="success" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="glass-card rounded-2xl border border-teal/20 p-8 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-teal" />
              </div>
              <div>
                <h2 className="font-space text-lg font-bold text-white">Authentication Successful</h2>
                <p className="font-luxury text-xs text-grey-text mt-1">Taking you to your dashboard…</p>
              </div>
            </motion.div>
          )}

          {/* ── LOGIN ────────────────────────────────────────────────────── */}
          {step === "login" && (
            <motion.form key="login" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              onSubmit={handleLogin}
              className="glass-card rounded-2xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl">

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className={LABEL_CLS}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                  <input type="email" required autoComplete="email" placeholder="you@example.com"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    className={INPUT_CLS + " pl-10"} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={LABEL_CLS}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                  <input type={showPass ? "text" : "password"} required autoComplete="current-password"
                    placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    className={INPUT_CLS + " pl-10 pr-10"} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-text hover:text-white transition-colors cursor-pointer">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right -mt-2">
                <button type="button" onClick={() => { setError(""); setStep("forget"); }}
                  className="text-xs text-gold hover:text-white transition-colors cursor-pointer">
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
                {loading ? <><Spinner /> Signing In…</> : <>Sign In <ChevronRight className="h-4 w-4" /></>}
              </button>

              {/* Switch to signup */}
              <div className="text-center text-xs font-luxury text-grey-text">
                New to Roman Aviation?{" "}
                <button type="button" onClick={() => { setError(""); setStep("signup"); setSignupEmail(loginEmail); }}
                  className="text-gold font-semibold hover:text-white transition-colors cursor-pointer">
                  Create an account →
                </button>
              </div>
            </motion.form>
          )}

          {/* ── SIGNUP STEP 1: EMAIL INPUT ───────────────────────────────── */}
          {step === "signup" && (
            <motion.form key="signup" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              onSubmit={handleSignupSendOtp}
              className="glass-card rounded-2xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl">

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setError(""); setStep("login"); }}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <span className="text-[9px] font-space uppercase tracking-widest text-gold/50 font-bold">New Account</span>
                  <h3 className="font-space text-sm font-bold text-white leading-none mt-0.5">Register Email</h3>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className={LABEL_CLS}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                  <input type="email" required autoComplete="email" placeholder="you@example.com"
                    value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                    className={INPUT_CLS + " pl-10"} />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
                {loading ? <><Spinner /> Sending Code…</> : <>Send Verification Code <ChevronRight className="h-4 w-4" /></>}
              </button>

              <div className="text-center text-xs font-luxury text-grey-text">
                Already have an account?{" "}
                <button type="button" onClick={() => { setError(""); setStep("login"); }}
                  className="text-gold font-semibold hover:text-white transition-colors cursor-pointer">
                  Sign In →
                </button>
              </div>
            </motion.form>
          )}

          {/* ── SIGNUP STEP 2: OTP VERIFICATION ──────────────────────────────── */}
          {step === "signup_otp" && (
            <motion.form key="signup_otp" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              onSubmit={handleSignupVerifyOtp}
              className="glass-card rounded-2xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl">
              
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setError(""); setStep("signup"); setOtpValues(Array(6).fill("")); }}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h3 className="font-space text-lg font-bold text-white leading-none">Verify Email</h3>
                  <p className="font-luxury text-xs text-grey-text mt-1">Code sent to {signupEmail}</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              <div className="py-4">
                <OtpBoxes value={otpValues} onChange={setOtpValues} disabled={loading} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
                {loading ? <><Spinner /> Verifying…</> : <>Verify Code <ChevronRight className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}

          {/* ── SIGNUP STEP 3: PROFILE DETAILS ─────────────────────────────── */}
          {step === "signup_profile" && (
            <motion.form key="signup_profile" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              onSubmit={handleCompleteSignup}
              className="glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">

              {/* Signup header */}
              <div className="px-7 pt-6 pb-4 border-b border-white/5 flex items-center gap-3">
                <button type="button" onClick={() => { setError(""); setStep("signup"); }}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <span className="text-[9px] font-space uppercase tracking-widest text-gold/50 font-bold">New Account</span>
                  <h3 className="font-space text-sm font-bold text-white leading-none mt-0.5">Complete Profile</h3>
                </div>
              </div>

              <div className="px-7 py-5 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">

                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                {/* Section: Password */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/50 font-bold mb-3">§ Set Password</p>
                  <div className="flex flex-col gap-3">
                    {/* Password */}
                    <div>
                      <label className={LABEL_CLS}>Password * (min 8 characters)</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                        <input type={showSignupPass ? "text" : "password"} required autoComplete="new-password"
                          placeholder="Create a strong password" value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className={INPUT_CLS + " pl-10 pr-10"} />
                        <button type="button" onClick={() => setShowSignupPass(!showSignupPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-text hover:text-white cursor-pointer">
                          {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {/* Confirm */}
                    <div>
                      <label className={LABEL_CLS}>Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                        <input type="password" required autoComplete="new-password"
                          placeholder="Repeat your password" value={signupConfirm}
                          onChange={(e) => setSignupConfirm(e.target.value)}
                          className={INPUT_CLS + " pl-10"} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Personal Info */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/50 font-bold mb-3">§ Personal Information</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLS}>First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/40" />
                        <input type="text" required placeholder="First name" value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          className={INPUT_CLS + " pl-9 text-xs py-2.5"} />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Last Name</label>
                      <input type="text" placeholder="Last name" value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                        className={INPUT_CLS + " text-xs py-2.5"} />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/40" />
                        <input type="tel" placeholder="+91 XXXXX XXXXX" value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className={INPUT_CLS + " pl-9 text-xs py-2.5"} />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Date of Birth</label>
                      <input type="date" value={signupDob} onChange={(e) => setSignupDob(e.target.value)}
                        className={INPUT_CLS + " text-xs py-2.5"} style={{ colorScheme: "dark" }} />
                    </div>
                    <div className="col-span-2">
                      <label className={LABEL_CLS}>Gender</label>
                      <select value={signupGender} onChange={(e) => setSignupGender(e.target.value)}
                        className={INPUT_CLS + " cursor-pointer text-xs py-2.5"}>
                        {["Male", "Female", "Non-Binary", "Prefer not to say"].map((g) => (
                          <option key={g} value={g} className="bg-[#030712]">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Location */}
                <div>
                  <p className="text-[9px] font-space uppercase tracking-widest text-gold/50 font-bold mb-3">§ Location Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLS}>City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/40" />
                        <input type="text" placeholder="e.g. Mumbai" value={signupCity}
                          onChange={(e) => setSignupCity(e.target.value)}
                          className={INPUT_CLS + " pl-9 text-xs py-2.5"} />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>State</label>
                      <input type="text" placeholder="e.g. Maharashtra" value={signupState}
                        onChange={(e) => setSignupState(e.target.value)}
                        className={INPUT_CLS + " text-xs py-2.5"} />
                    </div>
                    <div className="col-span-2">
                      <label className={LABEL_CLS}>Nationality</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/40" />
                        <select value={signupNationality} onChange={(e) => setSignupNationality(e.target.value)}
                          className={INPUT_CLS + " pl-9 cursor-pointer text-xs py-2.5"}>
                          {["Indian", "British", "American", "UAE National", "Canadian", "Australian", "Other"].map((n) => (
                            <option key={n} value={n} className="bg-[#030712]">{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-7 py-5 border-t border-white/5 flex flex-col gap-3">
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
                  {loading ? <><Spinner /> Creating Account…</> : <>Complete Signup <CheckCircle className="h-4 w-4" /></>}
                </button>
              </div>
            </motion.form>
          )}

          {/* ── FORGET PASSWORD STEP 1: EMAIL INPUT ────────────────────────── */}
          {step === "forget" && (
            <motion.form key="forget" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              onSubmit={handleSendResetOtp}
              className="glass-card rounded-2xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl">

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setError(""); setStep("login"); }}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <span className="text-[9px] font-space uppercase tracking-widest text-gold/50 font-bold">Account Recovery</span>
                  <h3 className="font-space text-sm font-bold text-white leading-none mt-0.5">Reset Password</h3>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              <div>
                <label className={LABEL_CLS}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                  <input type="email" required autoComplete="email" placeholder="you@example.com"
                    value={forgetEmail} onChange={(e) => setForgetEmail(e.target.value)}
                    className={INPUT_CLS + " pl-10"} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
                {loading ? <><Spinner /> Sending Code…</> : <>Send Reset Code <ChevronRight className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}

          {/* ── FORGET PASSWORD STEP 2: OTP & NEW PASSWORD INPUT ─────────────── */}
          {step === "forget_otp" && (
            <motion.form key="forget_otp" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              onSubmit={handleResetPassword}
              className="glass-card rounded-2xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl">

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setError(""); setStep("forget"); setForgetOtpValues(Array(6).fill("")); }}
                  className="text-grey-text hover:text-white transition-colors cursor-pointer p-1">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h3 className="font-space text-lg font-bold text-white leading-none">Enter Reset Code</h3>
                  <p className="font-luxury text-xs text-grey-text mt-1">Code sent to {forgetEmail}</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/8 border border-red-400/15 rounded-xl px-4 py-3 text-xs font-luxury">
                  <AlertCircle className="h-4 w-4 shrink-0" />{error}
                </div>
              )}

              <div className="py-2">
                <label className={LABEL_CLS + " text-center"}>6-Digit Code</label>
                <OtpBoxes value={forgetOtpValues} onChange={setForgetOtpValues} disabled={loading} />
              </div>

              <div className="flex flex-col gap-3">
                {/* New Password */}
                <div>
                  <label className={LABEL_CLS}>New Password * (min 8 characters)</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                    <input type={showNewPass ? "text" : "password"} required autoComplete="new-password"
                      placeholder="Enter new password" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={INPUT_CLS + " pl-10 pr-10"} />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-text hover:text-white cursor-pointer">
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className={LABEL_CLS}>Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                    <input type="password" required autoComplete="new-password"
                      placeholder="Confirm new password" value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className={INPUT_CLS + " pl-10"} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all border border-gold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 glow-gold">
                {loading ? <><Spinner /> Updating…</> : <>Reset Password <CheckCircle className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}

          {/* ── RESET SUCCESS ────────────────────────────────────────────── */}
          {step === "reset_success" && (
            <motion.div key="reset_success" variants={pageVariants} initial="hidden" animate="visible" exit="exit"
              className="glass-card rounded-2xl border border-teal/20 p-8 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-teal" />
              </div>
              <div>
                <h2 className="font-space text-lg font-bold text-white">Password Reset Successful</h2>
                <p className="font-luxury text-xs text-grey-text mt-1">Your password has been successfully updated. Taking you to the sign in page…</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
