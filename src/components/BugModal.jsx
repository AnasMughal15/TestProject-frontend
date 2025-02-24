// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ReusableButton from "../components/Button";
// import styles from './BugModal.module.css';

// const BugModal = ({ projectId, isOpen, onClose, bug = '', onSave, isEditMode, error }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [bugType, setBugType] = useState("bug");
//   const [status, setStatus] = useState("new");
//   const [assigneeId, setAssigneeId] = useState(null);
//   const [developers, setDevelopers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [images, setImages] = useState([]);  // State to store selected image files
//   const [existingImages, setExistingImages] = useState([]); 
  
// //   const projectId = bug?.project_id;

//   useEffect(() => {
//     if (isOpen && projectId) {
//       fetch(`http://127.0.0.1:3000/projects/${projectId}/developers`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setDevelopers(data.developers || []);  // Ensure developers data is set
//         })
//         .catch((error) => console.error("Error fetching developers:", error));
//     }
  
//     if (bug) {
//       setTitle(bug.title);
//       setDescription(bug.description);
//       setBugType(bug.bug_type);
//       setStatus(bug.status);
//       setAssigneeId(bug.assignee_id);
//       setExistingImages(bug.attachments || []); 
//       console.log(title, description, bugType)
//     } else {
//       setTitle("");
//       setDescription("");
//       setBugType("bug");
//       setStatus("new");
//       setAssigneeId("");  
//       setDevelopers([]);
//       setExistingImages([]); 
//     }
//   }, [isOpen, bug, projectId]);
  
  
//   const logFormData = (formData) => {
//     // Iterate over all entries in the FormData
//     for (let [key, value] of formData.entries()) {
//       console.log(key, value); // Log the key and value
//     }
//   };

//   const handleSave = () => {
//     if (validateForm()) {
//       const bugData = {
//         title,
//         description,
//         bug_type: bugType,
//         status,
//         assignee_id: assigneeId,
//         project_id: projectId,
//       };
//       // const formData = new FormData();
//       // formData.append("title", title);
//       // formData.append("description", description);
//       // console.log("form data",...formData);
//       // console.log(formData.title);
//       console.log(bugData);
      
//       onSave(bugData, bug?.id);
//     }
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     if (!bugType) formErrors.bugType = "Bug type cannot be blank";
//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   return isOpen ? (
//     <div className={styles.bugModal}>
//       <div className={styles.bugModalContent}>
//         <h2 className={styles.bugModalHeader}>{bug ? "Update Bug" : "Create Bug"}</h2>
//         {error && <div className={styles.ErrorMessage}>{error}</div>}
//         <label className={styles.bugModalLabel}>Title:</label>
//         <input
//           type="text"
//           className={styles.bugModalInput}
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <label className={styles.bugModalLabel}>Description:</label>
//         <textarea
//           className={styles.bugModalTextarea}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <div>
//           <label className={styles.bugModalLabel}>Bug Type:</label>
//           <div>
//             <input
//               type="radio"
//               id="bug"
//               className={styles.bugModalRadio}
//               name="bug_type"
//               value="bug"
//               checked={bugType === "bug"}
//               onChange={() => setBugType("bug")}
//             />
//             <label htmlFor="bug">Bug</label>
//             <input
//               type="radio"
//               id="feature"
//               className={styles.bugModalRadio}
//               name="bug_type"
//               value="feature"
//               checked={bugType === "feature"}
//               onChange={() => setBugType("feature")}
//             />
//             <label htmlFor="feature">Feature</label>
//           </div>
//           {errors.bugType && <p className={styles.bugModalError}>{errors.bugType}</p>}
//         </div>
//         <label className={styles.bugModalLabel}>Status:</label>
//         <select 
//           className={styles.bugModalSelect} 
//           value={status} 
//           onChange={(e) => setStatus(e.target.value)}>
//           {bugType === "bug" ? (
//             <>
//               <option value="new">New</option>
//               <option value="started">Started</option>
//               <option value="resolved">Resolved</option>
//             </>
//           ) : (
//             <>
//               <option value="new">New</option>
//               <option value="started">Started</option>
//               <option value="completed">Completed</option>
//             </>
//           )}
//         </select>

//         <label className={styles.bugModalLabel}>Assignee:</label>
//         <select
//           className={styles.bugModalSelect}
//           value={assigneeId}
//           onChange={(e) => setAssigneeId(e.target.value)}
//         >
//           <option value="">Select Assignee</option>
//           {developers.map((dev) => (
//             <option key={dev.id} value={dev.id}>
//               {dev.name}
//             </option>
//           ))}
//         </select>

//         <div className={styles.bugModalButtons}>
//           <ReusableButton onClick={onClose}>Cancel</ReusableButton>
//           <ReusableButton onClick={handleSave}>{bug ? "Update" : "Create"}</ReusableButton>
//         </div>
//       </div>
//     </div>
//   ) : null;
// };

// export default BugModal;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReusableButton from "../components/Button";
import styles from './BugModal.module.css';
import { Preview, Delete } from "@mui/icons-material";

