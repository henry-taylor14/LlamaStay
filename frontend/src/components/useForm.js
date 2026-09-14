import { useState } from 'react';

const useForm = (initialFieldValues, validateForm) => {
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setValues({ ...values, ...fieldValue });
    validateForm(fieldValue);
  };

  return { values, errors, setErrors, handleInputChange };
};

export default useForm;
