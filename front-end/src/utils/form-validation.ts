export const RULES = {
  required: (val: string) => !!val || 'This field is required.',
  email: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email.',
  password: (val: string) => (val && val.length >= 6) || 'Should contain at least 6 characters.',
};
