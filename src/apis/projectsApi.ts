import { Project, ProjectPayload } from "../types/projectsTypes";
import axiosInstance from "../utils/axiosInstance";

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await axiosInstance.get("/project/getall");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch projects", error);
    throw error;
  }
};

// Fetch project by ID
export const fetchProjectById = async (id: number): Promise<Project> => {
  try {
    const res = await axiosInstance.get(`/project/get/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch project with ID ${id}`, error);
    throw error;
  }
};

// Create a new project
export const createProject = async (
  payload: ProjectPayload
): Promise<Project> => {
  try {
    const res = await axiosInstance.post("/project/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create project", error);
    throw error;
  }
};

// Update a project
export const updateProject = async (
  id: number,
  payload: Partial<ProjectPayload>
): Promise<Project> => {
  try {
    const res = await axiosInstance.patch(`/project/update/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Failed to update project with ID ${id}`, error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete(`/project/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to delete project with ID ${id}`, error);
    throw error;
  }
};

// Bulk upload projects (Excel file)
export const bulkUploadProjects = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post("/project/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Bulk upload failed", error);
    throw error;
  }
};
