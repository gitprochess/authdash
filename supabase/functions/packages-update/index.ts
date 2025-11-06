import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient, ObjectId } from "npm:mongodb@6.3.0";

const MONGODB_URI = "mongodb://adminUser:StrongPassw0rd!@localhost:27017/admin";
const ADMIN_EMAILS = ["n4nikhilkana@gmail.com", "admin@cyaphire.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UpdatePackageRequest {
  packageId: string;
  name?: string;
  deploymentLimit?: number;
  price?: number;
  features?: string[];
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

    const requestData: UpdatePackageRequest = await req.json();

    if (!requestData.packageId) {
      return new Response(
        JSON.stringify({ error: "Package ID is required" }),
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

      const updateFields: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (requestData.name !== undefined) {
        updateFields.name = requestData.name;
      }

      if (requestData.deploymentLimit !== undefined) {
        updateFields.deploymentLimit = requestData.deploymentLimit;
      }

      if (requestData.price !== undefined) {
        updateFields.price = requestData.price;
      }

      if (requestData.features !== undefined) {
        updateFields.features = requestData.features;
      }

      if (requestData.isActive !== undefined) {
        updateFields.isActive = requestData.isActive;
      }

      const result = await packagesCollection.updateOne(
        { _id: new ObjectId(requestData.packageId) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return new Response(
          JSON.stringify({ error: "Package not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const updatedPackage = await packagesCollection.findOne({
        _id: new ObjectId(requestData.packageId),
      });

      const data = {
        success: true,
        message: "Package updated successfully",
        package: {
          id: updatedPackage?._id?.toString(),
          name: updatedPackage?.name,
          deploymentLimit: updatedPackage?.deploymentLimit,
          price: updatedPackage?.price,
          features: updatedPackage?.features || [],
          isActive: updatedPackage?.isActive,
          createdAt: updatedPackage?.createdAt,
          updatedAt: updatedPackage?.updatedAt,
        },
      };

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error updating package:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update package" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
