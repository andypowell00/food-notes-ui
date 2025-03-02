import toast from 'react-hot-toast';

/**
 * Standard error handling utility for API requests
 * Logs detailed error to console but shows a user-friendly message in the UI
 */
export function handleError(error: unknown, userMessage: string = 'An error occurred'): void {
  // Log detailed error for developers
  console.error('Error details:', error);
  
  // Show user-friendly message
  toast.error(userMessage);
}

/**
 * Success notification utility
 */
export function showSuccess(message: string): void {
  toast.success(message);
}

/**
 * Type for API responses with potential errors
 */
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};
