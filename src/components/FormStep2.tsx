import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// props pro komponentu
interface FormStep2Props {
  submitForm: (data: any) => void; // funkce pro zpracování odeslaných dat
  goToStep1: () => void; // funkce pro návrat na první krok
}

// validace formuláře pomocí Yup
const schema = yup.object().shape({
  fullname: yup.string().required('Je potřeba celé jméno'),
  phone: yup
    .string()
    .matches(/^[+]?420? ?\d{3} ?\d{3} ?\d{3}$/, 'Špatné telefonní číslo (formát by měl být +420123456789)') // validace českého formátu telefonního čísla
    .required('Prosím vyplňte telefonní číslo'),
  email: yup.string().email('Nesprávný formát emailu').required('Prosím vyplňte emailovou adresu'),
});

const FormStep2: React.FC<FormStep2Props> = ({ submitForm }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema), // použití Yup validace
  });

  // funkce pro odeslání, uloží data
  const onSubmit = (data: any) => {
    submitForm(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Celé jméno</label>
        <input
          {...register('fullname')}
          onFocus={(e) => (e.target.style.borderColor = '#1975f0')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <p>{errors.fullname?.message}</p>
      </div>
      <div>
        <label>Telefonní číslo</label>
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
      <button type="submit">Poslat</button>
    </form>
  );
};

export default FormStep2;
