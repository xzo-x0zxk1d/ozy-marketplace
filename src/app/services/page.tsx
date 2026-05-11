"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getServices, getCurrentUser } from "@/lib/storage";
import { Service, SERVICE_CATEGORIES, ServiceCategory } from "@/lib/types";
import { Search, Plus, MessageSquare, Eye, Zap, Clock, Filter, TrendingUp, ChevronDown, Loader2, Star, Timer, Wrench } from "lucide-react";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import styles from "./page.module.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "bumped", label: "Most Bumped" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function parsePrice(p: string): number {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Scripting": "⚙️", "Building": "🏗️", "GFX / Art": "🎨",
  "UI Design": "🖥️", "Game Dev": "🎮", "Thumbnails": "🖼️",
  "Voice Acting": "🎙️", "Moderation": "🛡️", "Boosting": "⚡", "Other": "📦",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "All">("All");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    getServices().then((data) => { setServices(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let list = [...services];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) ||
        s.sellerUsername.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "All") list = list.filter((s) => s.category === category);
    switch (sort) {
      case "newest": list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "price-asc": list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-desc": list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      case "bumped": list.sort((a, b) => (b.bumps || 0) - (a.bumps || 0)); break;
    }
    return list;
  }, [services, search, category, sort]);

  return (
    <div className={styles.page}>
      {/* Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerIcon}><Wrench size={28} /></div>
            <div>
              <h1 className={styles.bannerTitle}>SERVICES</h1>
              <p className={styles.bannerSub}>
                {loading ? "Loading..." : `${services.length} service${services.length !== 1 ? "s" : ""} available · Hire via Discord DMs`}
              </p>
            </div>
          </div>
          {user ? (
            <Link href="/services/new" className={styles.listBtn}><Plus size={16} />Offer a Service</Link>
          ) : (
            <Link href="/" className={styles.listBtn}>Login to Post</Link>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search services, sellers, tags..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className={styles.filterToggle} onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={14} />Filters
            <ChevronDown size={14} style={{ transform: filterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          <div className={styles.sortWrap}>
            <TrendingUp size={13} style={{ color: "var(--text-muted)" }} />
            <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category pills */}
        {filterOpen && (
          <div className={styles.categories}>
            <button className={`${styles.catPill} ${category === "All" ? styles.catActive : ""}`} onClick={() => setCategory("All")}>All</button>
            {SERVICE_CATEGORIES.map((c) => (
              <button key={c} className={`${styles.catPill} ${category === c ? styles.catActive : ""}`} onClick={() => setCategory(c)}>
                {CATEGORY_ICONS[c]} {c}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className={styles.loadingState}><Loader2 size={32} className={styles.spinner} /><p>Loading services...</p></div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <Wrench size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No services found</h3>
            <p className={styles.emptySub}>{services.length === 0 ? "Be the first to offer a service!" : "Try adjusting your search."}</p>
            {user && <Link href="/services/new" className={styles.emptyBtn}><Plus size={15} /> Offer a Service</Link>}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((s) => (
              <Link key={s.id} href={`/services/${s.id}`} className={styles.card}>
                <div className={styles.cardImg}>
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.title} className={styles.itemImg} />
                  ) : (
                    <NoImagePlaceholder size="sm" />
                  )}
                  <span className={styles.catBadge}>{CATEGORY_ICONS[s.category]} {s.category}</span>
                  {(s.bumps || 0) > 0 && <span className={styles.bumpBadge}><Zap size={10} /> {s.bumps}</span>}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.sellerRow}>
                    <MessageSquare size={11} className={styles.discordIcon} />
                    <span className={styles.sellerName}>{s.sellerDiscord}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardDesc}>{s.description}</p>

                  {s.tags.length > 0 && (
                    <div className={styles.cardTags}>{s.tags.slice(0, 3).map((t) => <span key={t} className={styles.tag}>#{t}</span>)}</div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{s.price}</span>
                    <span className={styles.delivery}><Timer size={11} /> {s.deliveryTime}</span>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}><Eye size={11} /> {s.views || 0}</span>
                    <span className={styles.metaItem}><Clock size={11} /> {timeAgo(s.createdAt)}</span>
                    {s.rating > 0 && <span className={styles.metaItem}><Star size={11} /> {s.rating.toFixed(1)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
