// src/pages/Home/components/SkeletonRow.jsx

import styles from "../Home.module.css";
import { TableRow, TableCell } from "@/components/ui/table";

export default function SkeletonRow() {
  return (
    <TableRow className={styles.skeletonRow}>
      {Array.from({ length: 8 }, (_, i) => (
        <TableCell key={i} className={styles.skeletonCell}>
          <div className={styles.skeletonBar} />
        </TableCell>
      ))}
    </TableRow>
  );
}