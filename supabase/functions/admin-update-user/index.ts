import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient, ObjectId } from "npm:mongodb@6.3.0";

const MONGODB_URI = "mongodb://adminUser:StrongPassw0rd!@34.93.8.67:27017/admin";
const ADMIN_EMAILS = ["n4nikhilkana@gmail.com", "admin@cyaphire.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UpdateUserRequest {
  userId: string;
  deploymentLimit?: number;
  activeDeployments?: number;
  isVerified?: boolean;
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

    const requestData: UpdateUserRequest = await req.json();

    if (!requestData.userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const client = new MongoClient(MONGODB_URI);

    try {
      await client.connect();
      const db = client.db("admin");
      const usersCollection = db.collection("users");

      const updateFields: Record<string, unknown> = {};

      if (requestData.deploymentLimit !== undefined) {
        updateFields.deploymentLimit = requestData.deploymentLimit;
      }

      if (requestData.activeDeployments !== undefined) {
        updateFields.activeDeployments = requestData.activeDeployments;
      }

      if (requestData.isVerified !== undefined) {
        updateFields.isVerified = requestData.isVerified;
      }

      if (Object.keys(updateFields).length === 0) {
        return new Response(
          JSON.stringify({ error: "No fields to update" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(requestData.userId) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const updatedUser = await usersCollection.findOne(
        { _id: new ObjectId(requestData.userId) },
        { projection: { password: 0 } }
      );

      const data = {
        success: true,
        message: "User updated successfully",
        user: {
          id: updatedUser?._id?.toString(),
          email: updatedUser?.email,
          name: updatedUser?.name,
          deploymentLimit: updatedUser?.deploymentLimit || 1,
          activeDeployments: updatedUser?.activeDeployments || 0,
          isVerified: updatedUser?.isVerified,
        },
      };

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});