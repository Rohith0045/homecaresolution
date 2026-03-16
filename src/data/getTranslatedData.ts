import { products } from './products';
import { getProductTranslation } from './productTranslations';
import { Language } from './translations';

export interface TranslatedProduct {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  badge?: string;
  usage?: string;
  image: string;
}

export const getTranslatedProduct = (productId: string, language: Language): TranslatedProduct => {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  return {
    id: product.id,
    name: getProductTranslation(`prod${productId}.name`, language),
    description: getProductTranslation(`prod${productId}.desc`, language),
    longDescription: getProductTranslation(`prod${productId}.longDesc`, language),
    price: product.price,
    badge: getProductTranslation(`prod${productId}.badge`, language),
    usage: getProductTranslation(`prod${productId}.usage`, language),
    image: product.image,
  };
};

export const getTranslatedProducts = (language: Language): TranslatedProduct[] => {
  return products.map(product => getTranslatedProduct(product.id, language));
};

// Get category names translations
export const getCategoryTranslation = (category: string, language: Language): string => {
  const categoryKeys: Record<string, string> = {
    'Kitchen': 'cat.kitchen',
    'Bathroom': 'cat.bathroom',
    'Floor': 'cat.floor',
    'Laundry': 'cat.laundry',
    'Hand Wash': 'cat.handwash',
    'Accessories': 'cat.accessories',
  };

  const key = categoryKeys[category];
  if (!key) return category;
  
  return getProductTranslation(key, language);
};
