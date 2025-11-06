import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { MongoClient } from "npm:mongodb@6.3.0";

const MONGODB_URI = "mongodb://adminUser:StrongPassw0rd!@localhost:27017/admin";
const ADMIN_EMAILS = ["n4nikhilkana@gmail.com", "admin@cyaphire.com"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PackageDocument {
  _id?: unknown;
  name: string;
  deploymentLimit: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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

    const client = new MongoClient(MONGODB_URI);

    try {
      await client.connect();
      const db = client.db("admin");
      const packagesCollection = db.collection<PackageDocument>("packages");

      const packages = await packagesCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const formattedPackages = packages.map((pkg) => ({
        id: pkg._id?.toString(),
        name: pkg.name,
        deploymentLimit: pkg.deploymentLimit,
        price: pkg.price,
        features: pkg.features || [],
        isActive: pkg.isActive,
        createdAt: pkg.createdAt || new Date(),
        updatedAt: pkg.updatedAt || new Date(),
      }));

      return new Response(JSON.stringify({ packages: formattedPackages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch packages" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
