import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface DataRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const DataRefreshContext = createContext<DataRefreshContextType>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function useDataRefresh() {
  return useContext(DataRefreshContext);
}

interface DataRefreshProviderProps {
  children: ReactNode;
}

export function DataRefreshProvider({ children }: DataRefreshProviderProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <DataRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </DataRefreshContext.Provider>
  );
}
