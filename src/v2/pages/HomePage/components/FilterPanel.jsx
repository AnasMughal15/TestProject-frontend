// src/pages/Home/components/FilterPanel.jsx

import styles from "../Home.module.css";
import { STATUS_DISPLAY } from "../constants";
import { SlidersHorizontal, ChevronLeft } from "lucide-react";

export default function FilterPanel({
  filterRef,
  filterOpen,
  statusSubOpen,
  selectedStatuses,
  statuses,
  allSelected,
  toggleFilterOpen,
  toggleStatus,
  toggleSelectAll,
  onCategoryEnter,
  onCategoryLeave,
  onSubPanelEnter,
  onSubPanelLeave,
}) {
  return (
    <div className={styles.filterWrap} ref={filterRef}>
      <button
        className={selectedStatuses.length > 0 ? styles.filterBtnActive : styles.filterBtn}
        onClick={toggleFilterOpen}
      >
        <SlidersHorizontal className={styles.filterBtnIcon} />
        Filters
        {selectedStatuses.length > 0 && (
          <span className={styles.filterBadge}>{selectedStatuses.length}</span>
        )}
      </button>

      {filterOpen && (
        <div className={styles.filterPanel}>
          <div
            className={styles.filterCategoryWrap}
            onMouseEnter={onCategoryEnter}
            onMouseLeave={onCategoryLeave}
          >
            <div className={styles.filterCategoryRow}>
              <span className={styles.filterCategoryLabel}>Status</span>
              {selectedStatuses.length > 0 && (
                <span className={styles.filterCategoryCount}>{selectedStatuses.length}</span>
              )}
              <ChevronLeft className={styles.filterArrow} />
            </div>

            {statusSubOpen && (
              <div
                className={styles.filterSubPanel}
                onMouseEnter={onSubPanelEnter}
                onMouseLeave={onSubPanelLeave}
              >
                <p className={styles.filterSubTitle}>Filter by status</p>
                <div className={styles.filterDivider} />

                <label className={styles.filterCheckRow}>
                  <input
                    type="checkbox"
                    className={styles.filterCheckbox}
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  Select All
                </label>
                <div className={styles.filterDivider} />

                {statuses.map((s) => (
                  <label key={s.id} className={styles.filterCheckRow}>
                    <input
                      type="checkbox"
                      className={styles.filterCheckbox}
                      checked={selectedStatuses.includes(s.label)}
                      onChange={() => toggleStatus(s.label)}
                    />
                    {STATUS_DISPLAY[s.label] ?? s.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}