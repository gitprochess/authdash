# Deployment Limits - Backend Implementation Guide

This document outlines the backend changes needed to support the deployment package management feature.

## MongoDB Schema Changes

### Update User Schema

Add the following fields to your users collection:

```javascript
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "$2b$10$...", // hashed
  "isVerified": true,
  "deploymentLimit": 3,      // NEW: Maximum allowed deployments (default: 1)
  "activeDeployments": 0,    // NEW: Current active deployment count
  "deployments": [],         // NEW: Array of active deployment project names
  "__v": 0
}
```

### Default Values

- `deploymentLimit`: Default to `1` for free tier users
- `activeDeployments`: Default to `0`
- `deployments`: Default to `[]`

## Required Backend API Endpoints

### 1. Get User Deployment Info
**Endpoint:** `GET /api/user/deployment-info`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Response:**
```json
{
  "email": "user@example.com",
  "deploymentLimit": 3,
  "activeDeployments": 2,
  "canDeploy": true
}
```

### 2. Check Deployment Limit
**Endpoint:** `GET /api/user/check-deployment-limit`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Response:**
```json
{
  "allowed": false,
  "message": "Deployment limit reached. Please upgrade your plan.",
  "limit": 3,
  "current": 3
}
```

**Logic:**
- Return `allowed: true` if `activeDeployments < deploymentLimit`
- Return `allowed: false` if `activeDeployments >= deploymentLimit`

### 3. Increment Deployment Count
**Endpoint:** `POST /api/user/increment-deployment`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "projectName": "project-a93191"
}
```

**Logic:**
1. Verify user hasn't reached their limit
2. If allowed:
   - Increment `activeDeployments` by 1
   - Add `projectName` to `deployments` array
   - Return success
3. If not allowed:
   - Return error with status 403

**Response (Success):**
```json
{
  "success": true,
  "message": "Deployment recorded",
  "activeDeployments": 3,
  "deploymentLimit": 3
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "🚫 Deployment limit reached. Please upgrade your plan to deploy more applications.",
  "activeDeployments": 3,
  "deploymentLimit": 3
}
```

### 4. Decrement Deployment Count
**Endpoint:** `POST /api/user/decrement-deployment`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "projectName": "project-a93191"
}
```

**Logic:**
1. Decrement `activeDeployments` by 1 (ensure it doesn't go below 0)
2. Remove `projectName` from `deployments` array
3. Return success

**Response:**
```json
{
  "success": true,
  "message": "Deployment count updated",
  "activeDeployments": 2,
  "deploymentLimit": 3
}
```

## Backend Implementation Example (Node.js/Express)

```javascript
// MongoDB User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,
  deploymentLimit: { type: Number, default: 1 },
  activeDeployments: { type: Number, default: 0 },
  deployments: { type: [String], default: [] }
});

// Check Deployment Limit Endpoint
app.get('/api/user/check-deployment-limit', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const allowed = user.activeDeployments < user.deploymentLimit;
    const message = allowed
      ? 'Deployment allowed'
      : '🚫 Deployment limit reached. Please upgrade your plan to deploy more applications.';

    res.json({
      allowed,
      message,
      limit: user.deploymentLimit,
      current: user.activeDeployments
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check deployment limit' });
  }
});

// Increment Deployment Count Endpoint
app.post('/api/user/increment-deployment', authenticateToken, async (req, res) => {
  try {
    const { projectName } = req.body;
    const user = await User.findOne({ email: req.user.email });

    // Check if limit reached
    if (user.activeDeployments >= user.deploymentLimit) {
      return res.status(403).json({
        success: false,
        message: '🚫 Deployment limit reached. Please upgrade your plan to deploy more applications.',
        activeDeployments: user.activeDeployments,
        deploymentLimit: user.deploymentLimit
      });
    }

    // Increment count and add to deployments array
    user.activeDeployments += 1;
    if (!user.deployments.includes(projectName)) {
      user.deployments.push(projectName);
    }
    await user.save();

    res.json({
      success: true,
      message: 'Deployment recorded',
      activeDeployments: user.activeDeployments,
      deploymentLimit: user.deploymentLimit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record deployment' });
  }
});

// Decrement Deployment Count Endpoint
app.post('/api/user/decrement-deployment', authenticateToken, async (req, res) => {
  try {
    const { projectName } = req.body;
    const user = await User.findOne({ email: req.user.email });

    // Decrement count (don't go below 0)
    user.activeDeployments = Math.max(0, user.activeDeployments - 1);

    // Remove from deployments array
    user.deployments = user.deployments.filter(d => d !== projectName);
    await user.save();

    res.json({
      success: true,
      message: 'Deployment count updated',
      activeDeployments: user.activeDeployments,
      deploymentLimit: user.deploymentLimit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deployment count' });
  }
});

// Get Deployment Info Endpoint
app.get('/api/user/deployment-info', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    res.json({
      email: user.email,
      deploymentLimit: user.deploymentLimit,
      activeDeployments: user.activeDeployments,
      canDeploy: user.activeDeployments < user.deploymentLimit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deployment info' });
  }
});
```

## Migration Script

Run this script to add default values to existing users:

```javascript
// migration.js
const mongoose = require('mongoose');

async function migrateUsers() {
  await mongoose.connect('mongodb://adminUser:StrongPassw0rd!@34.93.8.67:27017/admin');

  const User = mongoose.model('User', userSchema);

  // Update all existing users
  await User.updateMany(
    { deploymentLimit: { $exists: false } },
    {
      $set: {
        deploymentLimit: 1,
        activeDeployments: 0,
        deployments: []
      }
    }
  );

  console.log('Migration completed!');
  await mongoose.disconnect();
}

migrateUsers();
```

## Testing

1. Create a test user with `deploymentLimit: 1`
2. Try to deploy a project - should succeed
3. Try to deploy another project - should be blocked with limit message
4. Stop the first container - deployment count should decrement
5. Try to deploy again - should now succeed

## Upgrade Plans

You can offer different deployment limits for different tiers:

- **Free Tier**: `deploymentLimit: 1`
- **Pro Tier**: `deploymentLimit: 3`
- **Enterprise Tier**: `deploymentLimit: 10` or unlimited

## Notes

- The frontend will automatically check limits before allowing deployments
- When a user stops/kills a container, the count is automatically decremented
- The DeploymentLimitBanner shows real-time usage with a progress bar
- The AI chat will warn users if they try to deploy when at their limit
