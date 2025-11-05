# MongoDB Atlas Migration Guide

This guide will help you migrate from local MongoDB (MongoDB Compass) to MongoDB Atlas (cloud).

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (M0 cluster is free forever)
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (or any tier you prefer)
3. Select your preferred cloud provider and region:
   - **Recommended**: Choose a region close to your application
   - For Railpack deployments in `asia-southeast1`, choose **AWS/MongoDB** in **Singapore** or **Asia Pacific**
4. Name your cluster (e.g., "digiassistant-cluster")
5. Click **"Create"** (takes 3-5 minutes)

## Step 3: Create Database User

1. In the Security section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these!)
5. Under **"Database User Privileges"**, select **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Configure Network Access

1. In the Security section, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **Note**: For production, only allow specific IPs
4. For production deployments (Railpack):
   - Add your Railpack deployment IPs
   - Or temporarily use 0.0.0.0/0 and restrict later
5. Click **"Confirm"**

## Step 5: Get Connection String

1. In the Database section, click **"Connect"**
2. Choose **"Connect your application"**
3. Select **"Python"** and version **"3.6 or later"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<username>` and `<password>` with your database user credentials
6. **Add database name** at the end (before `?`):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digiassistant?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `backend/.env` file
2. Replace the `MONGODB_URL` line with your Atlas connection string:

```env
# MongoDB Atlas Connection
MONGODB_URL=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/digiassistant?retryWrites=true&w=majority
DB_NAME=digiassistant
```

**Important Notes:**
- URL-encode special characters in password (e.g., `@` becomes `%40`)
- The database name (`digiassistant`) can be in the URL or separate in `DB_NAME`
- Keep your `.env` file secure and never commit it to git!

## Step 7: Test Local Connection

1. Make sure your `.env` file is updated
2. Start your backend:
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```
3. You should see: `✅ Connected to MongoDB Atlas: digiassistant`
4. Test the API endpoints to ensure everything works

## Step 8: Seed Database (First Time)

If this is a new Atlas cluster, you need to seed it with initial data:

```bash
cd backend
python seed_database.py
```

This will create:
- Diagnostic criteria
- Dimensions
- Pillars
- All necessary collections

## Step 9: Migrate Existing Data (Optional)

If you have existing data in local MongoDB, you can migrate it:

### Option A: Using MongoDB Compass

1. Connect to your local MongoDB in Compass
2. Export your collections:
   - Go to each collection
   - Click "..." → "Export Collection"
   - Save as JSON
3. Connect to Atlas in Compass using your connection string
4. Import the JSON files into corresponding collections

### Option B: Using mongodump/mongorestore

```bash
# Export from local MongoDB
mongodump --uri="mongodb://localhost:27017" --db=digiassistant --out=./backup

# Import to Atlas
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digiassistant" ./backup/digiassistant
```

## Step 10: Update Production Environment Variables

For Railpack or other cloud deployments:

1. Go to your deployment platform (Railpack dashboard)
2. Navigate to **Environment Variables**
3. Update `MONGODB_URL` with your Atlas connection string:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digiassistant?retryWrites=true&w=majority
   ```
4. Redeploy your application

## Troubleshooting

### Connection Timeout

**Problem**: Can't connect to Atlas
**Solutions**:
- Check Network Access settings (Step 4)
- Verify your IP is whitelisted
- For production, ensure deployment platform IPs are allowed

### Authentication Failed

**Problem**: "Authentication failed" error
**Solutions**:
- Verify username and password in connection string
- URL-encode special characters in password
- Check user has correct permissions (Step 3)

### SSL/TLS Issues

**Problem**: SSL certificate errors
**Solutions**:
- Atlas requires SSL by default (this is good!)
- Ensure your MongoDB driver supports SSL (Motor does)
- Connection string should use `mongodb+srv://` (not `mongodb://`)

### Database Not Found

**Problem**: Database doesn't exist
**Solutions**:
- Atlas creates databases automatically on first write
- Run `seed_database.py` to create collections
- Or manually create collections through Atlas UI

## Security Best Practices

1. **Strong Password**: Use a complex password for database user
2. **IP Whitelist**: Restrict network access to known IPs (production)
3. **Separate Users**: Create different users for different environments
4. **Monitor Access**: Use Atlas monitoring to track connections
5. **Regular Backups**: Enable Atlas automated backups (available on paid tiers)

## Benefits of MongoDB Atlas

✅ **Managed Service**: No need to manage MongoDB server
✅ **Automatic Backups**: Available on paid tiers
✅ **Scaling**: Easy to scale up/down
✅ **Global Distribution**: Deploy clusters worldwide
✅ **Security**: Built-in security features
✅ **Monitoring**: Built-in performance monitoring
✅ **Free Tier**: M0 cluster is free forever (512MB storage)

## Rollback Plan

If you need to switch back to local MongoDB:

1. Update `.env`:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   ```
2. Restart your application
3. Your local MongoDB data should still be there

## Support

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Atlas Community](https://www.mongodb.com/community/forums/)
- [Connection String Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)

