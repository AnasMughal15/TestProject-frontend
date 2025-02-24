import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProjectDetailsCard from "../components/ProjectDetailsCard";
import ReusableButton from "../components/Button";
import BugCard from "../components/BugCard";
import BugModal from "../components/BugModal"; // Import the Bug Modal
import styles from './ProjectDetails.module.css';
import { isQA } from "../util/auth";

function ProjectDetailsPage() {
  const [bugs, setBugs] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBug, setCurrentBug] = useState(null);
  const location = useLocation();
  const project = location.state;
  const userIsQA = isQA();
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalBugs: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [modalError, setModalError] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);




  const fetchBugs = (page = 1, perPage = 5, search = "") => {
    if (project) {
      const token = localStorage.getItem("token");
      const url = `${process.env.REACT_APP_API_URL}/projects/${project.id}/bugs?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`;
  
      fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setBugs(data.bugs); 
          setPagination({ 
            totalPages: data.total_pages,
            currentPage: data.current_page,
            totalBugs: data.total_bugs,
          });
        })
        .catch((error) => console.error("Error fetching bugs:", error));
    }
  };
  
  useEffect(() => {
    fetchBugs();
  }, [project]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBugs(1, 5, searchTerm); 
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    const timeout = setTimeout(() => {
      fetchBugs(1, 5, e.target.value); 
    }, 300);
  
    setDebounceTimeout(timeout);
  };
  

  const goToPage = (page) => {
    fetchBugs(page, 5, searchTerm); // Fetch selected page
  };


  const handleCreateBug = () => {
    setIsEditMode(false)
    setCurrentBug(null); // No current bug for creation
    setModalOpen(true);
  };

  const handleEditBug = (bugId) => {
    setIsEditMode(true)
    const bugToEdit = bugs.find((bug) => bug.id === bugId);
    setCurrentBug(bugToEdit);
    setModalOpen(true);
  };


  const handleSaveBug = (bugData, bugId) => {
    const method = (isEditMode || bugId) ? "PUT" : "POST";
    const url = (isEditMode || bugId)
      ? `${process.env.REACT_APP_API_URL}/projects/${project.id}/bugs/${bugId}`
      : `${process.env.REACT_APP_API_URL}/projects/${project.id}/bugs`;
  
    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // Do not set Content-Type; FormData will handle it automatically
      },
      body: bugData // This will be the FormData object
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.errors || "Failed to save bug");
            
          });
        }
        return response.json();
      })
      .then(() => {
        fetchBugs(); // Re-fetch bugs after successful save
        setModalOpen(false); // Close modal only on success
        setModalError(""); // Clear any previous error
      })
      .catch((error) => {
        setModalError(error.message); // Set the error message and keep modal open
      });
  };
  
  

  const handleDeleteBug = (bugId) => {
    fetch(`${process.env.REACT_APP_API_URL}/projects/${project.id}/bugs/${bugId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Bug deleted successfully");
          fetchBugs();
        } else {
          console.error("Failed to delete bug");
        }
      })
      .catch((error) => console.error("Error deleting bug:", error));
  };

  return (
    <>
      <ProjectDetailsCard project={project} />
      <div className={styles.bugSection}>
        {userIsQA && (
          <ReusableButton onClick={handleCreateBug}>Create Bug</ReusableButton>
        )}
        <form onSubmit={handleSearch} className={styles.search}>
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchTerm}
            onChange={handleSearchChange} // Call the search handler with debounce
          />
          <ReusableButton type="submit" onClick={handleSearch}>
            Search
          </ReusableButton>
        </form>

        {bugs.length > 0 ?  bugs.map((bug) => (
          <BugCard
            key={bug.id}
            bug={bug}
            onEdit={() => handleEditBug(bug.id)}
            onDelete={() => handleDeleteBug(bug.id)}
            isEditMode={isEditMode}
            statusChange={handleSaveBug}
          />
        )) 
          : <div className={styles.noBugs}>
            <p>No bugs Found</p>
          </div>

         }
      </div>

      <BugModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        bug={currentBug}
        onSave={handleSaveBug}
        projectId={project.id}
        error={modalError}
      />

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

export default ProjectDetailsPage;
