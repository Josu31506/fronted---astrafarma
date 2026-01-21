import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type EditStateContextType = {
  isEdited: boolean;
  setEdited: (edited: boolean) => void;
  markEdited: () => void;
  resetEdited: () => void;
};

const EditStateContext = createContext<EditStateContextType | undefined>(undefined);

export const ProductEditStateProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [isEdited, setEdited] = useState(false);

  const markEdited = useCallback(() => setEdited(true), []);
  const resetEdited = useCallback(() => setEdited(false), []);

  return (
    <EditStateContext.Provider value={{ isEdited, setEdited, markEdited, resetEdited }}>
      {children}
    </EditStateContext.Provider>
  );
};

export const useProductEditState = () => {
  const ctx = useContext(EditStateContext);
  if (!ctx) throw new Error('useProductEditState must be used within ProductEditStateProvider');
  return ctx;
};