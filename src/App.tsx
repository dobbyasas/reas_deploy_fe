import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import Header from './components/Header';
import { submitLead } from './services/api';
import './styles/styles.scss';

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
    district: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const nextStep = (data: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    setFormStep(2);
  };

  const goToStep1 = () => {
    setFormStep(1);
    setSubmitted(false);
  };

  const submitForm = async (data: Partial<FormData>) => {
    const fullData = { ...formData, ...data };
    try {
      await submitLead(fullData);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit lead', error);
    }
  };

  const Form = () => (
    <div className="app-wrapper">
      <Header />
      {submitted ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1 style={{ color: '#1975f0' }}>Děkujeme!</h1>
          <p>Vaše nemovitost byla uložena. Brzy Vás kontaktujeme.</p>
          <button
            onClick={goToStep1}
            style={{
              backgroundColor: '#1975f0',
              color: '#fff',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem',
            }}
          >
            Zpět
          </button>
        </div>
      ) : formStep === 1 ? (
        <FormStep1 nextStep={nextStep} />
      ) : (
        <FormStep2 submitForm={submitForm} goToStep1={goToStep1} />
      )}
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chci-nabidku" />} />
      <Route path="/chci-nabidku" element={<Form />} />
    </Routes>
  );
};

export default App;
