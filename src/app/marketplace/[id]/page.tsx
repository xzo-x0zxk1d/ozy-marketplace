"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getListings, getCurrentUser, deleteListing, bumpListing, incrementViews } from "@/lib/storage";
import { Listing } from "@/lib/types";
import { ArrowLeft, MessageSquare, Eye, Clock, Tag, Zap, Package, Trash2, ExternalLink, Shield, AlertTriangle, Copy, Check, Loader2 } from "lucide-react";
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

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user] = useState(getCurrentUser());
  const [copied, setCopied] = useState(false);
  const [bumped, setBumped] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getListings();
      const found = all.find((l) => l.id === id);
      if (!found) { setNotFound(true); setPageLoading(false); return; }
      setListing(found);
      setPageLoading(false);
      await incrementViews(id);
    }
    load();
  }, [id]);

  const handleBump = async () => {
    if (!user || bumped) return;
    setBumped(true);
    setListing((l) => l ? { ...l, bumps: (l.bumps || 0) + 1 } : l);
    await bumpListing(id);
  };

  const handleDelete = async () => {
    if (!user || !listing) return;
    setDeleting(true);
    await deleteListing(id, user.username);
    router.push("/marketplace");
  };

  const handleCopyDiscord = () => {
    if (!listing) return;
    navigator.clipboard.writeText(listing.sellerDiscord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const conditionColor = (c: string) => {
    if (c === "Mint") return "#2ecc71";
    if (c === "Good") return "#f1c40f";
    return "#e67e22";
  };

  if (pageLoading) return (
    <div className={styles.loading}><div className={styles.spinner} /></div>
  );

  if (notFound) return (
    <div className={styles.notFound}>
      <Package size={48} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
      <h2>Listing not found</h2>
      <p>It may have been deleted or expired.</p>
      <Link href="/marketplace" className={styles.backBtn}>← Back to Marketplace</Link>
    </div>
  );

  if (!listing) return null;

  const isOwner = user?.username === listing.sellerUsername;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link href="/marketplace" className={styles.back}><ArrowLeft size={15} /> Back to Marketplace</Link>

        <div className={styles.layout}>
          {/* Image panel */}
          <div className={styles.imagePanel}>
            {listing.imageUrl ? (
              <img src={listing.imageUrl} alt={listing.title} className={styles.image} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <Package size={64} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
                <span>No image provided</span>
              </div>
            )}
            <div className={styles.badges}>
              <span className={styles.condBadge} style={{ background: conditionColor(listing.condition) + "22", color: conditionColor(listing.condition), border: `1px solid ${conditionColor(listing.condition)}44` }}>{listing.condition}</span>
              <span className={styles.catBadge}><Tag size={11} /> {listing.category}</span>
            </div>
          </div>

          {/* Info panel */}
          <div className={styles.infoPanel}>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}><Eye size={12} /> {listing.views || 0} views</span>
              <span className={styles.metaItem}><Zap size={12} /> {listing.bumps || 0} bumps</span>
              <span className={styles.metaItem}><Clock size={12} /> {timeAgo(listing.createdAt)}</span>
            </div>

            <h1 className={styles.title}>{listing.title}</h1>
            <div className={styles.price}>{listing.price}</div>
            <p className={styles.description}>{listing.description}</p>

            {listing.tags.length > 0 && (
              <div className={styles.tags}>{listing.tags.map((t) => <span key={t} className={styles.tag}>#{t}</span>)}</div>
            )}

            {/* Discord contact card */}
            <div className={styles.contactCard}>
              <div className={styles.contactHeader}><MessageSquare size={16} className={styles.discordIcon} /><span>Contact Seller on Discord</span></div>
              <p className={styles.contactSub}>All transactions are handled through Discord DMs. Message the seller to negotiate and complete your purchase.</p>
              <div className={styles.discordRow}>
                <div className={styles.discordHandle}>
                  <span className={styles.sellerName}>{listing.sellerUsername}</span>
                  <span className={styles.discordTag}>{listing.sellerDiscord}</span>
                </div>
                <button className={styles.copyBtn} onClick={handleCopyDiscord}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={styles.dmBtn}>
                <MessageSquare size={15} />
                Open Discord & DM {listing.sellerDiscord}
                <ExternalLink size={13} />
              </a>
            </div>

            <div className={styles.safetyNote}>
              <Shield size={13} />
              <span>Always verify items before payment. Use trusted middlemen for high-value trades. Ozy Marketplace is not responsible for trade outcomes.</span>
            </div>

            <div className={styles.actions}>
              {!isOwner && user && (
                <button className={`${styles.actionBtn} ${bumped ? styles.bumpedBtn : ""}`} onClick={handleBump} disabled={bumped}>
                  <Zap size={14} />{bumped ? "Bumped!" : "Bump Listing"}
                </button>
              )}
              {isOwner && (
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setShowDelete(true)}>
                  <Trash2 size={14} />Delete Listing
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        {showDelete && (
          <div className={styles.modalOverlay} onClick={() => !deleting && setShowDelete(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <AlertTriangle size={32} className={styles.modalIcon} />
              <h3 className={styles.modalTitle}>Delete this listing?</h3>
              <p className={styles.modalSub}>This cannot be undone. Your listing will be permanently removed.</p>
              <div className={styles.modalBtns}>
                <button className={styles.modalCancel} onClick={() => setShowDelete(false)} disabled={deleting}>Cancel</button>
                <button className={styles.modalDelete} onClick={handleDelete} disabled={deleting}>
                  {deleting ? <><Loader2 size={14} className={styles.spinBtn} /> Deleting...</> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
