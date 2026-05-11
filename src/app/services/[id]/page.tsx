"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getServices, getCurrentUser, deleteService, bumpService, incrementServiceViews } from "@/lib/storage";
import { Service } from "@/lib/types";
import { ArrowLeft, MessageSquare, Eye, Clock, Tag, Zap, Trash2, ExternalLink, Shield, AlertTriangle, Copy, Check, Loader2, Timer, Star, Package, Wrench } from "lucide-react";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
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

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user] = useState(getCurrentUser());
  const [copied, setCopied] = useState(false);
  const [bumped, setBumped] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getServices();
      const found = all.find((s) => s.id === id);
      if (!found) { setNotFound(true); setPageLoading(false); return; }
      setService(found);
      setPageLoading(false);
      await incrementServiceViews(id);
    }
    load();
  }, [id]);

  const handleBump = async () => {
    if (!user || bumped) return;
    setBumped(true);
    setService((s) => s ? { ...s, bumps: (s.bumps || 0) + 1 } : s);
    await bumpService(id);
  };

  const handleDelete = async () => {
    if (!user || !service) return;
    setDeleting(true);
    await deleteService(id, user.username);
    router.push("/services");
  };

  const handleCopy = () => {
    if (!service) return;
    navigator.clipboard.writeText(service.sellerDiscord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (pageLoading) return <div className={styles.loading}><div className={styles.spinner} /></div>;
  if (notFound) return (
    <div className={styles.notFound}>
      <Wrench size={48} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
      <h2>Service not found</h2>
      <p>It may have been deleted.</p>
      <Link href="/services" className={styles.backBtn}>← Back to Services</Link>
    </div>
  );
  if (!service) return null;

  const isOwner = user?.username === service.sellerUsername;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link href="/services" className={styles.back}><ArrowLeft size={15} /> Back to Services</Link>

        <div className={styles.layout}>
          {/* Image panel */}
          <div className={styles.imagePanel}>
            {service.imageUrl ? (
              <img src={service.imageUrl} alt={service.title} className={styles.image} />
            ) : (
              <div className={styles.imagePlaceholder}><NoImagePlaceholder size="lg" /></div>
            )}
            <div className={styles.badges}>
              <span className={styles.catBadge}><Tag size={11} /> {service.category}</span>
              <span className={styles.deliveryBadge}><Timer size={11} /> {service.deliveryTime}</span>
            </div>
            {service.rating > 0 && (
              <div className={styles.ratingCard}>
                <Star size={16} className={styles.starIcon} />
                <span className={styles.ratingNum}>{service.rating.toFixed(1)}</span>
                <span className={styles.ratingCount}>({service.reviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className={styles.infoPanel}>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}><Eye size={12} /> {service.views || 0} views</span>
              <span className={styles.metaItem}><Zap size={12} /> {service.bumps || 0} bumps</span>
              <span className={styles.metaItem}><Clock size={12} /> {timeAgo(service.createdAt)}</span>
            </div>

            <h1 className={styles.title}>{service.title}</h1>
            <div className={styles.price}>{service.price}</div>
            <p className={styles.description}>{service.description}</p>

            {service.tags.length > 0 && (
              <div className={styles.tags}>{service.tags.map((t) => <span key={t} className={styles.tag}>#{t}</span>)}</div>
            )}

            {/* Discord contact */}
            <div className={styles.contactCard}>
              <div className={styles.contactHeader}><MessageSquare size={16} className={styles.discordIcon} /><span>Hire via Discord</span></div>
              <p className={styles.contactSub}>DM the seller on Discord to discuss your project, timeline, and pricing.</p>
              <div className={styles.discordRow}>
                <div className={styles.discordHandle}>
                  <span className={styles.sellerName}>{service.sellerUsername}</span>
                  <span className={styles.discordTag}>{service.sellerDiscord}</span>
                </div>
                <button className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={styles.dmBtn}>
                <MessageSquare size={15} />Open Discord & DM {service.sellerDiscord}<ExternalLink size={13} />
              </a>
            </div>

            <div className={styles.safetyNote}>
              <Shield size={13} />
              <span>Always verify work samples before payment. Use milestone payments for large projects. Ozy Marketplace is not responsible for service outcomes.</span>
            </div>

            <div className={styles.actions}>
              {!isOwner && user && (
                <button className={`${styles.actionBtn} ${bumped ? styles.bumpedBtn : ""}`} onClick={handleBump} disabled={bumped}>
                  <Zap size={14} />{bumped ? "Bumped!" : "Bump Service"}
                </button>
              )}
              {isOwner && (
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setShowDelete(true)}>
                  <Trash2 size={14} />Delete Service
                </button>
              )}
            </div>
          </div>
        </div>

        {showDelete && (
          <div className={styles.modalOverlay} onClick={() => !deleting && setShowDelete(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <AlertTriangle size={32} className={styles.modalIcon} />
              <h3 className={styles.modalTitle}>Delete this service?</h3>
              <p className={styles.modalSub}>This cannot be undone.</p>
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
