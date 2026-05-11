"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, setCurrentUser } from "@/lib/storage";
import { User } from "@/lib/types";
import { ShoppingBag, Wrench, Plus, LogOut, Menu, X, Zap, LayoutDashboard } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setUser(getCurrentUser()); }, [pathname]);

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    router.push("/");
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <img
            src="https://www.image2url.com/r2/default/images/1777298619359-5547dcf2-321f-420c-bdd5-9aa18ea94df2.png"
            alt="Ozy Marketplace"
            className={styles.logoImg}
          />
          <span className={styles.logoText}>OZY</span>
          <span className={styles.logoSub}>MARKETPLACE</span>
        </Link>

        {/* Desktop nav */}
        <div className={styles.links}>
          <Link href="/marketplace" className={`${styles.link} ${isActive("/marketplace") ? styles.linkActive : ""}`}>
            <ShoppingBag size={14} />
            Marketplace
          </Link>
          <Link href="/services" className={`${styles.link} ${isActive("/services") ? styles.linkActive : ""}`}>
            <Wrench size={14} />
            Services
          </Link>
          {user && (
            <div className={styles.addMenu}>
              <Link href="/marketplace/new" className={styles.addLink}>
                <Plus size={13} />Items
              </Link>
              <Link href="/services/new" className={styles.addLink}>
                <Plus size={13} />Services
              </Link>
            </div>
          )}
          {user && (
            <Link href="/dashboard" className={`${styles.link} ${isActive("/dashboard") ? styles.linkActive : ""}`}>
              <LayoutDashboard size={14} />
              My Posts
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className={styles.right}>
          {user ? (
            <>
              <div className={styles.userBadge}>
                <Zap size={12} className={styles.zapIcon} />
                <span className={styles.discordTag}>{user.discordUsername}</span>
              </div>
              <button onClick={logout} className={styles.logoutBtn} title="Logout">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link href="/" className={styles.loginBtn}>Login / Register</Link>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/marketplace" className={`${styles.mobileLink} ${isActive("/marketplace") ? styles.mobileLinkActive : ""}`} onClick={() => setMenuOpen(false)}>
            <ShoppingBag size={15} /> Marketplace
          </Link>
          <Link href="/services" className={`${styles.mobileLink} ${isActive("/services") ? styles.mobileLinkActive : ""}`} onClick={() => setMenuOpen(false)}>
            <Wrench size={15} /> Services
          </Link>
          {user && <>
            <Link href="/dashboard" className={`${styles.mobileLink} ${isActive("/dashboard") ? styles.mobileLinkActive : ""}`} onClick={() => setMenuOpen(false)}><LayoutDashboard size={14} /> My Posts</Link>
            <Link href="/marketplace/new" className={styles.mobileLink} onClick={() => setMenuOpen(false)}><Plus size={14} /> List an Item</Link>
            <Link href="/services/new" className={styles.mobileLink} onClick={() => setMenuOpen(false)}><Plus size={14} /> Offer a Service</Link>
          </>}
          {user ? (
            <button onClick={logout} className={styles.mobileLogout}>Logout ({user.username})</button>
          ) : (
            <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
