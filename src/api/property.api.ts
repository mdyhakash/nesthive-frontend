import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface PropertyFilterParams {
  searchTerm?: string;
  city?: string;
  area?: string;
  type?: "APARTMENT" | "FAMILY_HOUSE" | "HOSTEL" | "SUBLET";
  minRent?: number;
  maxRent?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  address: string;
  city: string;
  area: string;
  type: "APARTMENT" | "FAMILY_HOUSE" | "HOSTEL" | "SUBLET";
  amenities?: string[];
  images?: string[];
}

export interface PropertyItem {
  id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  area: string;
  type: "APARTMENT" | "FAMILY_HOUSE" | "HOSTEL" | "SUBLET";
  amenities?: string[];
  images?: string[];
  isPublished?: boolean;
  ownerId: string;
  managerId?: string | null;
  rooms?: any[];
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  manager?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const propertyApi = {
  getAllProperties: async (params?: PropertyFilterParams): Promise<ApiResponse<PropertyItem[]>> => {
    const res = await apiClient.get<ApiResponse<PropertyItem[]>>("/property", { params });
    return res.data;
  },

  getPropertyById: async (id: string): Promise<ApiResponse<PropertyItem>> => {
    const res = await apiClient.get<ApiResponse<PropertyItem>>(`/property/${id}`);
    return res.data;
  },

  getMyProperties: async (params?: PropertyFilterParams): Promise<ApiResponse<PropertyItem[]>> => {
    const res = await apiClient.get<ApiResponse<PropertyItem[]>>("/property/my-properties", { params });
    return res.data;
  },

  getAssignedPropertiesForManager: async (): Promise<ApiResponse<PropertyItem[]>> => {
    const res = await apiClient.get<ApiResponse<PropertyItem[]>>("/property/assigned/my-properties");
    return res.data;
  },

  createProperty: async (data: CreatePropertyPayload): Promise<ApiResponse<PropertyItem>> => {
    const res = await apiClient.post<ApiResponse<PropertyItem>>("/property/create-property", data);
    return res.data;
  },

  updateProperty: async (id: string, data: Partial<CreatePropertyPayload>): Promise<ApiResponse<PropertyItem>> => {
    const res = await apiClient.patch<ApiResponse<PropertyItem>>(`/property/${id}`, data);
    return res.data;
  },

  publishProperty: async (id: string): Promise<ApiResponse<PropertyItem>> => {
    const res = await apiClient.patch<ApiResponse<PropertyItem>>(`/property/${id}/publish`);
    return res.data;
  },

  assignManager: async (id: string, managerId: string): Promise<ApiResponse<PropertyItem>> => {
    const res = await apiClient.patch<ApiResponse<PropertyItem>>(`/property/${id}/assign-manager`, { managerId });
    return res.data;
  },

  deleteProperty: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/property/${id}`);
    return res.data;
  },
};
