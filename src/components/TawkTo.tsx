// src/components/TawkTo.tsx
import { useEffect } from 'react';

interface TawkToProps {
  propertyId: string; // Your Tawk.to Property ID
  widgetId: string;   // Your Tawk.to Widget ID
}

const TawkTo = ({ propertyId, widgetId }: TawkToProps) => {
  useEffect(() => {
    // Check if Tawk_API already exists to prevent duplicate loading
    if (window.Tawk_API) {
      return;
    }

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and append the script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Find the first script tag and insert before it
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const existingScript = document.querySelector(`script[src*="${propertyId}"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      
      // Clean up global variables
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [propertyId, widgetId]);

  return null; // This component doesn't render anything
};

export default TawkTo;

// Type declarations for TypeScript
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}