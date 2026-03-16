import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/data/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string): string => {
    return getTranslation(key as keyof typeof import('@/data/translations').translations.en, language);
  };
  
  return { t, language };
};
