/* ==========================================================================
   CampusLink - Storage Service
   Handles image uploads for avatars, post attachments, and circle banners
   ========================================================================== */

import { FirebaseClients, isUsingLiveFirebase } from "../config/firebase-config.js";

class StorageService {
  /**
   * Upload an image file. If Firebase Storage is connected, uploads to cloud bucket.
   * Otherwise, converts to a persistent Data URL.
   * @param {File} file
   * @param {string} pathPrefix
   * @returns {Promise<string>} Download URL
   */
  async uploadImage(file, pathPrefix = "uploads") {
    if (!file) throw new Error("No file provided");

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 5MB limit. Please choose a smaller image.");
    }

    // Validate image format
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files (PNG, JPG, WEBP) are supported.");
    }

    if (isUsingLiveFirebase() && FirebaseClients.storage) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const ref = FirebaseClients.storage.ref().child(`${pathPrefix}/${fileName}`);
        const snapshot = await ref.put(file);
        const downloadUrl = await snapshot.ref.getDownloadURL();
        return downloadUrl;
      } catch (err) {
        console.warn("Firebase Storage upload failed, falling back to Data URL:", err);
      }
    }

    // High performance local fallback using base64 Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  }
}

export const storageService = new StorageService();
