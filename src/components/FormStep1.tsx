import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormStep1Props {
  nextStep: (data: any) => void;
}

const schema = yup.object().shape({
  estateType: yup.string().required('Estate type is required'),
  region: yup.string().required('Region is required'),
  district: yup.string().required('District is required'),
});

const FormStep1: React.FC<FormStep1Props> = ({ nextStep }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    nextStep(data); // Pass data to the next step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Estate Type</label>
        <input {...register('estateType')} />
        <p>{errors.estateType?.message}</p>
      </div>
      <div>
        <label>Region</label>
        <input {...register('region')} />
        <p>{errors.region?.message}</p>
      </div>
      <div>
        <label>District</label>
        <input {...register('district')} />
        <p>{errors.district?.message}</p>
      </div>
      <button type="submit">Next</button>
    </form>
  );
};

export default FormStep1;
