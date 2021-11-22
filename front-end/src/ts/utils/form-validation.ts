import { i18n } from 'src/boot/i18n';

const URL_REGEX = /^https?:\/\/[a-zA-Z0-9\-_\.]+(:[0-9]+)?(\/[a-zA-Z0-9\-_\/]*)?$/;

export const RULES = {
  required: (val: string) => !!val || i18n.global.t('fieldRequired'),
  email: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || i18n.global.t('invalidEmail'),
  password: (val: string) => (val && val.length >= 6) || i18n.global.t('invalidPassword'),
  url: (val: string) => URL_REGEX.test(val) || i18n.global.t('invalidUrl'),
};
