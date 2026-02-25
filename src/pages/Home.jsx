import React, { useState, useEffect } from "react";
import OutlinedCard from "../components/ProductCard";
import ReusableButton from "../components/Button";
import ReusableModal from "../components/Modal";
import styles from "./Home.module.css";
import { isManager } from "../util/auth";
import t from "../locales/en.json";
import { Navigate, useNavigate } from "react-router-dom";

function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalProjects: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const userIsManager = isManager();

  
  const handleOpenModal = () => {
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleOpenModalEdit = (project) => {
    setIsEditMode(true);
    setCurrentProject(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleShow = (project) => {
    navigate(`/project/${project.name}`, { state: project });
  };

  
  const fetchProjects = async (page = 1, perPage = 5, search = "") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/projects?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects); // Store projects in state
      setPagination({
        totalPages: data.pagination.total_pages,
        currentPage: data.pagination.current_page,
        totalProjects: data.pagination.total_projects,
      });
      
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}`,
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
      fetchProjects(pagination.currentPage); // Refresh projects after deletion
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleModalSubmit = () => {
    setModalOpen(false);
    fetchProjects(pagination.currentPage); // Refresh the projects after submit
  };

  // Handle search input change and debounce
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(1, 5, searchTerm);
    }, 250); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // useEffect(() => {
  //   fetchProjects(); // Fetch projects on component mount
  // }, []);

  const goToPage = (page) => {
    fetchProjects(page, 5, searchTerm);
  };

  return (
    <>
      {userIsManager && (
        <ReusableButton className={styles.buttonCreate} onClick={handleOpenModal}>
          {t.home.btn_createProject}
        </ReusableButton>
      )}

      <form onSubmit={(e) => e.preventDefault()} className={styles.search}>
        <input
          type="text"
          placeholder={t.home.placeholder_search}
          value={searchTerm}
          onChange={handleSearch}
        />
      </form>

     
      {true ? (
        projects.map((project) => (
          <OutlinedCard
            key={project.id}
            index={project.id}
            name={project.name}
            description={project.description}
            manager_name={project.manager_name}
            onDelete={() => handleDelete(project.id)}
            onEdit={() => handleOpenModalEdit(project)}
            onShow={() => handleShow(project)}
            userIsManager={userIsManager}
          />
        ))
      ) : (
        <p>{t.home.no_projects}</p>
      )}

     
      {/* Modal */}
      <ReusableModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        isEditMode={isEditMode}
        project={currentProject}
      />
       {/* Pagination */}
       <div className={styles.pagination}>
        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={pagination.currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </>
  );
}

export default HomePage;
