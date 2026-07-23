import api from "../api/api";

// Normalizes backend data fields to match what frontend components expect
const normalizeInternship = (internship) => {
  if (!internship) return null;
  return {
    ...internship,
    // Convert comma-separated string to array
    skills: typeof internship.skills === 'string'
      ? internship.skills.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(internship.skills) ? internship.skills : []),
    // Extract nested company attributes
    companyName: internship.company?.company_name || 'InternX Partner',
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    postedDate: internship.created_at
      ? new Date(internship.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Recent',
    // Default applications count (not stored in db yet)
    applications: 0
  };
};

// Create Internship
export const createInternship = async (internshipData) => {
  const response = await api.post("/internship/create", internshipData);
  return normalizeInternship(response.data);
};

// Company Internships
export const getCompanyInternships = async () => {
  const response = await api.get("/internship/company");
  return Array.isArray(response.data) ? response.data.map(normalizeInternship) : [];
};

// Student Internships
export const getAllInternships = async () => {
  const response = await api.get("/internship/all");
  return Array.isArray(response.data) ? response.data.map(normalizeInternship) : [];
};

// Get Single Internship
export const getInternshipById = async (internshipId) => {
  const response = await api.get(`/internship/${internshipId}`);
  return normalizeInternship(response.data);
};

// Update Internship
export const updateInternship = async (internshipId, internshipData) => {
  const response = await api.put(`/internship/${internshipId}`, internshipData);
  return normalizeInternship(response.data);
};

// Delete Internship
export const deleteInternship = async (internshipId) => {
  const response = await api.delete(`/internship/${internshipId}`);
  return response.data;
};

// Toggle Internship Status (Active / Closed)
export const updateInternshipStatus = async (internshipId) => {
  const response = await api.patch(`/internship/${internshipId}/status`);
  return normalizeInternship(response.data);
};