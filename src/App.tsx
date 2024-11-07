import React, { useState } from 'react';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import { submitLead } from './services/api';

// Define the interface for form data
interface FormData {
  estateType: string;
  fullName: string;
  phone: string;
  email: string;
  region: string;
  district: string;
}

const App: React.FC = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    estateType: '',
    fullName: '',
    phone: '',
    email: '',
    region: '',
    district: ''
  });

  const nextStep = (data: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setFormStep(2);
  };

  const submitForm = async (data: Partial<FormData>) => {
    const fullData = { ...formData, ...data };
    try {
      await submitLead(fullData);
      alert('Lead submitted successfully!');
    } catch (error) {
      alert('Failed to submit lead');
    }
  };

  return (
    <div>
      <h1>Real Estate Form</h1>
      {formStep === 1 ? (
        <FormStep1 nextStep={nextStep} />
      ) : (
        <FormStep2 submitForm={submitForm} />
      )}
    </div>
  );
};

export default App;
