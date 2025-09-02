import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { platformsService, type PlatformData } from '../lib/platforms';

interface PlatformContextType {
  platforms: PlatformData[];
  loading: boolean;
  addPlatform: (name: string) => Promise<void>;
  refreshPlatforms: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshPlatforms = async () => {
    if (!user?.id) {
      setPlatforms([]);
      return;
    }
    setLoading(true);
    try {
      const data = await platformsService.getUserPlatforms(user.id);
      setPlatforms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addPlatform = async (name: string) => {
    if (!user?.id) return;
    const newPlatform = await platformsService.addPlatform(user.id, name);
    if (newPlatform) {
      setPlatforms((prev) => [...prev, newPlatform]);
    }
  };

  useEffect(() => {
    refreshPlatforms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <PlatformContext.Provider value={{ platforms, loading, addPlatform, refreshPlatforms }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatforms = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatforms must be used within a PlatformProvider');
  }
  return context;
};
