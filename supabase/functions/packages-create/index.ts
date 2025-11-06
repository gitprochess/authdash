import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient } from "npm:mongodb@6.3.0";

const MONGODB_URI = "mongodb://adminUser:StrongPassw0rd!@localhost:27017/admin";
const ADMIN_EMAILS = ["n4nikhilkana@gmail.com", "admin@cyaphire.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreatePackageRequest {
  name: string;
  deploymentLimit: number;
  price: number;
  features: string[];
  isActive?: boolean;
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

    const requestData: CreatePackageRequest = await req.json();

    if (!requestData.name || !requestData.deploymentLimit || requestData.price === undefined) {
      return new Response(
        JSON.stringify({ error: "Name, deploymentLimit, and price are required" }),
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
      const packagesCollection = db.collection("packages");

      const existingPackage = await packagesCollection.findOne({
        name: requestData.name,
      });

      if (existingPackage) {
        return new Response(
          JSON.stringify({ error: "Package with this name already exists" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const newPackage = {
        name: requestData.name,
        deploymentLimit: requestData.deploymentLimit,
        price: requestData.price,
        features: requestData.features || [],
        isActive: requestData.isActive !== undefined ? requestData.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await packagesCollection.insertOne(newPackage);

      const data = {
        success: true,
        message: "Package created successfully",
        package: {
          id: result.insertedId.toString(),
          ...newPackage,
        },
      };

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error creating package:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create package" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
