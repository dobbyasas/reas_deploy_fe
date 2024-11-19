import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormStep2Props {
  submitForm: (data: any) => void;
  goToStep1: () => void; // Function to go back to FormStep1
}

const schema = yup.object().shape({
  fullname: yup.string().required('Full name is required'),
  phone: yup
    .string()
    .matches(/^[+]?420? ?\d{3} ?\d{3} ?\d{3}$/, 'Invalid phone number')
    .required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const FormStep2: React.FC<FormStep2Props> = ({ submitForm, goToStep1 }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state

  const onSubmit = (data: any) => {
    submitForm(data); // Pass data to the API
    setIsSubmitted(true); // Show thank-you message after submission
  };

  if (isSubmitted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1 style={{ color: '#1975f0' }}>Thank You!</h1>
        <p>Your submission has been received. We will contact you soon.</p>
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
          Back to Step 1
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Full Name</label>
        <input
          {...register('fullname')}
          onFocus={(e) => (e.target.style.borderColor = '#1975f0')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <p>{errors.fullname?.message}</p>
      </div>
      <div>
        <label>Phone</label>
        <input
          {...register('phone')}
          onFocus={(e) => (e.target.style.borderColor = '#1975f0')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <p>{errors.phone?.message}</p>
      </div>
      <div>
        <label>Email</label>
        <input
          {...register('email')}
          onFocus={(e) => (e.target.style.borderColor = '#1975f0')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <p>{errors.email?.message}</p>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormStep2;
