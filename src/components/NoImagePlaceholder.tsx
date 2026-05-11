import { ImageOff } from "lucide-react";
import styles from "./NoImagePlaceholder.module.css";

interface Props {
  size?: "sm" | "lg";
}

export default function NoImagePlaceholder({ size = "sm" }: Props) {
  return (
    <div className={`${styles.wrap} ${size === "lg" ? styles.wrapLg : ""}`}>
      <div className={styles.iconWrap}>
        <ImageOff size={size === "lg" ? 40 : 28} className={styles.icon} />
        {/* Diagonal strike line done via CSS ::after on iconWrap */}
      </div>
      <span className={styles.label}>No image</span>
    </div>
  );
}
