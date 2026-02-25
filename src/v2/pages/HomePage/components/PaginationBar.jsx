// src/pages/Home/components/PaginationBar.jsx

import styles from "../Home.module.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationBar({ pagination, startRow, projectsCount, goToPage }) {
  const { currentPage, totalPages, totalProjects } = pagination;

  return (
    <div className={styles.paginationBar}>
      <p className={styles.paginationInfo}>
        Rows {startRow}–{Math.min(startRow + projectsCount - 1, totalProjects)} of {totalProjects}
      </p>

      <div className={styles.paginationBtns}>
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          className={styles.pageBtnNav}
        >
          <ChevronLeft className={styles.navIcon} />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant="ghost"
            size="icon"
            onClick={() => goToPage(page)}
            className={currentPage === page ? styles.pageBtnActive : styles.pageBtn}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className={styles.pageBtnNav}
        >
          <ChevronRight className={styles.navIcon} />
        </Button>
      </div>
    </div>
  );
}