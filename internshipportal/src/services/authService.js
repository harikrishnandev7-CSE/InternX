import api from "../api/api";

// Student Registration
export const registerStudent = (studentData) => {
  return api.post("/student/register", studentData);
};

// Student Login
export const loginStudent = (loginData) => {
  return api.post("/student/login", loginData);
};

// Student Profile
export const getStudentProfile = () => {
  return api.get("/student/profile");
};

// Change Password
export const changePassword = (passwordData) => {
  return api.put("/student/change-password", passwordData);
};

// updating student data
export const updateStudentProfile = (studentData) => {
  return api.put("/student/profile", studentData);
};

// Get Student Skills
export const getStudentSkills = () => {
  return api.get("/student/skills");
};

// Add Student Skill
export const addStudentSkill = (skillData) => {
  return api.post("/student/skills", skillData);
};

// Delete Student Skill
export const deleteStudentSkill = (skillId) => {
  return api.delete(`/student/skills/${skillId}`);
};

// Company Registration
export const registerCompany = (companyData) => {
  return api.post("/company/register", companyData);
};

// Company Login
export const loginCompany = (loginData) => {
  return api.post("/company/login", loginData);
};

// Company Profile
export const getCompanyProfile = () => {
  return api.get("/company/profile");
};