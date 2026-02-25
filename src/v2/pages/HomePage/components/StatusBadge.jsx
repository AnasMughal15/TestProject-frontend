// src/pages/Home/components/StatusBadge.jsx

import styles from "../Home.module.css";
import { STATUS_DISPLAY } from "../constants";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const STATUS_CLASS = {
  active:    styles.statusActive,
  inactive:  styles.statusInactive,
  onhold:    styles.statusOnhold,
  completed: styles.statusCompleted,
};

export default function StatusBadge({ status, userIsManager, statuses, onStatusChange }) {
  const badgeClass = STATUS_CLASS[status] ?? styles.statusInactive;
  const label      = STATUS_DISPLAY[status] ?? status;

  if (!userIsManager) {
    return <span className={badgeClass}>{label}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`${badgeClass} ${styles.statusDropdownTrigger}`}>
          {label}
          <ChevronDown className={styles.statusChevron} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className={styles.menuContent}>
        {(statuses ?? []).map((s) => (
          <DropdownMenuItem
            key={s.id}
            className={styles.menuItem}
            onClick={() => s.label !== status && onStatusChange(s.label)}
          >
            <span className={STATUS_CLASS[s.label] ?? styles.statusInactive}>
              {STATUS_DISPLAY[s.label] ?? s.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
