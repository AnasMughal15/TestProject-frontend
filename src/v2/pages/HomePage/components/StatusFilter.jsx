export default function StatusFilter({
  statuses,
  selected,
  onToggle,
  onToggleAll,
  allSelected,
  styles,
}) {
  return (
    <>
      <label className={styles.filterCheckRow}>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
        />
        Select All
      </label>

      {statuses.map((s) => (
        <label key={s.id} className={styles.filterCheckRow}>
          <input
            type="checkbox"
            checked={selected.includes(s.label)}
            onChange={() => onToggle(s.label)}
          />
          {s.label}
        </label>
      ))}
    </>
  );
}