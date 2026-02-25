import React from 'react';
import ReusableButton from './Button';
import styles from './BugCard.module.css';
import { isDeveloper, isManager, isQA } from '../util/auth';
import t from '../locales/en.json';

function BugCard({ bug, onEdit, onDelete, statusChange }) {
  
  const statusOptions = bug.bug_type === "feature" 
    ? ["new", "started", "completed"] 
    : ["new", "started", "resolved"];

  const userIsManager = isManager();
  const userIsQA = isQA();

  const handlePreviewImage = (imgPath) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/attachments/${bug.id}/` + imgPath.file_name;
    window.open(fileUrl, "_blank");
  };

  function onStatusChange(value) {
    const bugData = {
      status: value,
    };
    statusChange(bugData, bug.id);
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.bugCard}>
        <div className={styles.cardContent}>
          <h3>{bug.title}</h3>
          <p><strong>{t.bugCard.label_description}</strong> {bug.description}</p>
          <table className={styles.bugTable}>
            <tbody>
              <tr>
                <td><strong>{t.bugCard.label_type}</strong> {bug.bug_type}</td>
                <td><strong>{t.bugCard.label_creator}</strong> {bug.creator.name}</td>
              </tr>
              <tr>
                <td>
                  <strong>{t.bugCard.label_status}</strong>
                  <select 
                    value={bug.status} 
                    onChange={(e) => onStatusChange(e.target.value)}
                    className={styles.statusDropdown}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td><strong>{t.bugCard.label_assignee}</strong> {bug.assignee?.name || t.bugCard.unassigned}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {bug.attachments?.length > 0 && (
          <div className={styles.attachments}>
            <h4>{t.bugCard.label_attachments}</h4>
            {bug.attachments.map((attachment, index) => (
              <div key={index} className={styles.attachmentItem}>
                <span>{attachment.file_name}</span>
                <ReusableButton 
                  size="small" 
                  onClick={() => handlePreviewImage(attachment)}
                >
                  {t.bugCard.btn_preview}
                </ReusableButton>
              </div>
            ))}
          </div>
        )}
        <div className={styles.cardActions}>
          {(userIsManager || userIsQA) && (
            <>
              <ReusableButton size="small" onClick={() => onEdit(bug.id)}>
                {t.bugCard.btn_edit}
              </ReusableButton>
              <ReusableButton size="small" onClick={() => onDelete(bug.id)}>
                {t.bugCard.btn_delete}
              </ReusableButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BugCard;
