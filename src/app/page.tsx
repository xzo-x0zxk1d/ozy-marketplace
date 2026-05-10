"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { findUserByEmail, saveUser, setCurrentUser, getCurrentUser } from "@/lib/storage";
import { User } from "@/lib/types";
import { AlertTriangle, ArrowRight, Sparkles, Shield, MessageSquare, Zap, TrendingUp, Users, Loader2 } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [discord, setDiscord] = useState("");
  const [step, setStep] = useState<"email" | "details" | "warning">("email");
  const [isNew, setIsNew] = useState(false);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) router.push("/marketplace");
  }, [router]);

  const handleEmailSubmit = async () => {
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const existing = await findUserByEmail(email);
      if (existing) {
        setFoundUser(existing);
        setIsNew(false);
        setStep("warning");
      } else {
        setIsNew(true);
        setStep("details");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = () => {
    setError("");
    if (!username.trim()) { setError("Username is required."); return; }
    if (username.trim().length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!discord.trim()) { setError("Discord username is required."); return; }
    setStep("warning");
  };

  const handleEnter = async () => {
    setLoading(true);
    try {
      let user: User;
      if (isNew) {
        user = {
          email,
          username: username.trim(),
          discordUsername: discord.trim(),
          joinedAt: new Date().toISOString(),
        };
        await saveUser(user);
      } else {
        user = foundUser!;
      }
      setCurrentUser(user);
      router.push("/marketplace");
    } catch {
      setError("Failed to save account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid} />
      <div className={styles.radial} />

      <div className={styles.container}>
        {/* Left – Hero */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <Sparkles size={13} />
            The #1 Roblox Random Marketplace
          </div>
          <div className={styles.logoWrap}>
            <img
              src="https://www.image2url.com/r2/default/images/1777298619359-5547dcf2-321f-420c-bdd5-9aa18ea94df2.png"
              alt="Ozy Logo"
              className={styles.heroLogo}
            />
          </div>
          <h1 className={styles.heroTitle}>
            OZY<br />
            <span className={styles.heroSub}>MARKETPLACE</span>
          </h1>
          <p className={styles.heroDesc}>
            List, browse, and trade Roblox items with the community. All
            transactions handled securely through Discord DMs — no middleman,
            pure community trust.
          </p>
          <div className={styles.features}>
            <div className={styles.feat}><Shield size={16} className={styles.featIcon} /><span>Discord-powered trading</span></div>
            <div className={styles.feat}><Zap size={16} className={styles.featIcon} /><span>Instant listing publish</span></div>
            <div className={styles.feat}><TrendingUp size={16} className={styles.featIcon} /><span>Bump to top visibility</span></div>
            <div className={styles.feat}><Users size={16} className={styles.featIcon} /><span>Growing community</span></div>
          </div>
          <div className={styles.madeBy}>
            <MessageSquare size={13} />
            Made by <strong>Ozyrion</strong> · @coolck0106
          </div>
        </div>

        {/* Right – Auth card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <img
              src="https://www.image2url.com/r2/default/images/1777298619359-5547dcf2-321f-420c-bdd5-9aa18ea94df2.png"
              alt="Logo"
              className={styles.cardLogo}
            />
            <h2 className={styles.cardTitle}>
              {step === "warning" ? "One moment..." : isNew && step === "details" ? "Create Account" : "Welcome"}
            </h2>
            <p className={styles.cardSub}>
              {step === "email" && "Enter your email to continue"}
              {step === "details" && "Set up your marketplace profile"}
              {step === "warning" && (isNew ? "Account created successfully" : `Welcome back, ${foundUser?.username}`)}
            </p>
          </div>

          {/* STEP 1 – Email */}
          {step === "email" && (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  autoFocus
                  disabled={loading}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.btn} onClick={handleEmailSubmit} disabled={loading}>
                {loading ? <Loader2 size={15} className={styles.spin} /> : <>Continue <ArrowRight size={15} /></>}
              </button>
              <p className={styles.hint}>New? We'll set up your account. Returning? We'll log you straight in.</p>
            </div>
          )}

          {/* STEP 2 – New user details */}
          {step === "details" && (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  placeholder="CoolTrader99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Discord Username</label>
                <input
                  type="text"
                  placeholder="ozyrion or ozyrion#1234"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDetailsSubmit()}
                />
                <span className={styles.fieldNote}>Buyers will DM you on Discord to purchase your items</span>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.btn} onClick={handleDetailsSubmit}>
                Create Account <ArrowRight size={15} />
              </button>
              <button className={styles.backBtn} onClick={() => { setStep("email"); setError(""); }}>← Back</button>
            </div>
          )}

          {/* STEP 3 – Warning */}
          {step === "warning" && (
            <div className={styles.form}>
              <div className={styles.warning}>
                <div className={styles.warningHeader}>
                  <AlertTriangle size={18} className={styles.warningIcon} />
                  <span>Important Notice</span>
                </div>
                <p className={styles.warningText}>
                  Your login is <strong>not stored as a password</strong>. Save your email somewhere safe — it's how you log back in. Your listings are stored in the cloud and will always be there.
                </p>
                <ul className={styles.warningList}>
                  <li>📧 Save your email: <code>{email}</code></li>
                  <li>🎮 Your listings are visible to everyone globally</li>
                  <li>💬 Buyers contact you via Discord DMs</li>
                  <li>🔒 No passwords — email is your key</li>
                </ul>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button className={`${styles.btn} ${styles.btnGreen}`} onClick={handleEnter} disabled={loading}>
                {loading ? <Loader2 size={15} className={styles.spin} /> : <>Enter Marketplace <ArrowRight size={15} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
