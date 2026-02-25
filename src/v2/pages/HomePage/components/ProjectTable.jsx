// src/pages/Home/components/ProjectTable.jsx

import styles from "../Home.module.css";
import t from "@/locales/en.json";

import StatusBadge from "./StatusBadge";
import SkeletonRow from "./SkeletonRow";
import ActionMenu  from "./ActionMenu";

import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FolderOpen, Users, UserCircle2, FlaskConical } from "lucide-react";

export default function ProjectTable({
  isLoading,
  projects,
  startRow,
  searchTerm,
  selectedStatuses,
  userIsManager,
  statuses,
  onShowProject,
  onEditProject,
  onDeleteProject,
  onOpenMembers,
  onUpdateStatus,
}) {
  return (
    <div className={styles.tableWrap}>
      <Table>
        <TableHeader>
          <TableRow className={styles.thead}>
            <TableHead className={styles.thNum}>#</TableHead>
            <TableHead className={styles.th}>Project</TableHead>
            <TableHead className={styles.thManager}>Manager</TableHead>
            <TableHead className={styles.thStatus}>Status</TableHead>
            <TableHead className={styles.thDevs}>Developers</TableHead>
            <TableHead className={styles.thQa}>QA</TableHead>
            <TableHead className={styles.th}>Description</TableHead>
            <TableHead className={styles.thActions}>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)

          ) : projects.length === 0 ? (
            <TableRow className={styles.emptyRow}>
              <TableCell colSpan={8} className={styles.emptyCell}>
                <div className={styles.emptyInner}>
                  <div className={styles.emptyIconWrap}>
                    <FolderOpen className={styles.emptyIcon} />
                  </div>
                  <p className={styles.emptyText}>{t.home.no_projects}</p>
                  {(searchTerm || selectedStatuses.length > 0) && (
                    <p className={styles.emptyHint}>Try adjusting your search or filters</p>
                  )}
                </div>
              </TableCell>
            </TableRow>

          ) : (
            projects.map((project, idx) => {
              const devCount = project.developers?.length ?? 0;
              const qaCount  = project.qas?.length ?? 0;

              return (
                <TableRow
                  key={project.id}
                  className={styles.row}
                  onClick={() => onShowProject(project)}
                >
                  <TableCell className={styles.tdRowNum}>
                    {startRow + idx}
                  </TableCell>

                  <TableCell className={styles.td} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.projectNameCell}>
                      <div className={styles.projectIconWrap}>
                        <FolderOpen className={styles.projectIcon} />
                      </div>
                      <span
                        className={styles.projectName}
                        onClick={() => onShowProject(project)}
                      >
                        {project.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className={styles.td} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.managerCell}>
                      <div className={styles.managerAvatar}>
                        <UserCircle2 className={styles.managerIcon} />
                      </div>
                      <span className={styles.managerName}>{project.manager_name}</span>
                    </div>
                  </TableCell>

                  <TableCell className={styles.tdCenter} onClick={(e) => e.stopPropagation()}>
                    <StatusBadge
                      status={project.status}
                      userIsManager={userIsManager}
                      statuses={statuses}
                      onStatusChange={(newStatus) => onUpdateStatus(project.id, newStatus)}
                    />
                  </TableCell>

                  <TableCell className={styles.tdCenter} onClick={(e) => e.stopPropagation()}>
                    <Badge
                      className={`${devCount > 0 ? styles.devBadgeActive : styles.devBadgeEmpty} ${styles.clickableBadge}`}
                      onClick={(e) => onOpenMembers(e, project, "dev")}
                    >
                      <Users className={styles.devIcon} />
                      {devCount} {devCount === 1 ? "dev" : "devs"}
                    </Badge>
                  </TableCell>

                  <TableCell className={styles.tdCenter} onClick={(e) => e.stopPropagation()}>
                    <Badge
                      className={`${qaCount > 0 ? styles.qaBadgeActive : styles.qaBadgeEmpty} ${styles.clickableBadge}`}
                      onClick={(e) => onOpenMembers(e, project, "qa")}
                    >
                      <FlaskConical className={styles.devIcon} />
                      {qaCount} {qaCount === 1 ? "QA" : "QAs"}
                    </Badge>
                  </TableCell>

                  <TableCell className={styles.td} onClick={(e) => e.stopPropagation()}>
                    {project.description
                      ? <span className={styles.description}>{project.description}</span>
                      : <span className={styles.descriptionEmpty}>No description</span>}
                  </TableCell>

                  <TableCell className={styles.tdAction} onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      userIsManager={userIsManager}
                      onView={() => onShowProject(project)}
                      onEdit={() => onEditProject(project)}
                      onDelete={() => onDeleteProject(project.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}