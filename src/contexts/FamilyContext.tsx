import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUserFamilyMemberships } from '@/hooks/useFamilyMembers';

interface FamilyContextType {
  selectedFamilyId: string | null;
  setSelectedFamilyId: (familyId: string | null) => void;
  contextType: 'individual' | 'family';
  setContextType: (type: 'individual' | 'family') => void;
  availableFamilies: any[];
  isLoading: boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [contextType, setContextType] = useState<'individual' | 'family'>('individual');
  
  const { data: familyMemberships = [], isLoading } = useUserFamilyMemberships();

  // Auto-select first family if user has families and none selected
  useEffect(() => {
    if (familyMemberships.length > 0 && !selectedFamilyId && contextType === 'family') {
      setSelectedFamilyId(familyMemberships[0].family_id);
    }
  }, [familyMemberships, selectedFamilyId, contextType]);

  // Refresh family memberships when families are added
  useEffect(() => {
    if (contextType === 'family' && familyMemberships.length > 0 && !selectedFamilyId) {
      setSelectedFamilyId(familyMemberships[0].family_id);
    }
  }, [familyMemberships.length, contextType]);

  const value = {
    selectedFamilyId,
    setSelectedFamilyId,
    contextType,
    setContextType,
    availableFamilies: familyMemberships,
    isLoading,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamilyContext = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamilyContext must be used within a FamilyProvider');
  }
  return context;
};