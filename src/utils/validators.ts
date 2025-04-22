export const validators = {
  required: (value: any) => {
    if (value === undefined || value === null || value === '') {
      return 'Este campo é obrigatório';
    }
    return '';
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email inválido';
    }
    return '';
  },

  cpf: (value: string) => {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11) {
      return 'CPF inválido';
    }
    return '';
  },

  phone: (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 11) {
      return 'Telefone inválido';
    }
    return '';
  },

  minLength: (min: number) => (value: string) => {
    if (value.length < min) {
      return `Mínimo de ${min} caracteres`;
    }
    return '';
  },

  maxLength: (max: number) => (value: string) => {
    if (value.length > max) {
      return `Máximo de ${max} caracteres`;
    }
    return '';
  },

  password: (value: string) => {
    if (value.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres';
    }
    if (!/[A-Z]/.test(value)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[a-z]/.test(value)) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!/[0-9]/.test(value)) {
      return 'A senha deve conter pelo menos um número';
    }
    return '';
  },
};