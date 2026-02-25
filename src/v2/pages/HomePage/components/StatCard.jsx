// src/pages/Home/components/StatCard.jsx

import styles from "../Home.module.css";

export default function StatCard({ icon: Icon, label, value, variant }) {
  return (
    <div className={styles[`statCard_${variant}`]}>
      <div className={styles.statIconWrap}>
        <Icon className={styles.statIcon} />
      </div>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}