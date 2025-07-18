import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import zhTranslation from './zh.json';

// 初始化i18next
const i18n = i18next.createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation }
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n; 