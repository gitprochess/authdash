const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  profession: string;
  contactNumber: string;
  isVerified: boolean;
  deploymentLimit: number;
  activeDeployments: number;
  deployments: string[];
  createdAt: Date;
}

export interface UsersPaginatedResponse {
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminService = {
  getAllUsers: async (
    token: string,
    page: number = 1,
    limit: number = 50,
    search: string = ""
  ): Promise<UsersPaginatedResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/admin-get-users?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch users" }));
      throw new Error(errorData.message || "Failed to fetch users");
    }

    return response.json();
  },

  updateUser: async (
    token: string,
    userId: string,
    updates: {
      deploymentLimit?: number;
      activeDeployments?: number;
      isVerified?: boolean;
    }
  ): Promise<{ success: boolean; message: string; user: AdminUser }> => {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/admin-update-user`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update user" }));
      throw new Error(errorData.message || "Failed to update user");
    }

    return response.json();
  },
};
