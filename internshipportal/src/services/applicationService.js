import api from "../api/api";

// Apply Internship
export const applyInternship = async (internshipId) => {
  const response = await api.post("/application/apply", {
    internship_id: internshipId,
  });

  return response.data;
};

// Get Current Student Applications
export const getStudentApplications = async () => {
  const response = await api.get("/application/student");

  return response.data;
};

// Get Company Applications
export const getCompanyApplications = async () => {
  const response = await api.get("/application/company");
  return response.data;
};

// Update Application Status
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/application/${applicationId}/status`, {
    status,
  });
  return response.data;
};

// Get Company Application Stats
export const getCompanyStats = async () => {
  const response = await api.get("/application/company/stats");
  return response.data;
};

// Get Company Dashboard Stats
export const getCompanyDashboardStats = async () => {
  const response = await api.get("/company/dashboard/stats");
  return response.data;
};
