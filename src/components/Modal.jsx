import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import ReusableButton from "./Button";
import styles from "./Modal.module.css";

function ReusableModal({ open, handleClose, onSubmit, isEditMode, project }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Reusable request function
  const fetchData = async (url, method = "GET", data = null) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data ? JSON.stringify(data) : null,
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (open) {
      // Fetch all developers for selection
      fetchData(`${process.env.REACT_APP_API_URL}/developers`).then((data) => {
        if (data) setUsers(data);
      });

      // Populate fields in edit mode
      if (isEditMode && project) {
        setName(project.name);
        setDescription(project.description);
        setSelectedUsers(project.developers || []);
      } else {
        setName("");
        setDescription("");
        setSelectedUsers([]);
      }
    }
  }, [open, isEditMode, project]);

  const handleSubmit = () => {
    const projectData = {
      name,
      description,
      developer_ids: selectedUsers.map((user) => user.id),
    };

    const apiUrl = isEditMode
      ? `${process.env.REACT_APP_API_URL}/projects/${project.id}`
      : `${process.env.REACT_APP_API_URL}/projects`;
    const apiMethod = isEditMode ? "PUT" : "POST";

    fetchData(apiUrl, apiMethod, projectData).then(onSubmit);
  };

  const handleUserChange = (event, newValue) => {
    const removedUsers = selectedUsers.filter(
      (user) => !newValue.some((newUser) => newUser.id === user.id)
    );

    setSelectedUsers(newValue);

    removedUsers.forEach((user) => {
      fetchData(
        `${process.env.REACT_APP_API_URL}/project_users/${project.id}/${user.id}`,
        "DELETE"
      ).then(() => {
        // Refetch updated developer list if necessary
        fetchData(`${process.env.REACT_APP_API_URL}/developers`).then((data) => {
          if (data) setUsers(data);
        });
      });
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalContainer}>
        <Typography className={styles.modalHeader}>
          {isEditMode ? "Edit Project" : "Create a Project"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--color-gray-100)", // Apply the input text color here
              },
            }}
            className={styles.modalInput}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            className={styles.modalInput}
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--color-gray-100)", // Apply the input text color here
              },
            }}
          />
          <Autocomplete
  multiple
  options={users}
  getOptionLabel={(option) => option.name}
  value={selectedUsers}
  onChange={handleUserChange}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Assign Developers"
      className={styles.modalInput}
    />
  )}
  renderOption={(props, option, state) => (
    <li
      {...props}
      key={option.id}
      sx={{
        // Custom styles for the option
        backgroundColor: state.selected ? 'rgba(0, 123, 255, 0.1)' : 'transparent', // Optional background color for selected
        color: state.selected ? 'var(--color-gray-100)' : 'inherit', // Change text color of selected option
      }}
    >
      {option.name}
    </li>
  )}
/>

          <Box className={styles.buttonContainer}>
            <ReusableButton
              className={styles.buttonSecondary}
              onClick={handleClose}
            >
              Cancel
            </ReusableButton>
            <ReusableButton
              className={styles.buttonPrimary}
              onClick={handleSubmit}
            >
              {isEditMode ? "Update" : "Submit"}
            </ReusableButton>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ReusableModal;
