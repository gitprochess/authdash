import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient } from "npm:mongodb@6.3.0";

const MONGODB_URI = "mongodb://adminUser:StrongPassw0rd!@34.93.8.67:27017/admin";

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
  isVerified: boolean;
  deploymentLimit?: number;
  activeDeployments?: number;
  deployments?: string[];
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

    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "Invalid token: no email found" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { projectName } = await req.json();

    if (!projectName) {
      return new Response(
        JSON.stringify({ error: "Project name is required" }),
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
      const usersCollection = db.collection<UserDocument>("users");

      const user = await usersCollection.findOne({ email: userEmail });

      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const deploymentLimit = user.deploymentLimit || 1;
      const activeDeployments = user.activeDeployments || 0;
      const deployments = user.deployments || [];

      if (activeDeployments >= deploymentLimit) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "🚫 Deployment limit reached. Please upgrade your plan to deploy more applications.",
            activeDeployments,
            deploymentLimit,
          }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const updatedDeployments = deployments.includes(projectName)
        ? deployments
        : [...deployments, projectName];

      await usersCollection.updateOne(
        { email: userEmail },
        {
          $set: {
            activeDeployments: activeDeployments + 1,
            deployments: updatedDeployments,
          },
        }
      );

      const data = {
        success: true,
        message: "Deployment recorded",
        activeDeployments: activeDeployments + 1,
        deploymentLimit,
      };

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error incrementing deployment:", error);
    return new Response(
      JSON.stringify({ error: "Failed to record deployment" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});