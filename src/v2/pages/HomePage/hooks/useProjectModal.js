// src/pages/Home/hooks/useProjectModal.js

import { useState } from "react";

export default function useProjectModal(refetch) {
  const [isModalOpen, setModalOpen]         = useState(false);
  const [isEditMode, setIsEditMode]         = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const openCreate = () => {
    setIsEditMode(false);
    setCurrentProject(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setIsEditMode(true);
    setCurrentProject(project);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onModalSubmit = () => {
    closeModal();
    refetch();
  };

  return { isModalOpen, isEditMode, currentProject, openCreate, openEdit, closeModal, onModalSubmit };
}