const BugModal = ({ projectId, isOpen, onClose, bug = '', onSave, isEditMode, error }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bugType, setBugType] = useState("bug");
  const [status, setStatus] = useState("new");
  const [assigneeId, setAssigneeId] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);  // State to store selected image files
  const [existingImages, setExistingImages] = useState([]); 

  useEffect(() => {
    if (isOpen && projectId) {
      fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/developers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setDevelopers(data.developers || []);  // Ensure developers data is set
        })
        .catch((error) => console.error("Error fetching developers:", error));
    }
  
    if (bug) {
      setTitle(bug.title);
      setDescription(bug.description);
      setBugType(bug.bug_type);
      setStatus(bug.status);
      setAssigneeId(bug.assignee_id);
      setExistingImages(bug.attachments || []);
      setImages([]) 
    } else {
      setTitle("");
      setDescription("");
      setBugType("bug");
      setStatus("new");
      setAssigneeId("");  
      setDevelopers([]);
      setExistingImages([]);
      setImages([]) 
    }
  }, [isOpen, bug, projectId]);

  const handlePreviewImage = (imgPath) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/attachments/${bug.id}/` +  imgPath.file_name;
    window.open(fileUrl, "_blank");
  };
  
  
  
  const handleRemoveExistingImage = (imgPath) => {
    fetch(`${import.meta.env.VITE_API_URL}/attachments/${imgPath.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ imgPath }),
    })
      .then((response) => response.json())
      .then(() => {
        setExistingImages(existingImages.filter((path) => path !== imgPath));
      })
      .catch((error) => console.error("Error deleting image:", error));
  };
  
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);  // Base64 data
        reader.onerror = reject;
        reader.readAsDataURL(file);  // Convert the file to Base64
      });
    });

    Promise.all(fileReaders)
      .then((base64Images) => {
        setImages(base64Images);  // Store the Base64 images
      })
      .catch((error) => {
        console.error("Error reading file:", error);
      });
  };

  const logFormData = (formData) => {
    for (let [key, value] of formData.entries()) {
      console.log(key, value);  // Log the key and value
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("bug_type", bugType);
      formData.append("status", status);
      formData.append("assignee_id", assigneeId);
      formData.append("project_id", projectId);
  
      // Append Base64 images if any
      images.forEach((base64Image, index) => {
        formData.append("attachments", base64Image);  // Append each Base64-encoded image to FormData
      });
      onSave(formData, bug?.id); // Pass formData instead of the bugData object
    }
  };
  

  const validateForm = () => {
    let formErrors = {};
    if (!bugType) formErrors.bugType = "Bug type cannot be blank";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  return isOpen ? (
    <div className={styles.bugModal}>
      <div className={styles.bugModalContent}>
        <h2 className={styles.bugModalHeader}>
          {bug ? "Update Bug" : "Create Bug"}
        </h2>
        {error && <div className={styles.ErrorMessage}>{error}</div>}
        <label className={styles.bugModalLabel}>Title:</label>
        <input
          type="text"
          className={styles.bugModalInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className={styles.bugModalLabel}>Description:</label>
        <textarea
          className={styles.bugModalTextarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className={styles.bugModalLabel}>Bug Type:</label>
          <div>
            <input
              type="radio"
              id="bug"
              className={styles.bugModalRadio}
              name="bug_type"
              value="bug"
              checked={bugType === "bug"}
              onChange={() => setBugType("bug")}
            />
            <label htmlFor="bug">Bug</label>
            <input
              type="radio"
              id="feature"
              className={styles.bugModalRadio}
              name="bug_type"
              value="feature"
              checked={bugType === "feature"}
              onChange={() => setBugType("feature")}
            />
            <label htmlFor="feature">Feature</label>
          </div>
          {errors.bugType && (
            <p className={styles.bugModalError}>{errors.bugType}</p>
          )}
        </div>
        <label className={styles.bugModalLabel}>Status:</label>
        <select
          className={styles.bugModalSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {bugType === "bug" ? (
            <>
              <option value="new">New</option>
              <option value="started">Started</option>
              <option value="resolved">Resolved</option>
            </>
          ) : (
            <>
              <option value="new">New</option>
              <option value="started">Started</option>
              <option value="completed">Completed</option>
            </>
          )}
        </select>

        <label className={styles.bugModalLabel}>Assignee:</label>
        <select
          className={styles.bugModalSelect}
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Select Assignee</option>
          {developers.map((dev) => (
            <option key={dev.id} value={dev.id}>
              {dev.name}
            </option>
          ))}
        </select>

        {/* {existingImages.length >0 && <div>
          <h3>Existing Attachments:</h3>
          <div className={styles.existingImages}>
            {existingImages.map((imgPath, index) => (
              <div key={index} className={styles.imagePreview}>
                <div className={styles.imageContainer}>
                  <img
                    src={imgPath}
                    alt={`attachment-${index}`}
                    className={styles.imageThumbnail}
                  />
                  <div className={styles.imageActions}>
                    <Preview
                      onClick={() => handlePreviewImage(imgPath)}
                      className={styles.previewIcon}
                    />
                    <Delete
                      onClick={() => handleRemoveExistingImage(imgPath)}
                      className={styles.deleteIcon}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>} */}

        {existingImages.length > 0 && (
          <div>
            <h3>Existing Attachments:</h3>
            <div className={styles.existingImages}>
              {existingImages.map((imgPath, index) => {
                const fileName = imgPath.file_name; // Extract file name from path
                return (
                  <div key={index} className={styles.attachmentItem}>
                    <div className={styles.attachmentName}>{fileName}</div>
                    <div className={styles.attachmentActions}>
                      <Preview
                        onClick={() => handlePreviewImage(imgPath)}
                        className={styles.previewIcon}
                      />
                      <Delete
                        onClick={() => handleRemoveExistingImage(imgPath)}
                        className={styles.deleteIcon}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <label className={styles.bugModalLabel}>Attach Images:</label>
        <input
          type="file"
          className={styles.bugModalInput}
          accept="image/png, image/gif"
          multiple
          onChange={handleImageChange}
        />
        <div className={styles.bugModalButtons}>
          <ReusableButton onClick={onClose}>Cancel</ReusableButton>
          <ReusableButton onClick={handleSave}>
            {bug ? "Update" : "Create"}
          </ReusableButton>
        </div>
      </div>
    </div>
  ) : null;
};

export default BugModal;
