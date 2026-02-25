// src/pages/Home/HomePageV2.jsx

import { useNavigate } from "react-router-dom";
import { isManager } from "@/util/auth";
import t from "@/locales/en.json";
import styles from "./Home.module.css";

import useProjects     from "./hooks/useProjects";
import useProjectModal from "./hooks/useProjectModal";
import useMembersModal from "./hooks/useMembersModal";
import useFilterPanel  from "./hooks/useFilterPanel";

import ProjectModal   from "./components/ProjectModal";
import MembersModal   from "./components/MembersModal";
import FilterPanel    from "./components/FilterPanel";
import StatCard       from "./components/StatCard";
import ProjectTable   from "./components/ProjectTable";
import PaginationBar  from "./components/PaginationBar";

import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Plus, Search, LayoutGrid, Users, UserCircle2 } from "lucide-react";

function HomePageV2() {
  const navigate      = useNavigate();
  const userIsManager = isManager();

  // ── Hooks ───────────────────────────────────────────────────────────────

  const {
    projects, pagination, searchTerm, setSearchTerm, isLoading, startRow,
    statuses, selectedStatuses, allSelected,
    deleteProject, updateProjectStatus, toggleStatus, toggleSelectAll, goToPage, refetch,
  } = useProjects();

  const {
    isModalOpen, isEditMode, currentProject,
    openCreate, openEdit, closeModal, onModalSubmit,
  } = useProjectModal(refetch);

  const { membersModal, openMembers, closeMembers } = useMembersModal();

  const {
    filterOpen, statusSubOpen, filterRef,
    toggleFilterOpen,
    onCategoryEnter, onCategoryLeave,
    onSubPanelEnter, onSubPanelLeave,
  } = useFilterPanel();

  // ── Navigation ──────────────────────────────────────────────────────────

  const showProject = (p) => navigate(`/project/${p.name}`, { state: p });

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div className={styles.headerBar}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Projects</h1>
            <p className={styles.headerSubtitle}>Manage and track all your projects</p>
          </div>

          <div className={styles.headerActions}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <Search className={styles.searchIcon} />
              <Input
                placeholder={t.home.placeholder_search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Filters */}
            <FilterPanel
              filterRef={filterRef}
              filterOpen={filterOpen}
              statusSubOpen={statusSubOpen}
              selectedStatuses={selectedStatuses}
              statuses={statuses}
              allSelected={allSelected}
              toggleFilterOpen={toggleFilterOpen}
              toggleStatus={toggleStatus}
              toggleSelectAll={toggleSelectAll}
              onCategoryEnter={onCategoryEnter}
              onCategoryLeave={onCategoryLeave}
              onSubPanelEnter={onSubPanelEnter}
              onSubPanelLeave={onSubPanelLeave}
            />

            {/* Create */}
            {userIsManager && (
              <Button onClick={openCreate} className={styles.createBtn}>
                <Plus className={styles.btnIcon} />
                {t.home.btn_createProject}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className={styles.body}>

        {/* Stat cards */}
        <div className={styles.statsRow}>
          <StatCard icon={LayoutGrid}  label="Total Projects" value={pagination.totalProjects}                                 variant="gold"   />
          <StatCard icon={Users}       label="Showing"        value={`${projects.length} / ${pagination.totalProjects}`}      variant="indigo" />
          <StatCard icon={UserCircle2} label="Page"           value={`${pagination.currentPage} of ${pagination.totalPages}`} variant="green"  />
        </div>

        {/* Table */}
        <ProjectTable
          isLoading={isLoading}
          projects={projects}
          startRow={startRow}
          searchTerm={searchTerm}
          selectedStatuses={selectedStatuses}
          userIsManager={userIsManager}
          statuses={statuses}
          onShowProject={showProject}
          onEditProject={openEdit}
          onDeleteProject={deleteProject}
          onOpenMembers={openMembers}
          onUpdateStatus={updateProjectStatus}
        />

        {/* Pagination */}
        {true && (
          <PaginationBar
            pagination={pagination}
            startRow={startRow}
            projectsCount={projects.length}
            goToPage={goToPage}
          />
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <ProjectModal
        open={isModalOpen}
        handleClose={closeModal}
        onSubmit={onModalSubmit}
        isEditMode={isEditMode}
        project={currentProject}
        statuses={statuses}
      />

      <MembersModal
        open={membersModal.open}
        onClose={closeMembers}
        title={membersModal.title}
        projectName={membersModal.projectName}
        members={membersModal.members}
        type={membersModal.type}
      />
    </div>
  );
}

export default HomePageV2;








// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { isManager } from "@/util/auth";
// import t from "@/locales/en.json";
// import styles from "./Home.module.css";

// import ReusableModal from "@/components/Modal";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table, TableBody, TableCell,
//   TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   Plus, Search, Eye, Pencil, Trash2,
//   ChevronLeft, ChevronRight, FolderOpen,
//   Users, LayoutGrid, UserCircle2, MoreVertical,
//   FlaskConical, X, SlidersHorizontal,
// } from "lucide-react";

// // ── Status config ──────────────────────────────────────────────────────────

// const STATUS_DISPLAY = {
//   active:    "Active",
//   inactive:  "Inactive",
//   onhold:    "On Hold",
//   completed: "Completed",
// };

// const STATUS_CLASS = {
//   active:    styles.statusActive,
//   inactive:  styles.statusInactive,
//   onhold:    styles.statusOnhold,
//   completed: styles.statusCompleted,
// };

// // ── Avatar colour pool ─────────────────────────────────────────────────────

// const AVATAR_COLORS = ["var(--green)", "var(--indigo)", "var(--gold)", "var(--purple)"];
// const avatarColor = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

// // ── StatusBadge ────────────────────────────────────────────────────────────

// function StatusBadge({ status }) {
//   return (
//     <span className={STATUS_CLASS[status] ?? styles.statusInactive}>
//       {STATUS_DISPLAY[status] ?? status}
//     </span>
//   );
// }

// // ── MembersModal ────────────────────────────────────────────────────────────

// function MembersModal({ open, onClose, title, projectName, members, type }) {
//   if (!open) return null;

//   const typeBadgeClass = type === "qa" ? styles.memberTypeQa : styles.memberTypeDev;
//   const typeLabel      = type === "qa" ? "QA" : "Dev";
//   const TitleIcon      = type === "qa" ? FlaskConical : Users;
//   const iconColor      = type === "qa" ? "var(--purple)" : "var(--green)";

//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>

//         <div className={styles.modalHeader}>
//           <div>
//             <div className={styles.modalTitleGroup}>
//               <TitleIcon className={styles.modalTitleIcon} style={{ color: iconColor }} />
//               <span className={styles.modalTitle}>{title}</span>
//             </div>
//             <p className={styles.modalSubtitle}>{projectName}</p>
//           </div>
//           <Button variant="ghost" size="icon" className={styles.modalCloseBtn} onClick={onClose}>
//             <X className={styles.menuIcon} />
//           </Button>
//         </div>

//         <div className={styles.modalBody}>
//           {members.length === 0 ? (
//             <p className={styles.modalEmpty}>No {title.toLowerCase()} assigned yet.</p>
//           ) : (
//             members.map((m, idx) => (
//               <div key={m.id} className={styles.memberRow}
//                 style={{ "--avatar-color": avatarColor(idx) }}>
//                 <div className={styles.memberAvatar}>
//                   {m.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div className={styles.memberInfo}>
//                   <p className={styles.memberName}>{m.name}</p>
//                   <p className={styles.memberEmail}>{m.email}</p>
//                 </div>
//                 <span className={typeBadgeClass}>{typeLabel}</span>
//               </div>
//             ))
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// // ── SkeletonRow ─────────────────────────────────────────────────────────────

// function SkeletonRow() {
//   return (
//     <TableRow className={styles.skeletonRow}>
//       {Array.from({ length: 8 }, (_, i) => (
//         <TableCell key={i} className={styles.skeletonCell}>
//           <div className={styles.skeletonBar} />
//         </TableCell>
//       ))}
//     </TableRow>
//   );
// }

// // ── StatCard ────────────────────────────────────────────────────────────────

// function StatCard({ icon: Icon, label, value, variant }) {
//   return (
//     <div className={styles[`statCard_${variant}`]}>
//       <div className={styles.statIconWrap}>
//         <Icon className={styles.statIcon} />
//       </div>
//       <div>
//         <p className={styles.statLabel}>{label}</p>
//         <p className={styles.statValue}>{value}</p>
//       </div>
//     </div>
//   );
// }

// // ── ActionMenu ──────────────────────────────────────────────────────────────

// function ActionMenu({ onView, onEdit, onDelete, userIsManager }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className={styles.menuTrigger}>
//           <MoreVertical className={styles.menuIcon} />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className={styles.menuContent}>
//         <DropdownMenuItem className={styles.menuItemView} onClick={onView}>
//           <Eye className={styles.menuIcon} /> View
//         </DropdownMenuItem>
//         {userIsManager && (
//           <>
//             <DropdownMenuSeparator className={styles.menuSeparator} />
//             <DropdownMenuItem className={styles.menuItemEdit} onClick={onEdit}>
//               <Pencil className={styles.menuIcon} /> Edit
//             </DropdownMenuItem>
//             <DropdownMenuItem className={styles.menuItemDelete} onClick={onDelete}>
//               <Trash2 className={styles.menuIcon} /> Delete
//             </DropdownMenuItem>
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// // ── Main page ──────────────────────────────────────────────────────────────

// function HomePageV2() {
//   const [isModalOpen, setModalOpen]         = useState(false);
//   const [projects, setProjects]             = useState([]);
//   const [isEditMode, setIsEditMode]         = useState(false);
//   const [currentProject, setCurrentProject] = useState(null);
//   const [pagination, setPagination]         = useState({ totalPages: 1, currentPage: 1, totalProjects: 0 });
//   const [searchTerm, setSearchTerm]         = useState("");
//   const [isLoading, setIsLoading]           = useState(false);
//   const [membersModal, setMembersModal]     = useState({ open: false, title: "", projectName: "", members: [], type: "dev" });

//   // ── Filter state
//   const [statuses, setStatuses]             = useState([]);
//   const [selectedStatuses, setSelected]     = useState([]);
//   const [filterOpen, setFilterOpen]         = useState(false);
//   const [statusSubOpen, setStatusSubOpen]   = useState(false);

//   const filterRef   = useRef(null);
//   const statusTimeout = useRef(null);

//   const navigate    = useNavigate();
//   const userIsManager = isManager();
//   const startRow    = (pagination.currentPage - 1) * 10 + 1;
//   const allSelected = statuses.length > 0 && selectedStatuses.length === statuses.length;

//   // Close filter panel on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (filterRef.current && !filterRef.current.contains(e.target)) {
//         setFilterOpen(false);
//         setStatusSubOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const openCreate  = ()  => { setIsEditMode(false); setCurrentProject(null); setModalOpen(true); };
//   const openEdit    = (p) => { setIsEditMode(true);  setCurrentProject(p);    setModalOpen(true); };
//   const closeModal  = ()  => setModalOpen(false);
//   const showProject = (p) => navigate(`/project/${p.name}`, { state: p });

//   const openMembers = (e, project, type) => {
//     e.stopPropagation();
//     const members = type === "qa" ? (project.qas ?? []) : (project.developers ?? []);
//     setMembersModal({ open: true, title: type === "qa" ? "QA Testers" : "Developers", projectName: project.name, members, type });
//   };

//   const closeMembers = () => setMembersModal((prev) => ({ ...prev, open: false }));

//   const toggleStatus = (label) => {
//     const next = selectedStatuses.includes(label)
//       ? selectedStatuses.filter((s) => s !== label)
//       : [...selectedStatuses, label];
//     setSelected(next);
//     fetchProjects(1, 10, searchTerm, next);
//   };

//   const toggleSelectAll = () => {
//     const next = allSelected ? [] : statuses.map((s) => s.label);
//     setSelected(next);
//     fetchProjects(1, 10, searchTerm, next);
//   };

//   // ── Data fetching ──────────────────────────────────────────────────────────

//   const fetchStatuses = async () => {
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/projects/statuses`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       if (!res.ok) throw new Error();
//       setStatuses(await res.json());
//     } catch {
//       console.error("Failed to fetch statuses");
//     }
//   };

//   const fetchProjects = async (page, perPage, search, statusFilter) => {
//     setIsLoading(true);
//     try {
//       const params = new URLSearchParams({ page, per_page: perPage, search });
//       statusFilter.forEach((s) => params.append("status[]", s));
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/projects?${params.toString()}`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setProjects(data.projects);
//       setPagination({
//         totalPages:    data.pagination.total_pages,
//         currentPage:   data.pagination.current_page,
//         totalProjects: data.pagination.total_projects,
//       });
//     } catch {
//       console.error("Failed to fetch projects");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteProject = async (id) => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       if (!res.ok) throw new Error();
//       fetchProjects(pagination.currentPage, 10, searchTerm, selectedStatuses);
//     } catch {
//       console.error("Failed to delete project");
//     }
//   };

//   const onModalSubmit = () => { closeModal(); fetchProjects(pagination.currentPage, 10, searchTerm, selectedStatuses); };
//   const goToPage      = (p) => fetchProjects(p, 10, searchTerm, selectedStatuses);

//   // Debounced project fetch — also runs on mount (searchTerm starts as "")
//   useEffect(() => {
//     const timer = setTimeout(() => fetchProjects(1, 10, searchTerm, selectedStatuses), 250);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Fetch statuses once on mount (ref guard prevents Strict Mode double-invoke)
//   const statusesFetched = useRef(false);
//   useEffect(() => {
//     if (statusesFetched.current) return;
//     statusesFetched.current = true;
//     fetchStatuses();
//   }, []);

//   // ── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div className={styles.page}>

//       {/* Header bar */}
//       <div className={styles.headerBar}>
//         <div className={styles.headerInner}>
//           <div>
//             <h1 className={styles.headerTitle}>Projects</h1>
//             <p className={styles.headerSubtitle}>Manage and track all your projects</p>
//           </div>

//           <div className={styles.headerActions}>
//             {/* Search */}
//             <div className={styles.searchWrap}>
//               <Search className={styles.searchIcon} />
//               <Input
//                 placeholder={t.home.placeholder_search}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className={styles.searchInput}
//               />
//             </div>

//             {/* Filters */}
//             <div className={styles.filterWrap} ref={filterRef}>
//               <button
//                 className={selectedStatuses.length > 0 ? styles.filterBtnActive : styles.filterBtn}
//                 onClick={() => { setFilterOpen((o) => !o); setStatusSubOpen(false); }}
//               >
//                 <SlidersHorizontal className={styles.filterBtnIcon} />
//                 Filters
//                 {selectedStatuses.length > 0 && (
//                   <span className={styles.filterBadge}>{selectedStatuses.length}</span>
//                 )}
//               </button>

//               {filterOpen && (
//                 <div className={styles.filterPanel}>
//                  <div
//                     className={styles.filterCategoryWrap}
//                     onMouseEnter={() => {
//                       clearTimeout(statusTimeout.current);
//                       setStatusSubOpen(true);
//                     }}
//                     onMouseLeave={() => {
//                       statusTimeout.current = setTimeout(() => setStatusSubOpen(false), 150);
//                     }}
//                   >
//                     <div className={styles.filterCategoryRow}>
//                       <span className={styles.filterCategoryLabel}>Status</span>
//                       {selectedStatuses.length > 0 && (
//                         <span className={styles.filterCategoryCount}>{selectedStatuses.length}</span>
//                       )}
//                       <ChevronLeft className={styles.filterArrow} />
//                     </div>

//                     {statusSubOpen && (
//                       <div
//                         className={styles.filterSubPanel}
//                         onMouseEnter={() => clearTimeout(statusTimeout.current)}
//                         onMouseLeave={() => {
//                           statusTimeout.current = setTimeout(() => setStatusSubOpen(false), 150);
//                         }}
//                       >
//                         <p className={styles.filterSubTitle}>Filter by status</p>
//                         <div className={styles.filterDivider} />

//                         {/* Select All */}
//                         <label className={styles.filterCheckRow}>
//                           <input
//                             type="checkbox"
//                             className={styles.filterCheckbox}
//                             checked={allSelected}
//                             onChange={toggleSelectAll}
//                           />
//                           Select All
//                         </label>
//                         <div className={styles.filterDivider} />

//                         {/* Individual statuses */}
//                         {statuses.map((s) => (
//                           <label key={s.id} className={styles.filterCheckRow}>
//                             <input
//                               type="checkbox"
//                               className={styles.filterCheckbox}
//                               checked={selectedStatuses.includes(s.label)}
//                               onChange={() => toggleStatus(s.label)}
//                             />
//                             {STATUS_DISPLAY[s.label] ?? s.label}
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Create */}
//             {userIsManager && (
//               <Button onClick={openCreate} className={styles.createBtn}>
//                 <Plus className={styles.btnIcon} />
//                 {t.home.btn_createProject}
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className={styles.body}>

//         {/* Stat cards */}
//         <div className={styles.statsRow}>
//           <StatCard icon={LayoutGrid}  label="Total Projects" value={pagination.totalProjects}                                 variant="gold"   />
//           <StatCard icon={Users}       label="Showing"        value={`${projects.length} / ${pagination.totalProjects}`}      variant="indigo" />
//           <StatCard icon={UserCircle2} label="Page"           value={`${pagination.currentPage} of ${pagination.totalPages}`} variant="green"  />
//         </div>

//         {/* Table */}
//         <div className={styles.tableWrap}>
//           <Table>
//             <TableHeader>
//               <TableRow className={styles.thead}>
//                 <TableHead className={styles.thNum}>#</TableHead>
//                 <TableHead className={styles.th}>Project</TableHead>
//                 <TableHead className={styles.thManager}>Manager</TableHead>
//                 <TableHead className={styles.thStatus}>Status</TableHead>
//                 <TableHead className={styles.thDevs}>Developers</TableHead>
//                 <TableHead className={styles.thQa}>QA</TableHead>
//                 <TableHead className={styles.th}>Description</TableHead>
//                 <TableHead className={styles.thActions}>Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)

//               ) : projects.length === 0 ? (
//                 <TableRow className={styles.emptyRow}>
//                   <TableCell colSpan={8} className={styles.emptyCell}>
//                     <div className={styles.emptyInner}>
//                       <div className={styles.emptyIconWrap}>
//                         <FolderOpen className={styles.emptyIcon} />
//                       </div>
//                       <p className={styles.emptyText}>{t.home.no_projects}</p>
//                       {(searchTerm || selectedStatuses.length > 0) && (
//                         <p className={styles.emptyHint}>Try adjusting your search or filters</p>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>

//               ) : projects.map((project, idx) => {
//                 const devCount = project.developers?.length ?? 0;
//                 const qaCount  = project.qas?.length ?? 0;
//                 return (
//                   <TableRow key={project.id} className={styles.row} onClick={() => showProject(project)}>

//                     <TableCell className={styles.tdRowNum}>
//                       {startRow + idx}
//                     </TableCell>

//                     <TableCell className={styles.td} onClick={(e) => e.stopPropagation()}>
//                       <div className={styles.projectNameCell}>
//                         <div className={styles.projectIconWrap}>
//                           <FolderOpen className={styles.projectIcon} />
//                         </div>
//                         <span className={styles.projectName} onClick={() => showProject(project)}>
//                           {project.name}
//                         </span>
//                       </div>
//                     </TableCell>

//                     <TableCell className={styles.td} onClick={(e) => e.stopPropagation()}>
//                       <div className={styles.managerCell}>
//                         <div className={styles.managerAvatar}>
//                           <UserCircle2 className={styles.managerIcon} />
//                         </div>
//                         <span className={styles.managerName}>{project.manager_name}</span>
//                       </div>
//                     </TableCell>

//                     {/* Status */}
//                     <TableCell className={styles.tdCenter} onClick={(e) => e.stopPropagation()}>
//                       <StatusBadge status={project.status} />
//                     </TableCell>

//                     {/* Developers */}
//                     <TableCell className={styles.tdCenter} onClick={(e) => e.stopPropagation()}>
//                       <Badge
//                         className={`${devCount > 0 ? styles.devBadgeActive : styles.devBadgeEmpty} ${styles.clickableBadge}`}
//                         onClick={(e) => openMembers(e, project, "dev")}
//                       >
//                         <Users className={styles.devIcon} />
//                         {devCount} {devCount === 1 ? "dev" : "devs"}
//                       </Badge>
//                     </TableCell>

//                     {/* QA */}
//                     <TableCell className={styles.tdCenter} onClick={(e) => e.stopPropagation()}>
//                       <Badge
//                         className={`${qaCount > 0 ? styles.qaBadgeActive : styles.qaBadgeEmpty} ${styles.clickableBadge}`}
//                         onClick={(e) => openMembers(e, project, "qa")}
//                       >
//                         <FlaskConical className={styles.devIcon} />
//                         {qaCount} {qaCount === 1 ? "QA" : "QAs"}
//                       </Badge>
//                     </TableCell>

//                     {/* Description */}
//                     <TableCell className={styles.td} onClick={(e) => e.stopPropagation()}>
//                       {project.description
//                         ? <span className={styles.description}>{project.description}</span>
//                         : <span className={styles.descriptionEmpty}>No description</span>}
//                     </TableCell>

//                     <TableCell className={styles.tdAction} onClick={(e) => e.stopPropagation()}>
//                       <ActionMenu
//                         userIsManager={userIsManager}
//                         onView={() => showProject(project)}
//                         onEdit={() => openEdit(project)}
//                         onDelete={() => deleteProject(project.id)}
//                       />
//                     </TableCell>

//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         {true && (
//           <div className={styles.paginationBar}>
//             <p className={styles.paginationInfo}>
//               Rows {startRow}–{Math.min(startRow + projects.length - 1, pagination.totalProjects)} of {pagination.totalProjects}
//             </p>
//             <div className={styles.paginationBtns}>
//               <Button variant="ghost" size="icon" disabled={pagination.currentPage === 1}
//                 onClick={() => goToPage(pagination.currentPage - 1)} className={styles.pageBtnNav}>
//                 <ChevronLeft className={styles.navIcon} />
//               </Button>
//               {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
//                 <Button key={page} variant="ghost" size="icon" onClick={() => goToPage(page)}
//                   className={pagination.currentPage === page ? styles.pageBtnActive : styles.pageBtn}>
//                   {page}
//                 </Button>
//               ))}
//               <Button variant="ghost" size="icon" disabled={pagination.currentPage === pagination.totalPages}
//                 onClick={() => goToPage(pagination.currentPage + 1)} className={styles.pageBtnNav}>
//                 <ChevronRight className={styles.navIcon} />
//               </Button>
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Project create/edit modal */}
//       <ReusableModal
//         open={isModalOpen}
//         handleClose={closeModal}
//         onSubmit={onModalSubmit}
//         isEditMode={isEditMode}
//         project={currentProject}
//       />

//       {/* Members modal — shared for devs and QA */}
//       <MembersModal
//         open={membersModal.open}
//         onClose={closeMembers}
//         title={membersModal.title}
//         projectName={membersModal.projectName}
//         members={membersModal.members}
//         type={membersModal.type}
//       />
//     </div>
//   );
// }

// export default HomePageV2;
