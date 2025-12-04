import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient } from "npm:mongodb@6.3.0";

const MONGODB_URI = "mongodb://adminUser:StrongPassw0rd!@34.93.8.67:27017/admin";
const ADMIN_EMAILS = ["n4nikhilkana@gmail.com", "admin@cyaphire.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserDocument {
  _id?: unknown;
  email: string;
  name: string;
  password: string;
  profession?: string;
  contactNumber?: string;
  isVerified: boolean;
  deploymentLimit?: number;
  activeDeployments?: number;
  deployments?: string[];
  createdAt?: Date;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const payload = atob(token.split('.')[1]);
    const tokenData = JSON.parse(payload);
    const userEmail = tokenData.email;

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Admin access only" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const client = new MongoClient(MONGODB_URI);

    try {
      await client.connect();
      const db = client.db("admin");
      const usersCollection = db.collection<UserDocument>("users");

      const searchFilter = searchQuery
        ? {
            $or: [
              { email: { $regex: searchQuery, $options: "i" } },
              { name: { $regex: searchQuery, $options: "i" } },
            ],
          }
        : {};

      const totalUsers = await usersCollection.countDocuments(searchFilter);

      const users = await usersCollection
        .find(searchFilter, {
          projection: {
            password: 0,
          },
        })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const formattedUsers = users.map((user) => ({
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        profession: user.profession || "",
        contactNumber: user.contactNumber || "",
        isVerified: user.isVerified,
        deploymentLimit: user.deploymentLimit || 1,
        activeDeployments: user.activeDeployments || 0,
        deployments: user.deployments || [],
        createdAt: user.createdAt || new Date(),
      }));

      const data = {
        users: formattedUsers,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
      };

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});