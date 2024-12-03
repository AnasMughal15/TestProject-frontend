// import * as React from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
//   >
//     •
//   </Box>
// );



// export default function OutlinedCard({index, name, description, manager_name, onDelete, onEdit, userIsManager }) {

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#242424",
//       }}
//     >
//       <Card
//         variant="outlined"
//         sx={{
//           backgroundColor: "#333333", 
//           borderColor: "#444444", 
//           color: "white", 
//           position: "relative", 
//           maxWidth: 600,
//           width: "100%",
//           margin: 2, 
//         }}
//       >
//         <CardContent>
//           <Typography variant="h5" component="div" sx={{ color: "white" }}>
//             {name}
//           </Typography>
//           <Typography gutterBottom sx={{ color: "gray", fontSize: 14 }}>
//             {manager_name}
//           </Typography>
//           <Typography variant="body2" sx={{ color: "lightgray" }}>
//             {description}
//             <br />
//             {'"a benevolent smile"'}
//           </Typography>
//         </CardContent>

//         <CardActions
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: 1, // Adds space between buttons
//             padding: 2, // Adds space inside the CardActions for the buttons
//             position: "absolute",
//             bottom: 0,
//             right: 0,
//           }}
//         >
//           <Button
//             size="small"
//             sx={{ color: "#FAB833", border: "1px solid #FAB833" }}
//           >
//             Show
//           </Button>
//          { userIsManager && <Button
//             size="small"
//             sx={{ color: "#FAB833", border: "1px solid #FAB833" }}
//             onClick={onEdit}
//           >
//             Edit
//           </Button>}
//          { userIsManager && <Button 
//             size="small"
//             sx={{ color: "#FAB833", border: "1px solid #FAB833" }}
//             onClick={onDelete}
//           > 
//             Delete
//           </Button>}
//         </CardActions>
//       </Card>
//     </Box>
//   );
// }
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from './ProductCard.module.css';

export default function OutlinedCard({ index, name, description, manager_name, onDelete, onEdit, onShow, userIsManager }) {
  return (
    <Box className={styles.cardContainer}>
      <Card variant="outlined" className={styles.card}>
        <CardContent>
          <Typography variant="h5" component="div" className={styles.cardTitle}>
            {name}
          </Typography>
          <Typography gutterBottom className={styles.managerName}>
            {manager_name}
          </Typography>
          <Typography variant="body2" className={styles.cardDescription}>
            {description}
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>

        <CardActions className={styles.cardActions}>
          <Button size="small" className={styles.button} onClick={onShow} >
            Show
          </Button>
          {userIsManager && (
            <Button size="small" className={styles.button} onClick={onEdit}>
              Edit
            </Button>
          )}
          {userIsManager && (
            <Button size="small" className={styles.button} onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
