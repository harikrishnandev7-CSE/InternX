import api from "../api/api";

// Upload Student Resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/student/upload-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Fetch Student Resume Metadata
export const getResume = async () => {
  const response = await api.get("/student/resume");
  return response.data;
};

// Delete Student Resume
export const deleteResume = async () => {
  const response = await api.delete("/student/resume");
  return response.data;
};
