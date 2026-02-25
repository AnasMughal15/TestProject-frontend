import styles from "../Home.module.css";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

export default function ActionMenu({ onView, onEdit, onDelete, userIsManager }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={styles.menuTrigger}>
          <MoreVertical className={styles.menuIcon} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={styles.menuContent}>
        <DropdownMenuItem className={styles.menuItemView} onClick={onView}>
          <Eye className={styles.menuIcon} /> View
        </DropdownMenuItem>
        {userIsManager && (
          <>
            <DropdownMenuSeparator className={styles.menuSeparator} />
            <DropdownMenuItem className={styles.menuItemEdit} onClick={onEdit}>
              <Pencil className={styles.menuIcon} /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.menuItemDelete} onClick={onDelete}>
              <Trash2 className={styles.menuIcon} /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}