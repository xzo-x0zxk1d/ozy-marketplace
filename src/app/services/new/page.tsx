"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, saveService, generateId } from "@/lib/storage";
import { SERVICE_CATEGORIES, DELIVERY_TIMES, ServiceCategory } from "@/lib/types";
import { ArrowLeft, Plus, Tag, AlertCircle, Loader2, Link as LinkIcon, Timer } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import styles from "./page.module.css";

export default function NewServicePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Scripting");
  const [deliveryTime, setDeliveryTime] = useState("Negotiable");
  const [imageUrl, setImageUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [useExternal, setUseExternal] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceId] = useState(() => generateId());
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u) router.push("/");
    else setUser(u);
  }, [router]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 6) { setTags([...tags, t]); setTagInput(""); }
  };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));
  const finalImageUrl = useExternal ? externalUrl.trim() : imageUrl;

  const submit = async () => {
    setError("");
    const u = getCurrentUser();
    if (!u) { router.push("/"); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (!price.trim()) { setError("Price is required."); return; }
    setLoading(true);
    try {
      const service = {
        id: serviceId,
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        deliveryTime,
        imageUrl: finalImageUrl || undefined,
        sellerUsername: u.username,
        sellerDiscord: u.discordUsername,
        createdAt: new Date().toISOString(),
        tags,
        views: 0, bumps: 0, rating: 0, reviews: 0,
      };
      await saveService(service);
      router.push(`/services/${service.id}`);
    } catch {
      setError("Failed to publish service. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link href="/services" className={styles.back}><ArrowLeft size={15} /> Back to Services</Link>
          <h1 className={styles.title}>Offer a Service</h1>
          <p className={styles.sub}>Describe what you offer. Clients will contact you on Discord.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Service Details</h2>
            <div className={styles.field}>
              <label className={styles.label}>Title <span className={styles.req}>*</span></label>
              <input type="text" placeholder="e.g. Professional Roblox Scripting" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
              <span className={styles.count}>{title.length}/80</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description <span className={styles.req}>*</span></label>
              <textarea placeholder="Describe what you offer, your experience, portfolio links, what's included..." value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={800} className={styles.textarea} />
              <span className={styles.count}>{description.length}/800</span>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Starting Price <span className={styles.req}>*</span></label>
                <input type="text" placeholder="e.g. 500 Robux or $10" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}>
                  {SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}><Timer size={12} style={{display:"inline",marginRight:4}} />Delivery Time</label>
                <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                  {DELIVERY_TIMES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.imageSectionHeader}>
              <h2 className={styles.sectionTitle}>Portfolio / Preview Image</h2>
              <div className={styles.imageToggle}>
                <button className={`${styles.toggleBtn} ${!useExternal ? styles.toggleActive : ""}`} onClick={() => setUseExternal(false)}>Upload</button>
                <button className={`${styles.toggleBtn} ${useExternal ? styles.toggleActive : ""}`} onClick={() => setUseExternal(true)}><LinkIcon size={12} /> URL</button>
              </div>
            </div>
            {!useExternal ? (
              <ImageUploader listingId={serviceId} onUploaded={(url) => setImageUrl(url || "")} currentUrl={imageUrl || undefined} />
            ) : (
              <div className={styles.field}>
                <input type="url" placeholder="https://i.imgur.com/..." value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
                <span className={styles.fieldNote}>Link to a portfolio piece, example work, or service preview</span>
                {externalUrl && <div className={styles.imgPreview}><img src={externalUrl} alt="preview" className={styles.previewImg} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /></div>}
              </div>
            )}
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><Tag size={16} /> Tags (optional)</h2>
            <div className={styles.tagRow}>
              <input type="text" placeholder="e.g. lua, scripting, fast" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className={styles.tagInput} />
              <button className={styles.addTagBtn} onClick={addTag} disabled={tags.length >= 6}><Plus size={14} /></button>
            </div>
            {tags.length > 0 && (
              <div className={styles.tagList}>
                {tags.map((t) => <span key={t} className={styles.tagChip}>#{t}<button onClick={() => removeTag(t)} className={styles.removeTag}>×</button></span>)}
              </div>
            )}
            <span className={styles.fieldNote}>{tags.length}/6 tags</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.discordNote}>
            <AlertCircle size={14} />
            <span>Clients will DM you at <strong>{user?.discordUsername}</strong> on Discord to discuss their project and arrange payment.</span>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} onClick={submit} disabled={loading}>
            {loading ? <><Loader2 size={16} className={styles.spinBtn} /> Publishing...</> : "Publish Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
