# API Architecture Documentation

This document explains the API structure and how different features use different backend services.

## Two Separate API Systems

### 1. Existing DeploidX API (External)
**Base URL:** `https://auth.deploidx.com/api`

**Used For:**
- User Authentication (Login/Signup)
- OTP Verification
- SSH Server Management
- Container Management
- Database Management

**Endpoints:**
```
POST /auth/signup          - User registration
POST /auth/login           - User login
POST /auth/verify-otp      - OTP verification
GET  /ssh/all              - Get all SSH servers
POST /ssh/add              - Add SSH server
DELETE /ssh/delete/:id     - Delete SSH server
POST /containers/create    - Create container
GET  /containers/all       - Get all containers
POST /containers/delete    - Delete container
POST /databases/create     - Create MySQL database
GET  /databases/all        - Get all databases
POST /databases/delete     - Delete database
```

**Database API Base URL:** `https://databaseapi.deploidx.com/api`

### 2. Supabase Edge Functions (New Features)
**Base URL:** `${VITE_SUPABASE_URL}/functions/v1`

**Used For:**
- Super Admin Dashboard
- User Management
- Package/Deployment Limit Management

**Edge Functions:**

#### Admin Functions
1. **admin-get-users**
   - **Purpose:** Fetch all users with pagination and search
   - **URL:** `/functions/v1/admin-get-users`
   - **Method:** GET
   - **Authentication:** JWT Token (Admin only)
   - **Query Params:**
     - `page` (number)
     - `limit` (number)
     - `search` (string)

2. **admin-update-user**
   - **Purpose:** Update user deployment limits and verification status
   - **URL:** `/functions/v1/admin-update-user`
   - **Method:** POST
   - **Authentication:** JWT Token (Admin only)
   - **Body:**
     ```json
     {
       "userId": "string",
       "deploymentLimit": number,
       "activeDeployments": number,
       "isVerified": boolean
     }
     ```

#### Package Management Functions
3. **packages-get-all**
   - **Purpose:** Fetch all packages
   - **URL:** `/functions/v1/packages-get-all`
   - **Method:** GET
   - **Authentication:** JWT Token (Admin only)

4. **packages-create**
   - **Purpose:** Create a new package
   - **URL:** `/functions/v1/packages-create`
   - **Method:** POST
   - **Authentication:** JWT Token (Admin only)
   - **Body:**
     ```json
     {
       "name": "string",
       "deploymentLimit": number,
       "price": number,
       "features": ["string"],
       "isActive": boolean
     }
     ```

5. **packages-update**
   - **Purpose:** Update an existing package
   - **URL:** `/functions/v1/packages-update`
   - **Method:** POST
   - **Authentication:** JWT Token (Admin only)
   - **Body:**
     ```json
     {
       "packageId": "string",
       "name": "string",
       "deploymentLimit": number,
       "price": number,
       "features": ["string"],
       "isActive": boolean
     }
     ```

6. **packages-delete**
   - **Purpose:** Delete a package
   - **URL:** `/functions/v1/packages-delete`
   - **Method:** POST
   - **Authentication:** JWT Token (Admin only)
   - **Body:**
     ```json
     {
       "packageId": "string"
     }
     ```

#### Deployment Limit Functions
7. **check-deployment-limit**
   - **Purpose:** Check if user can create new deployment
   - **URL:** `/functions/v1/check-deployment-limit`
   - **Method:** GET
   - **Authentication:** JWT Token

8. **increment-deployment**
   - **Purpose:** Increment user's active deployment count
   - **URL:** `/functions/v1/increment-deployment`
   - **Method:** POST
   - **Authentication:** JWT Token
   - **Body:**
     ```json
     {
       "projectName": "string"
     }
     ```

9. **decrement-deployment**
   - **Purpose:** Decrement user's active deployment count
   - **URL:** `/functions/v1/decrement-deployment`
   - **Method:** POST
   - **Authentication:** JWT Token
   - **Body:**
     ```json
     {
       "projectName": "string"
     }
     ```

10. **deployment-info**
    - **Purpose:** Get user's deployment information
    - **URL:** `/functions/v1/deployment-info`
    - **Method:** GET
    - **Authentication:** JWT Token

## Service Files

### `/src/services/api.ts`
Contains all API calls to the **DeploidX external API**:
- `authApi` - Authentication endpoints
- `sshApi` - SSH server management
- `containerApi` - Container management
- `databaseApi` - Database management

### `/src/services/admin.ts`
Contains all API calls to the **Supabase Edge Functions** for admin features:
- `adminService.getAllUsers()` - Fetch all users
- `adminService.updateUser()` - Update user package/limits

### `/src/services/packages.ts`
Contains all API calls to the **Supabase Edge Functions** for package management:
- `packagesService.getAllPackages()` - Fetch all packages
- `packagesService.createPackage()` - Create new package
- `packagesService.updatePackage()` - Update existing package
- `packagesService.deletePackage()` - Delete package

## Environment Variables Required

```env
# Supabase Configuration (for new Edge Functions)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The DeploidX API URLs are hardcoded in the service files since they're external.

## Authentication Flow

1. **User Login/Signup** → DeploidX API
2. **JWT Token received** → Used for both APIs
3. **Admin Features** → Supabase Edge Functions (validate admin email)
4. **Regular Features** → DeploidX API

## Admin Access Control

**Admin Emails:**
- n4nikhilkana@gmail.com
- admin@cyaphire.com

These emails have access to:
- Super Admin Dashboard
- User Management Panel
- Package Assignment Interface
- Deployment Limit Controls

## Database

**MongoDB** is used for storing application data:
- Connection: `mongodb://adminUser:StrongPassw0rd!@34.93.8.67:27017/admin`
- Database: `admin`
- Collections:
  - `users` - User accounts and deployment information
  - `packages` - Deployment packages with pricing and limits

## Summary

- **Existing features** (auth, SSH, containers, databases) → DeploidX API
- **New admin features** (user management, packages) → Supabase Edge Functions
- Both use the same JWT token from login
- Clear separation of concerns for maintainability
