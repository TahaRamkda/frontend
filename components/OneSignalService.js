// src/utils/OneSignalService.js
import { AppId } from "@/utils/constants";
class OneSignalService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize OneSignal with error handling
  async initializeOneSignal() {
    if (typeof window === "undefined" || !window.OneSignal) {
      console.warn("OneSignal not available or not running in browser environment.");
      return false;
    }

    if (this.isInitialized) {
      console.log("OneSignal is already initialized. Skipping re-initialization.");
      return true;
    }

    try {
      await window.OneSignal.init({
        appId: AppId,
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: true,
      });

      this.isInitialized = true;
      console.log("OneSignal initialized successfully.");
      return true;
    } catch (error) {
      console.error("Error initializing OneSignal:", error);
      return false;
    }
  }

  // Login with an external user ID
  async login(userId) {
    if (!this.isInitialized) {
      console.warn("OneSignal not initialized. Call initializeOneSignal first.");
      return false;
    }

    try {
      await window.OneSignal.login(userId);
      console.log("Logged in to OneSignal with user ID:", userId);
      return true;
    } catch (error) {
      console.error("Error logging in to OneSignal:", error);
      return false;
    }
  }

  // Opt-in to push notifications
  async optIn() {
    if (!this.isInitialized) {
      console.warn("OneSignal not initialized. Call initializeOneSignal first.");
      return false;
    }

    try {
      await window.OneSignal.User.PushSubscription.optIn();
      console.log("Opted in to push notifications.");
      return true;
    } catch (error) {
      console.error("Error opting in to push notifications:", error);
      return false;
    }
  }

  // Opt-out of push notifications
  async optOut() {
    if (!this.isInitialized) {
      console.warn("OneSignal not initialized. Call initializeOneSignal first.");
      return false;
    }

    try {
      await window.OneSignal.User.PushSubscription.optOut();
      console.log("Opted out of push notifications.");
      return true;
    } catch (error) {
      console.error("Error opting out of push notifications:", error);
      return false;
    }
  }

  // Check if the user is subscribed to push notifications
  async isSubscribed() {
    if (!this.isInitialized) {
      console.warn("OneSignal not initialized. Call initializeOneSignal first.");
      return false;
    }

    try {
      const isSubscribed = await window.OneSignal.isPushNotificationsEnabled();
      console.log("Push notification subscription status:", isSubscribed);
      return isSubscribed;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  }

  // Prompt user for push notification permission
  async promptPush() {
    if (!this.isInitialized) {
      console.warn("OneSignal not initialized. Call initializeOneSignal first.");
      return false;
    }

    try {
      await window.OneSignal.Slidedown.promptPush();
      console.log("Prompted user for push notification permission.");
      return true;
    } catch (error) {
      console.error("Error prompting for push notifications:", error);
      return false;
    }
  }
}

// Export a singleton instance
const oneSignalService = new OneSignalService();
export default oneSignalService;