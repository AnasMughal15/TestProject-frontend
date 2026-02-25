// src/pages/Home/constants.js

export const STATUS_DISPLAY = {
  active:    "Active",
  inactive:  "Inactive",
  onhold:    "On Hold",
  completed: "Completed",
};

export const AVATAR_COLORS = [
  "var(--green)",
  "var(--indigo)",
  "var(--gold)",
  "var(--purple)",
];

export const avatarColor = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];