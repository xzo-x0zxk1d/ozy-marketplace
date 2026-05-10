"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, setCurrentUser } from "@/lib/storage";
import { User } from "@/lib/types";
import { ShoppingBag, Plus, LogOut, Menu, X, Zap } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    router.push("/");
  };

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
          <Link href="/marketplace" className={styles.link}>
            <ShoppingBag size={15} />
            Browse
          </Link>
          {user && (
            <Link href="/marketplace/new" className={styles.link}>
              <Plus size={15} />
              List Item
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className={styles.right}>
          {user ? (
            <>
              <div className={styles.userBadge}>
                <Zap size={13} className={styles.zapIcon} />
                <span className={styles.discordTag}>{user.discordUsername}</span>
              </div>
              <button onClick={logout} className={styles.logoutBtn} title="Logout">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link href="/" className={styles.loginBtn}>
              Login / Register
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/marketplace" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Browse Listings
          </Link>
          {user && (
            <Link href="/marketplace/new" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              List an Item
            </Link>
          )}
          {user ? (
            <button onClick={logout} className={styles.mobileLogout}>
              Logout ({user.username})
            </button>
          ) : (
            <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
