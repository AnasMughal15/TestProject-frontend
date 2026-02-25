import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./ProjectDetailsCard.module.css";
import t from "../locales/en.json";

export default function ProjectDetailsCard({ project, name, manager_name, description, assignedDevelopers }) {
  return (
    <Box className={styles.detailsCardContainer}>
      <Card className={styles.detailsCard}>
        <CardContent>
          <Typography variant="h4" component="h1" className={styles.projectName}>
            {t.projectDetails.label_projectName} {project.name}
          </Typography>
          <Typography variant="h6" className={styles.projectManager}>
            {t.projectDetails.label_projectManager} {project.manager_name}
          </Typography>
          <Typography variant="h6" className={styles.sectionHeader}>
            {t.projectDetails.label_description}
          </Typography>
          <Typography variant="body1" className={styles.descriptionText}>
            {project.description}
          </Typography>
          <Typography variant="h6" className={styles.sectionHeader}>
            {t.projectDetails.label_assignedDevelopers}
          </Typography>
          <ul className={styles.developerList}>
            {project.developers && project.developers.length > 0 ? (
              project.developers.map((developer, index) => (
                <li key={index} className={styles.developerItem}>
                  {index + 1}. {developer.name}
                </li>
              ))
            ) : (
              <li className={styles.developerItem}>{t.projectDetails.no_developers}</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
