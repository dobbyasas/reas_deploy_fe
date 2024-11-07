import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormStep2Props {
  submitForm: (data: any) => void;
}

const schema = yup.object().shape({
  fullname: yup.string().required('Full name is required'),
  phone: yup.string().matches(/^[+]?420? ?\d{3} ?\d{3} ?\d{3}$/, 'Invalid phone number').required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const FormStep2: React.FC<FormStep2Props> = ({ submitForm }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    submitForm(data); // Pass data to the API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Full Name</label>
        <input {...register('fullname')} />
        <p>{errors.fullname?.message}</p>
      </div>
      <div>
        <label>Phone</label>
        <input {...register('phone')} />
        <p>{errors.phone?.message}</p>
      </div>
      <div>
        <label>Email</label>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormStep2;
