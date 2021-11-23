import { createI18n } from 'vue-i18n';
import { App } from 'vue';
import { Quasar } from 'quasar';
import messages from 'src/i18n';

export const i18n = createI18n({
  locale: Quasar.lang.getLocale()?.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages,
  legacy: false,
});

export default ({ app }: { app: App }) => {
  app.use(i18n);
};
