// import { redirect } from "react-router-dom";
// import CreateButton from "../components/Button";
// import OutlinedCard from "../components/ProductCard";

// function HomePage(){
//     return (
//         <>
//         <CreateButton />
//         <OutlinedCard />
//         <OutlinedCard />
//         <OutlinedCard />
//         <OutlinedCard />
//         </>
//     )
// }
// export default HomePage;

// pages/HomePage.js
import React, { useState, useEffect } from "react";
import OutlinedCard from "../components/ProductCard";
import ReusableButton from "../components/Button";
import ReusableModal from "../components/Modal";
import "./Home.module.css";
import { isManager } from "../util/auth";

function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

 const userIsManager = isManager();
 
  const handleOpenModal = () => {
    setIsEditMode(false)
  
    setModalOpen(true);
  };
  const handleOpenModalEdit = (project) => {
    setIsEditMode(true)
    setCurrentProject(project)
    setModalOpen(true);
  };  
  // useEffect(() => {
  //   console.log("isEditMode updated:", isEditMode);
  // }, [isEditMode]);
  const handleCloseModal = () => setModalOpen(false);

  // Make the GET request to fetch the projects list
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data); // Store projects in state
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      console.log(`Project ${projectId} deleted`);
        // setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleModalSubmit = () => {
    
    setModalOpen(false);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      { userIsManager &&  <ReusableButton className="buttonCreate" onClick={handleOpenModal}>
        Create a Project
      </ReusableButton>}

      {/* Dynamically render OutlinedCard components */}
      {projects.length > 0 ? (
        projects.map((project) => (
          <OutlinedCard
            key={project.id}
            index={project.id}
            name={project.name}
            description={project.description}
            manager_id={project.manager_id}
            onDelete={() => handleDelete(project.id)}
            onEdit={() => handleOpenModalEdit(project)}
            userIsManager={userIsManager}
          />
        ))
      ) : (
        <p>No projects available</p> // Display a message if no projects are found
      )}

      <ReusableModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        isEditMode={isEditMode}
        project={currentProject}
      />
    </>
  );
}

export default HomePage;
