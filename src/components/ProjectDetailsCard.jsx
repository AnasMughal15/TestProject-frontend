import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./ProjectDetailsCard.module.css";

export default function ProjectDetailsCard({ project, name, manager_name, description, assignedDevelopers }) {
  return (
    <Box className={styles.detailsCardContainer}>
      <Card className={styles.detailsCard}>
        <CardContent>
          <Typography variant="h4" component="h1" className={styles.projectName}>
            Project Name: {project.name}
          </Typography>
          <Typography variant="h6" className={styles.projectManager}>
            Project Manager: {project.manager_name}
          </Typography>
          <Typography variant="h6" className={styles.sectionHeader}>
            Description:
          </Typography>
          <Typography variant="body1" className={styles.descriptionText}>
            {project.description}
          </Typography>
          <Typography variant="h6" className={styles.sectionHeader}>
            Assigned Developers:
          </Typography>
          <ul className={styles.developerList}>
            {project.developers && project.developers.length > 0 ? (
              project.developers.map((developer, index) => (
                <li key={index} className={styles.developerItem}>
                  {index + 1}. {developer.name}
                </li>
              ))
            ) : (
              <li className={styles.developerItem}>No developers assigned</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
