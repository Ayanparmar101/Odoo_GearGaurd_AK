/**
 * GearGuard API - Firebase Functions Placeholder
 * 
 * NOTE: Deploy your backend to Railway (already configured in your project)
 * Then update the frontend VITE_API_URL to point to your Railway URL
 */

import * as functions from "firebase-functions";

export const api = functions.https.onRequest((request, response) => {
  response.json({
    message: "GearGuard API - Backend placeholder",
    status: "not_configured",
    instructions: [
      "1. Deploy gearguard-backend to Railway",
      "2. Update VITE_API_URL in frontend .env.production",
      "3. Rebuild and redeploy frontend",
    ],
  });
});
