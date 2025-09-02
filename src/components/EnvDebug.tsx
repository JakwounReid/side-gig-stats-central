import React from 'react';

const EnvDebug = () => {
  // Only show in development or when explicitly enabled
  const showDebug = import.meta.env.DEV || import.meta.env.VITE_SHOW_ENV_DEBUG === 'true';
  
  if (!showDebug) return null;

  const tawkToPropertyId = import.meta.env.VITE_TAWKTO_PROPERTY_ID;
  const tawkToWidgetId = import.meta.env.VITE_TAWKTO_WIDGET_ID;

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Environment Debug:</strong></div>
      <div>Mode: {import.meta.env.MODE}</div>
      <div>DEV: {import.meta.env.DEV ? 'true' : 'false'}</div>
      <div>TawkTo Property ID: {tawkToPropertyId ? `${tawkToPropertyId.slice(0, 8)}...` : 'NOT SET'}</div>
      <div>TawkTo Widget ID: {tawkToWidgetId ? `${tawkToWidgetId.slice(0, 8)}...` : 'NOT SET'}</div>
    </div>
  );
};

export default EnvDebug;