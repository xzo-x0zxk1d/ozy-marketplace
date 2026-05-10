"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, saveListing, generateId } from "@/lib/storage";
import { CATEGORIES, CONDITIONS, ListingCategory, ListingCondition } from "@/lib/types";
import { ArrowLeft, Plus, Tag, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function NewListingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ListingCategory>("Limiteds");
  const [condition, setCondition] = useState<ListingCondition>("Mint");
  const [imageUrl, setImageUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const submit = async () => {
    setError("");
    const u = getCurrentUser();
    if (!u) { router.push("/"); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (!price.trim()) { setError("Price is required."); return; }

    setLoading(true);
    try {
      const listing = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        condition,
        imageUrl: imageUrl.trim() || undefined,
        sellerUsername: u.username,
        sellerDiscord: u.discordUsername,
        createdAt: new Date().toISOString(),
        tags,
        views: 0,
        bumps: 0,
      };
      await saveListing(listing);
      router.push(`/marketplace/${listing.id}`);
    } catch {
      setError("Failed to publish listing. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link href="/marketplace" className={styles.back}><ArrowLeft size={15} /> Back to Marketplace</Link>
          <h1 className={styles.title}>List an Item</h1>
          <p className={styles.sub}>Fill in the details. Buyers will contact you on Discord.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Item Details</h2>
            <div className={styles.field}>
              <label className={styles.label}>Title <span className={styles.req}>*</span></label>
              <input type="text" placeholder="e.g. Dominus Frigidus" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
              <span className={styles.count}>{title.length}/80</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description <span className={styles.req}>*</span></label>
              <textarea placeholder="Describe your item — condition details, what's included, trade preferences..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={500} className={styles.textarea} />
              <span className={styles.count}>{description.length}/500</span>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Price / Asking <span className={styles.req}>*</span></label>
                <input type="text" placeholder="e.g. 1500 Robux or $5 PayPal" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as ListingCategory)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Condition</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value as ListingCondition)}>
                  {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><ImageIcon size={16} /> Image (optional)</h2>
            <div className={styles.field}>
              <label className={styles.label}>Image URL</label>
              <input type="url" placeholder="https://tr.rbxcdn.com/..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <span className={styles.fieldNote}>Paste a direct image link (Roblox CDN, Imgur, etc.)</span>
            </div>
            {imageUrl && (
              <div className={styles.imgPreview}>
                <img src={imageUrl} alt="preview" className={styles.previewImg} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><Tag size={16} /> Tags (optional)</h2>
            <div className={styles.tagRow}>
              <input type="text" placeholder="Add a tag and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className={styles.tagInput} />
              <button className={styles.addTagBtn} onClick={addTag} disabled={tags.length >= 6}><Plus size={14} /></button>
            </div>
            {tags.length > 0 && (
              <div className={styles.tagList}>
                {tags.map((t) => (
                  <span key={t} className={styles.tagChip}>#{t}<button onClick={() => removeTag(t)} className={styles.removeTag}>×</button></span>
                ))}
              </div>
            )}
            <span className={styles.fieldNote}>{tags.length}/6 tags</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.discordNote}>
            <AlertCircle size={14} />
            <span>Buyers will DM you at <strong>{user?.discordUsername}</strong> on Discord to arrange payment and delivery.</span>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} onClick={submit} disabled={loading}>
            {loading ? <><Loader2 size={16} className={styles.spinBtn} /> Publishing...</> : "Publish Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
