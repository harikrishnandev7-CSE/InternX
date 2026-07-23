import api from "../api/api";

// Admin Login
export const loginAdmin = (loginData) => {
  return api.post("/admin/login", loginData);
};

// Admin Profile
export const getAdminProfile = () => {
  return api.get("/admin/profile");
};

// Update Admin Profile
export const updateAdminProfile = (profileData) => {
  return api.put("/admin/profile", profileData);
};

// Change Password
export const changeAdminPassword = (passwordData) => {
  return api.put("/admin/change-password", passwordData);
};

// Get Dashboard Stats
export const getAdminStats = () => {
  return api.get("/admin/dashboard/stats");
};

// Get Recent Activity
export const getAdminRecentActivity = () => {
  return api.get("/admin/dashboard/recent-activity");
};

// Get Activity Logs
export const getAdminLogs = () => {
  return api.get("/admin/activity-logs");
};

// Get Analytics
export const getAdminAnalytics = () => {
  return api.get("/admin/analytics");
};

// Manage Students
export const getAdminStudents = (search = "", page = 1, limit = 10) => {
  let url = `/admin/students?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return api.get(url);
};

export const deleteStudent = (studentId) => {
  return api.delete(`/admin/students/${studentId}`);
};

// Manage Companies
export const getAdminCompanies = (search = "", approvalStatus = "", page = 1, limit = 10) => {
  let url = `/admin/companies?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (approvalStatus) url += `&approval_status=${encodeURIComponent(approvalStatus)}`;
  return api.get(url);
};

export const updateCompanyStatus = (companyId, status) => {
  return api.put(`/admin/companies/${companyId}/status?status=${encodeURIComponent(status)}`);
};

export const toggleCompanyActive = (companyId, isActive) => {
  return api.put(`/admin/companies/${companyId}/active?is_active=${isActive}`);
};

export const deleteCompany = (companyId) => {
  return api.delete(`/admin/companies/${companyId}`);
};

// Manage Internships
export const getAdminInternships = (search = "", isActive = null, page = 1, limit = 10) => {
  let url = `/admin/internships?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (isActive !== null) url += `&is_active=${isActive}`;
  return api.get(url);
};

export const toggleInternshipActive = (internshipId, isActive) => {
  return api.put(`/admin/internships/${internshipId}/active?is_active=${isActive}`);
};

export const deleteInternship = (internshipId) => {
  return api.delete(`/admin/internships/${internshipId}`);
};

// Manage Applications
export const getAdminApplications = (search = "", status = "", page = 1, limit = 10) => {
  let url = `/admin/applications?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  return api.get(url);
};

// Admin delete student resume
export const deleteAdminStudentResume = (studentId) => {
  return api.delete(`/admin/students/${studentId}/resume`);
};

