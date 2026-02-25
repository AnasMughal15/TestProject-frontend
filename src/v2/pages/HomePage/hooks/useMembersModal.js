// src/pages/Home/hooks/useMembersModal.js

import { useState } from "react";

export default function useMembersModal() {
  const [membersModal, setMembersModal] = useState({
    open: false, title: "", projectName: "", members: [], type: "dev",
  });

  const openMembers = (e, project, type) => {
    e.stopPropagation();
    const members = type === "qa" ? (project.qas ?? []) : (project.developers ?? []);
    setMembersModal({
      open: true,
      title: type === "qa" ? "QA Testers" : "Developers",
      projectName: project.name,
      members,
      type,
    });
  };

  const closeMembers = () => setMembersModal((prev) => ({ ...prev, open: false }));

  return { membersModal, openMembers, closeMembers };
}