import { useState, useCallback } from 'react';

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => boolean;
    message?: string;
  };
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules
) => {
  const [formState, setFormState] = useState<FormState>({
    values: initialValues,
    errors: {},
    touched: {},
  });

  const validateField = useCallback(
    (name: string, value: any) => {
      if (!validationRules || !validationRules[name]) return '';

      const rules = validationRules[name];
      
      if (rules.required && !value) {
        return rules.message || 'Este campo é obrigatório';
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message || 'Formato inválido';
      }

      if (rules.minLength && value.length < rules.minLength) {
        return rules.message || `Mínimo de ${rules.minLength} caracteres`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return rules.message || `Máximo de ${rules.maxLength} caracteres`;
      }

      if (rules.custom && !rules.custom(value)) {
        return rules.message || 'Valor inválido';
      }

      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      
      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        touched: { ...prev.touched, [name]: true },
        errors: {
          ...prev.errors,
          [name]: validateField(name, value),
        },
      }));
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      
      setFormState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [name]: true },
        errors: {
          ...prev.errors,
          [name]: validateField(name, value),
        },
      }));
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    if (!validationRules) return true;

    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formState.values).forEach((key) => {
      const error = validateField(key, formState.values[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFormState((prev) => ({
      ...prev,
      errors,
      touched: Object.keys(prev.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ),
    }));

    return isValid;
  }, [formState.values, validateField, validationRules]);

  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues: (values: Partial<T>) =>
      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, ...values },
      })),
  };
};

export default useForm;