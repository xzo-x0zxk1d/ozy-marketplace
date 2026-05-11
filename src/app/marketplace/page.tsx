"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getListings, getCurrentUser } from "@/lib/storage";
import { Listing, CATEGORIES, ListingCategory } from "@/lib/types";
import { Search, Plus, MessageSquare, Eye, Zap, Clock, Tag, Filter, TrendingUp, ChevronDown, Loader2, Package } from "lucide-react";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import styles from "./page.module.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
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

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ListingCategory | "All">("All");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    getListings().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = [...listings];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) ||
          l.sellerUsername.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "All") list = list.filter((l) => l.category === category);
    switch (sort) {
      case "newest": list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "oldest": list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "price-asc": list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-desc": list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      case "bumped": list.sort((a, b) => (b.bumps || 0) - (a.bumps || 0)); break;
    }
    return list;
  }, [listings, search, category, sort]);

  const conditionColor = (c: string) => {
    if (c === "Mint") return "#2ecc71";
    if (c === "Good") return "#f1c40f";
    return "#e67e22";
  };

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerLeft}>
            <img src="https://www.image2url.com/r2/default/images/1777298619359-5547dcf2-321f-420c-bdd5-9aa18ea94df2.png" alt="Ozy" className={styles.bannerLogo} />
            <div>
              <h1 className={styles.bannerTitle}>OZY MARKETPLACE</h1>
              <p className={styles.bannerSub}>
                {loading ? "Loading listings..." : `${listings.length} listing${listings.length !== 1 ? "s" : ""} · Trade via Discord DMs · Made by Ozyrion`}
              </p>
            </div>
          </div>
          {user ? (
            <Link href="/marketplace/new" className={styles.listBtn}><Plus size={16} />List an Item</Link>
          ) : (
            <Link href="/" className={styles.listBtn}>Login to List</Link>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search listings, sellers, tags..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

        {filterOpen && (
          <div className={styles.categories}>
            <button className={`${styles.catPill} ${category === "All" ? styles.catActive : ""}`} onClick={() => setCategory("All")}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={`${styles.catPill} ${category === c ? styles.catActive : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Loading listings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <Package size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No listings found</h3>
            <p className={styles.emptySub}>{listings.length === 0 ? "Be the first to list an item!" : "Try adjusting your search or filters."}</p>
            {user && <Link href="/marketplace/new" className={styles.emptyBtn}><Plus size={15} /> List an Item</Link>}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((l) => (
              <Link key={l.id} href={`/marketplace/${l.id}`} className={styles.card}>
                <div className={styles.cardImg}>
                  {l.imageUrl ? (
                    <img src={l.imageUrl} alt={l.title} className={styles.itemImg} />
                  ) : (
                    <NoImagePlaceholder size="sm" />
                  )}
                  <span className={styles.conditionBadge} style={{ background: conditionColor(l.condition) + "22", color: conditionColor(l.condition), border: `1px solid ${conditionColor(l.condition)}44` }}>{l.condition}</span>
                  {(l.bumps || 0) > 0 && <span className={styles.bumpBadge}><Zap size={10} /> {l.bumps}</span>}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardCat}><Tag size={10} />{l.category}</div>
                  <h3 className={styles.cardTitle}>{l.title}</h3>
                  <p className={styles.cardDesc}>{l.description}</p>
                  {l.tags.length > 0 && (
                    <div className={styles.cardTags}>{l.tags.slice(0, 3).map((t) => <span key={t} className={styles.tag}>#{t}</span>)}</div>
                  )}
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{l.price}</span>
                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}><Eye size={11} /> {l.views || 0}</span>
                      <span className={styles.metaItem}><Clock size={11} /> {timeAgo(l.createdAt)}</span>
                    </div>
                  </div>
                  <div className={styles.cardSeller}><MessageSquare size={11} /><span>{l.sellerDiscord}</span></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
