# Frontend Environment Setup

## Required Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Node.js Backend URL
VITE_APP_BASE_URL=https://dev-ai-shop-backend.vercel.app/api/v1

# Python Backend URL (for AI services)
VITE_PYTHON_BACKEND_URL=https://dev-ai-shop-python-backend-5.onrender.com
```

## Environment Variable Details

### VITE_APP_BASE_URL
- **Purpose**: Base URL for the Node.js backend API
- **Format**: `https://dev-ai-shop-backend.vercel.app/api/v1`
- **Default fallback**: If the environment variable is not set, it will use `https://dev-ai-shop-backend.vercel.app/api/v1`

### VITE_PYTHON_BACKEND_URL
- **Purpose**: URL for the Python AI backend
- **Format**: `https://dev-ai-shop-python-backend-5.onrender.com`
- **Usage**: Used for AI-powered features like product recommendations

## 🚀 Quick Setup

1. **Create `.env` file** in the `frontend` directory:
   ```bash
   cd frontend
   touch .env
   ```

2. **Add the following content** to your `.env` file:
   ```env
   VITE_APP_BASE_URL=https://dev-ai-shop-backend.vercel.app/api/v1
   VITE_PYTHON_BACKEND_URL=https://dev-ai-shop-python-backend-5.onrender.com
   ```

## 📝 Manual Steps

If you can't create the `.env` file automatically, follow these steps:

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Create a new file** named `.env`:
   - Windows: Right-click → New → Text Document → Rename to `.env`
   - Mac/Linux: `touch .env`

3. **Open the `.env` file** and add:
   ```env
   VITE_APP_BASE_URL=https://dev-ai-shop-backend.vercel.app/api/v1
   VITE_PYTHON_BACKEND_URL=https://dev-ai-shop-python-backend-5.onrender.com
   ```

4. **Save the file**

## 🔧 Configuration Details

- **VITE_APP_BASE_URL**: The base URL for your Node.js backend API
- **VITE_PYTHON_BACKEND_URL**: The base URL for your Python backend API
- **Default fallback**: If the environment variable is not set, it will use `https://dev-ai-shop-backend.vercel.app/api/v1`

## ✅ Verification

After creating the `.env` file:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Check the console** for any errors

3. **Test the application** to ensure API calls work correctly

## 🎯 What Changed

All hardcoded backend URLs have been replaced with:
- Environment variable: `import.meta.env.VITE_APP_BASE_URL`
- Centralized configuration in `src/utils/config.js`
- Fallback to default URL if environment variable is not set

## 📁 Files Updated

- `src/services/authService.js`
- `src/Pages/YourPurchases.jsx`
- `src/Pages/Produsts.jsx`
- `src/Pages/ProductDetails.jsx`
- `src/Pages/CreateProduct,.jsx`
- `src/components/HomeComponents/TodayBestDeals.jsx`
- `src/utils/config.js` (new file) 