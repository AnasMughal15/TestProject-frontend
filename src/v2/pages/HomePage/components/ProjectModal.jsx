// src/v2/pages/HomePage/components/ProjectModal.jsx

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { FolderOpen, Pencil, Search, X, Check, Users } from "lucide-react";
import { STATUS_DISPLAY } from "../constants";
import styles from "./ProjectModal.module.css";

export default function ProjectModal({
  open, handleClose, onSubmit, isEditMode, project, statuses,
}) {
  // ── RHF manages form fields ──────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({ defaultValues: { name: "", description: "", status: "active" } });

  const status = watch("status");

  // ── UI / async state stays in useState ───────────────────────────────────
  const [devSearch, setDevSearch]         = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [showResults, setShowResults]     = useState(false);
  const [selectedDevs, setSelectedDevs]   = useState([]);
  const searchTimer                       = useRef(null);

  // ── Reset form on open ───────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;

    reset({
      name:        isEditMode && project ? (project.name        ?? "")  : "",
      description: isEditMode && project ? (project.description ?? "")  : "",
      status:      isEditMode && project ? (project.status      ?? statuses?.[0]?.label ?? "active")
                                         : (statuses?.[0]?.label ?? "active"),
    });

    setSelectedDevs(isEditMode && project ? (project.developers ?? []) : []);
    setDevSearch("");
    setSearchResults([]);
    setShowResults(false);
  }, [open]);

  // ── Debounced search against /available_developers ───────────────────────

  useEffect(() => {
    clearTimeout(searchTimer.current);

    if (!devSearch.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/developers?search=${encodeURIComponent(devSearch)}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
        );
        const data = res.ok ? await res.json() : [];
        setSearchResults(
          (data ?? []).filter((d) => !selectedDevs.some((s) => s.id === d.id)),
        );
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer.current);
  }, [devSearch]);

  // ── Add / remove developer ────────────────────────────────────────────────

  const addDev = (dev) => {
    setSelectedDevs((prev) => [...prev, dev]);
    setDevSearch("");
    setSearchResults([]);
    setShowResults(false);
  };

  const removeDev = (dev) =>
    setSelectedDevs((prev) => prev.filter((d) => d.id !== dev.id));

  // ── Submit (called by RHF handleSubmit after validation) ────────────────

  const onFormSubmit = async (data) => {
    const body = {
      name:          data.name.trim(),
      description:   data.description,
      developer_ids: selectedDevs.map((d) => d.id),
    };
    if (isEditMode) body.status = data.status;

    const url    = isEditMode
      ? `${import.meta.env.VITE_API_URL}/projects/${project.id}`
      : `${import.meta.env.VITE_API_URL}/projects`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      onSubmit();
    } catch {
      console.error("Failed to save project");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const TitleIcon  = isEditMode ? Pencil    : FolderOpen;
  const iconAccent = isEditMode ? "var(--indigo)" : "var(--gold)";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className={styles.dialog}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleIconWrap} style={{ "--icon-accent": iconAccent }}>
              <TitleIcon className={styles.titleIcon} />
            </div>
            <div className={styles.titleText}>
              <DialogTitle className={styles.title}>
                {isEditMode ? "Edit Project" : "Create Project"}
              </DialogTitle>
              <DialogDescription className={styles.subtitle}>
                {isEditMode
                  ? "Update project details and assigned developers."
                  : "Set up a new project and assign developers."}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <form id="project-form" onSubmit={handleSubmit(onFormSubmit)}>
        <div className={styles.body}>

          {/* Project Name */}
          <div className={styles.field}>
            <label className={styles.label}>
              Project Name <span className={styles.required}>*</span>
            </label>
            <Input
              {...register("name", { required: true })}
              placeholder="Enter project name..."
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              {...register("description")}
              placeholder="Describe the project..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          {/* Status — edit mode only */}
          {isEditMode && (
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <div className={styles.statusRow}>
                {(statuses ?? []).map((s) => {
                  const active = status === s.label;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-status={s.label}
                      onClick={() => setValue("status", s.label)}
                      className={`${styles.statusOption} ${active ? styles.statusOptionActive : ""}`}
                    >
                      {active && <Check className={styles.statusCheck} />}
                      {STATUS_DISPLAY[s.label] ?? s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Developers */}
          <div className={styles.field}>
            <label className={styles.label}>
              <Users className={styles.labelIcon} />
              Available Developers
            </label>

            {/* Search input + results dropdown */}
            <div className={styles.devSearchWrap}>
              <Search className={styles.devSearchIcon} />
              <input
                value={devSearch}
                onChange={(e) => setDevSearch(e.target.value)}
                onFocus={() => devSearch.trim() && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
                placeholder="Search developers by name..."
                className={styles.devSearchInput}
              />
              {isSearching && <span className={styles.devSearchSpinner} />}

              {/* Dropdown results */}
              {showResults && (
                <div className={styles.devDropdown}>
                  {searchResults.length === 0 ? (
                    <p className={styles.devEmpty}>No developers found</p>
                  ) : (
                    searchResults.map((dev) => (
                      <button
                        key={dev.id}
                        type="button"
                        className={styles.devRow}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addDev(dev)}
                      >
                        <div className={styles.devAvatar}>
                          {dev.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.devName}>{dev.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected chips */}
            {selectedDevs.length > 0 && (
              <div className={styles.chips}>
                {selectedDevs.map((dev) => (
                  <span key={dev.id} className={styles.chip}>
                    {dev.name}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => removeDev(dev)}
                    >
                      <X className={styles.chipX} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
        </form>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className={styles.footer}>
          <Button variant="ghost" onClick={handleClose} className={styles.cancelBtn}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-form"
            disabled={isSubmitting}
            className={styles.submitBtn}
          >
            {isSubmitting ? "Saving…" : isEditMode ? "Update Project" : "Create Project"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
