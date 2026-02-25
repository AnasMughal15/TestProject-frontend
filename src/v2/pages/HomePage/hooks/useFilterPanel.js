// src/pages/Home/hooks/useFilterPanel.js

import { useState, useRef, useEffect } from "react";

export default function useFilterPanel() {
  const [filterOpen, setFilterOpen]       = useState(false);
  const [statusSubOpen, setStatusSubOpen] = useState(false);

  const filterRef     = useRef(null);
  const statusTimeout = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
        setStatusSubOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleFilterOpen = () => {
    setFilterOpen((o) => !o);
    setStatusSubOpen(false);
  };

  const onCategoryEnter = () => {
    clearTimeout(statusTimeout.current);
    setStatusSubOpen(true);
  };

  const onCategoryLeave = () => {
    statusTimeout.current = setTimeout(() => setStatusSubOpen(false), 150);
  };

  const onSubPanelEnter = () => clearTimeout(statusTimeout.current);

  const onSubPanelLeave = () => {
    statusTimeout.current = setTimeout(() => setStatusSubOpen(false), 150);
  };

  return {
    filterOpen, statusSubOpen, filterRef,
    toggleFilterOpen,
    onCategoryEnter, onCategoryLeave,
    onSubPanelEnter, onSubPanelLeave,
  };
}