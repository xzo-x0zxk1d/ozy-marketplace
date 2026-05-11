"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser, getListings, getServices,
  deleteListing, deleteService, bumpListing, bumpService
} from "@/lib/storage";
import { Listing, Service } from "@/lib/types";
import {
  Package, Wrench, Trash2, Zap, Eye, Clock, Edit3,
  Plus, ArrowRight, ShoppingBag, User, AlertTriangle,
  Loader2, TrendingUp, BarChart2, Star
} from "lucide-react";
import styles from "./page.module.css";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type Tab = "listings" | "services";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [tab, setTab] = useState<Tab>("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "listing" | "service"; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bumpingId, setBumpingId] = useState<string | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/"); return; }
    setUser(u);
    Promise.all([getListings(), getServices()]).then(([l, s]) => {
      setListings(l.filter((x) => x.sellerUsername === u.username));
      setServices(s.filter((x) => x.sellerUsername === u.username));
      setLoading(false);
    });
  }, [router]);

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    setDeleting(true);
    if (deleteTarget.type === "listing") {
      await deleteListing(deleteTarget.id, user.username);
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    } else {
      await deleteService(deleteTarget.id, user.username);
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleBump = async (id: string, type: "listing" | "service") => {
    setBumpingId(id);
    if (type === "listing") {
      await bumpListing(id);
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, bumps: (l.bumps || 0) + 1, createdAt: new Date().toISOString() } : l));
    } else {
      await bumpService(id);
      setServices((prev) => prev.map((s) => s.id === id ? { ...s, bumps: (s.bumps || 0) + 1, createdAt: new Date().toISOString() } : s));
    }
    setBumpingId(null);
  };

  const totalViews = listings.reduce((a, l) => a + (l.views || 0), 0) + services.reduce((a, s) => a + (s.views || 0), 0);
  const totalBumps = listings.reduce((a, l) => a + (l.bumps || 0), 0) + services.reduce((a, s) => a + (s.bumps || 0), 0);

  if (!user) return null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <User size={22} />
            </div>
            <div>
              <h1 className={styles.username}>{user.username}</h1>
              <p className={styles.discord}>{user.discordUsername}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href="/marketplace/new" className={styles.newBtn}>
              <Plus size={14} /> List Item
            </Link>
            <Link href="/services/new" className={styles.newBtn}>
              <Plus size={14} /> New Service
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <ShoppingBag size={18} className={styles.statIcon} />
            <div>
              <div className={styles.statNum}>{listings.length}</div>
              <div className={styles.statLabel}>Listings</div>
            </div>
          </div>
          <div className={styles.stat}>
            <Wrench size={18} className={styles.statIcon} />
            <div>
              <div className={styles.statNum}>{services.length}</div>
              <div className={styles.statLabel}>Services</div>
            </div>
          </div>
          <div className={styles.stat}>
            <Eye size={18} className={styles.statIcon} />
            <div>
              <div className={styles.statNum}>{totalViews}</div>
              <div className={styles.statLabel}>Total Views</div>
            </div>
          </div>
          <div className={styles.stat}>
            <TrendingUp size={18} className={styles.statIcon} />
            <div>
              <div className={styles.statNum}>{totalBumps}</div>
              <div className={styles.statLabel}>Total Bumps</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === "listings" ? styles.tabActive : ""}`} onClick={() => setTab("listings")}>
            <ShoppingBag size={14} /> Listings
            <span className={styles.tabCount}>{listings.length}</span>
          </button>
          <button className={`${styles.tab} ${tab === "services" ? styles.tabActive : ""}`} onClick={() => setTab("services")}>
            <Wrench size={14} /> Services
            <span className={styles.tabCount}>{services.length}</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={28} className={styles.spinner} />
            <p>Loading your posts...</p>
          </div>
        ) : tab === "listings" ? (
          listings.length === 0 ? (
            <div className={styles.empty}>
              <Package size={44} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No listings yet</h3>
              <p className={styles.emptySub}>Post your first Roblox item for sale.</p>
              <Link href="/marketplace/new" className={styles.emptyBtn}><Plus size={14} /> List an Item</Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {listings.map((l) => (
                <div key={l.id} className={styles.card}>
                  {/* Image */}
                  <div className={styles.cardImg}>
                    {l.imageUrl ? (
                      <img src={l.imageUrl} alt={l.title} className={styles.img} />
                    ) : (
                      <div className={styles.noImg}><Package size={24} /></div>
                    )}
                    <span className={`${styles.condBadge} ${styles[`cond${l.condition}`]}`}>{l.condition}</span>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardCat}>{l.category}</div>
                    <h3 className={styles.cardTitle}>{l.title}</h3>
                    <p className={styles.cardDesc}>{l.description}</p>
                    <div className={styles.cardPrice}>{l.price}</div>
                    <div className={styles.cardMeta}>
                      <span><Eye size={11} /> {l.views || 0}</span>
                      <span><Zap size={11} /> {l.bumps || 0}</span>
                      <span><Clock size={11} /> {timeAgo(l.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <Link href={`/marketplace/${l.id}`} className={styles.viewBtn}>
                      <ArrowRight size={13} /> View
                    </Link>
                    <button
                      className={styles.bumpBtn}
                      onClick={() => handleBump(l.id, "listing")}
                      disabled={bumpingId === l.id}
                      title="Bump to top"
                    >
                      {bumpingId === l.id ? <Loader2 size={13} className={styles.spin} /> : <Zap size={13} />}
                      Bump
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteTarget({ id: l.id, type: "listing", title: l.title })}
                      title="Delete listing"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          services.length === 0 ? (
            <div className={styles.empty}>
              <Wrench size={44} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No services yet</h3>
              <p className={styles.emptySub}>Offer your first service to the community.</p>
              <Link href="/services/new" className={styles.emptyBtn}><Plus size={14} /> Offer a Service</Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {services.map((s) => (
                <div key={s.id} className={styles.card}>
                  <div className={styles.cardImg}>
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.title} className={styles.img} />
                    ) : (
                      <div className={styles.noImg}><Wrench size={24} /></div>
                    )}
                    <span className={styles.serviceCatBadge}>{s.category}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardCat}>{s.deliveryTime}</div>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.cardDesc}>{s.description}</p>
                    <div className={styles.cardPrice}>{s.price}</div>
                    <div className={styles.cardMeta}>
                      <span><Eye size={11} /> {s.views || 0}</span>
                      <span><Zap size={11} /> {s.bumps || 0}</span>
                      {s.rating > 0 && <span><Star size={11} /> {s.rating.toFixed(1)}</span>}
                      <span><Clock size={11} /> {timeAgo(s.createdAt)}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <Link href={`/services/${s.id}`} className={styles.viewBtn}>
                      <ArrowRight size={13} /> View
                    </Link>
                    <button
                      className={styles.bumpBtn}
                      onClick={() => handleBump(s.id, "service")}
                      disabled={bumpingId === s.id}
                      title="Bump to top"
                    >
                      {bumpingId === s.id ? <Loader2 size={13} className={styles.spin} /> : <Zap size={13} />}
                      Bump
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteTarget({ id: s.id, type: "service", title: s.title })}
                      title="Delete service"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div className={styles.overlay} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconWrap}>
              <AlertTriangle size={28} />
            </div>
            <h3 className={styles.modalTitle}>Delete this {deleteTarget.type}?</h3>
            <p className={styles.modalName}>"{deleteTarget.title}"</p>
            <p className={styles.modalSub}>This cannot be undone. It will be permanently removed from the marketplace.</p>
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? <><Loader2 size={14} className={styles.spin} /> Deleting...</> : <><Trash2 size={14} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
