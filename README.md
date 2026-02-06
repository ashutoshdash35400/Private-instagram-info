# Instagram Collaboration Checker API

Developed for **Rajan** (@rajanhackerd).

This API allows you to check Instagram profile collaboration data. It is optimized for deployment on **Render**.

## 🚀 Deployment on Render

1.  **Create a GitHub Repository**: Upload these files to a new repository on your GitHub.
2.  **Login to Render**: Go to [render.com](https://render.com) and sign in.
3.  **New Web Service**:
    *   Click **New +** and select **Web Service**.
    *   Connect your GitHub repository.
4.  **Configure Settings**:
    *   **Name**: `insta-collab-api` (or any name you like).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `npm start`.
5.  **Deploy**: Click **Create Web Service**.

## 🛠 API Usage

Once deployed, you can use the API as follows:

**Endpoint:** `GET /api/check?username=TARGET_USERNAME`

### Example Request:
`https://your-app-name.onrender.com/api/check?username=zuck`

### Response Format:
```json
{
  "status": "success",
  "owner_info": {
    "developer": "Rajan",
    "telegram_channel": "@rajanhackerd"
  },
  "profile": {
    "username": "zuck",
    "followers": 12000000,
    "total_posts": 500
  },
  "analysis": {
    "collaboration_posts": 2,
    "unique_collaborators": ["@username1", "@username2"]
  }
}
```

## ⚠️ Important Note
Instagram's API has rate limits. If you make too many requests in a short time, you might get blocked temporarily. For high-volume usage, consider using proxies or official Instagram Graph API.
