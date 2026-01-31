import apiClient, { getApiErrorMessage } from './client';
import type { Child } from '@/features/kids/types/kids.types';

export interface CreateChildData {
  firstName: string;
  lastName: string;
  nickname?: string;
  photo?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodType?: string;
  allergies?: string[];
  medicalConditions?: string[];
}

export interface ApiChild {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  photo?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies: string[];
  medicalConditions: string[];
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

// Transform API response to frontend Child type
function mapApiChild(apiChild: ApiChild): Child {
  return {
    id: apiChild.id,
    householdId: apiChild.householdId,
    firstName: apiChild.firstName,
    lastName: apiChild.lastName,
    nickname: apiChild.nickname,
    photo: apiChild.photo,
    dateOfBirth: apiChild.dateOfBirth?.split('T')[0] || '',
    gender: apiChild.gender as Child['gender'],
    bloodType: apiChild.bloodType,
    allergies: apiChild.allergies,
    medicalConditions: apiChild.medicalConditions,
    createdAt: apiChild.createdAt,
    updatedAt: apiChild.updatedAt,
  };
}

export const kidsApi = {
  async createChild(data: CreateChildData): Promise<Child> {
    try {
      const response = await apiClient.post<ApiChild>('/kids', data);
      return mapApiChild(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getChildren(): Promise<Child[]> {
    try {
      const response = await apiClient.get<ApiChild[]>('/kids');
      return response.data.map(mapApiChild);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getChild(id: string): Promise<Child> {
    try {
      const response = await apiClient.get<ApiChild>(`/kids/${id}`);
      return mapApiChild(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async updateChild(id: string, data: Partial<CreateChildData>): Promise<Child> {
    try {
      const response = await apiClient.patch<ApiChild>(`/kids/${id}`, data);
      return mapApiChild(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  async deleteChild(id: string): Promise<void> {
    try {
      await apiClient.delete(`/kids/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default kidsApi;
