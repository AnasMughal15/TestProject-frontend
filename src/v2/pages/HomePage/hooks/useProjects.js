// src/pages/Home/hooks/useProjects.js

import { useState, useEffect, useRef } from "react";

export default function useProjects() {
  const [projects, setProjects]         = useState([]);
  const [pagination, setPagination]     = useState({ totalPages: 1, currentPage: 1, totalProjects: 0 });
  const [searchTerm, setSearchTerm]     = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [statuses, setStatuses]         = useState([]);
  const [selectedStatuses, setSelected] = useState([]);

  const allSelected = statuses.length > 0 && selectedStatuses.length === statuses.length;
  const startRow    = (pagination.currentPage - 1) * 10 + 1;

  // ── Fetch helpers ───────────────────────────────────────────────────────

  const fetchProjects = async (page, perPage, search, statusFilter) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: perPage, search });
      statusFilter.forEach((s) => params.append("status[]", s));
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/projects?${params.toString()}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects);
      setPagination({
        totalPages:    data.pagination.total_pages,
        currentPage:   data.pagination.current_page,
        totalProjects: data.pagination.total_projects,
      });
    } catch {
      console.error("Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/projects/statuses`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      );
      if (!res.ok) throw new Error();
      setStatuses(await res.json());
    } catch {
      console.error("Failed to fetch statuses");
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error();
      fetchProjects(pagination.currentPage, 10, searchTerm, selectedStatuses);
    } catch {
      console.error("Failed to delete project");
    }
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      fetchProjects(pagination.currentPage, 10, searchTerm, selectedStatuses);
    } catch {
      console.error("Failed to update project status");
    }
  };

  // ── Filter toggles ─────────────────────────────────────────────────────

  const toggleStatus = (label) => {
    const next = selectedStatuses.includes(label)
      ? selectedStatuses.filter((s) => s !== label)
      : [...selectedStatuses, label];
    setSelected(next);
    fetchProjects(1, 10, searchTerm, next);
  };

  const toggleSelectAll = () => {
    const next = allSelected ? [] : statuses.map((s) => s.label);
    setSelected(next);
    fetchProjects(1, 10, searchTerm, next);
  };

  // ── Pagination ──────────────────────────────────────────────────────────

  const goToPage = (p) => fetchProjects(p, 10, searchTerm, selectedStatuses);
  const refetch  = ()  => fetchProjects(pagination.currentPage, 10, searchTerm, selectedStatuses);

  // ── Effects ─────────────────────────────────────────────────────────────

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchProjects(1, 10, searchTerm, selectedStatuses), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch statuses once on mount
  const statusesFetched = useRef(false);
  useEffect(() => {
    if (statusesFetched.current) return;
    statusesFetched.current = true;
    fetchStatuses();
  }, []);

  return {
    projects, pagination, searchTerm, setSearchTerm, isLoading, startRow,
    statuses, selectedStatuses, allSelected,
    deleteProject, updateProjectStatus, toggleStatus, toggleSelectAll, goToPage, refetch,
  };
}