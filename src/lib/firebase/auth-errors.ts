import { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "An account already exists with this email address.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Enter your password to continue.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Console.",
  "auth/popup-blocked": "Your browser blocked the sign-in popup. Allow popups and try again.",
  "auth/popup-closed-by-user": "The sign-in popup was closed before authentication finished.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/weak-password": "Use a stronger password with at least 6 characters.",
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? "Authentication failed. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}
