import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ModalContextValue {
  isOpen: boolean;
  selectedCourseId: number | null;
  openModal: (courseId?: number) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const openModal = useCallback((courseId?: number) => {
    setIsOpen(true);
    setSelectedCourseId(courseId ?? null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedCourseId(null);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, selectedCourseId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
