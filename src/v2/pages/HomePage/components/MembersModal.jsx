// src/pages/Home/components/MembersModal.jsx

import styles from "../Home.module.css";
import { avatarColor } from "../constants";
import { Button } from "@/components/ui/button";
import { FlaskConical, Users, X } from "lucide-react";

export default function MembersModal({ open, onClose, title, projectName, members, type }) {
  if (!open) return null;

  const typeBadgeClass = type === "qa" ? styles.memberTypeQa : styles.memberTypeDev;
  const typeLabel      = type === "qa" ? "QA" : "Dev";
  const TitleIcon      = type === "qa" ? FlaskConical : Users;
  const iconColor      = type === "qa" ? "var(--purple)" : "var(--green)";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitleGroup}>
              <TitleIcon className={styles.modalTitleIcon} style={{ color: iconColor }} />
              <span className={styles.modalTitle}>{title}</span>
            </div>
            <p className={styles.modalSubtitle}>{projectName}</p>
          </div>
          <Button variant="ghost" size="icon" className={styles.modalCloseBtn} onClick={onClose}>
            <X className={styles.menuIcon} />
          </Button>
        </div>

        <div className={styles.modalBody}>
          {members.length === 0 ? (
            <p className={styles.modalEmpty}>No {title.toLowerCase()} assigned yet.</p>
          ) : (
            members.map((m, idx) => (
              <div
                key={m.id}
                className={styles.memberRow}
                style={{ "--avatar-color": avatarColor(idx) }}
              >
                <div className={styles.memberAvatar}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.memberInfo}>
                  <p className={styles.memberName}>{m.name}</p>
                  <p className={styles.memberEmail}>{m.email}</p>
                </div>
                <span className={typeBadgeClass}>{typeLabel}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}