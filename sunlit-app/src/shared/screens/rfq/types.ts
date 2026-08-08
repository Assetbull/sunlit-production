export interface RFQData {
  // Step 1
  projectType: 'Residential' | 'Commercial' | 'Real Estate Development' | '';
  // Step 2
  projectPath: 'installation' | 'appliance' | '';
  // Step 3 (Installation)
  invCapacity: string;
  invType: string;
  battCapacity: string;
  battUnits: string;
  battChem: string;
  panelWattage: string;
  panelCount: string;
  panelType: string;
  // Step 3 (Appliance)
  systemSizeKw: string;
  selectedAppliances: string[];
  // Step 4
  projectTitle: string;
  locationState: string;
  locationCity: string;
  timelineDays: string;
  description: string;
  // Step 5
  budgetRangeMin: string;
  budgetRangeMax: string;

  // Form State
  status: 'idle' | 'loading' | 'success';
  errors: Record<string, string>;
  serverError: string;
}

export interface RFQScreenProps {
  data: {
    state: RFQData;
    onUpdate: (updates: Partial<RFQData>) => void;
    onNext: () => void;
    onBack: () => void;
    onSubmit: () => void;
  };
}
