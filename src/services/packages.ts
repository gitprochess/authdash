const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Package {
  id: string;
  name: string;
  deploymentLimit: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePackageData {
  name: string;
  deploymentLimit: number;
  price: number;
  features: string[];
  isActive?: boolean;
}

export interface UpdatePackageData {
  packageId: string;
  name?: string;
  deploymentLimit?: number;
  price?: number;
  features?: string[];
  isActive?: boolean;
}

export const packagesService = {
  getAllPackages: async (token: string): Promise<{ packages: Package[] }> => {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/packages-get-all`,
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
        .catch(() => ({ message: "Failed to fetch packages" }));
      throw new Error(errorData.message || "Failed to fetch packages");
    }

    return response.json();
  },

  createPackage: async (
    token: string,
    packageData: CreatePackageData
  ): Promise<{ success: boolean; message: string; package: Package }> => {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/packages-create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(packageData),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create package" }));
      throw new Error(errorData.message || "Failed to create package");
    }

    return response.json();
  },

  updatePackage: async (
    token: string,
    updateData: UpdatePackageData
  ): Promise<{ success: boolean; message: string; package: Package }> => {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/packages-update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update package" }));
      throw new Error(errorData.message || "Failed to update package");
    }

    return response.json();
  },

  deletePackage: async (
    token: string,
    packageId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/packages-delete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ packageId }),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to delete package" }));
      throw new Error(errorData.message || "Failed to delete package");
    }

    return response.json();
  },
};
