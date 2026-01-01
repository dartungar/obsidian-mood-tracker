import i18next from 'i18next';
import type { I18nResources } from './types';
import en from './locales/en.json';
import ja from './locales/ja.json';

let isInitialized = false;

export const SUPPORTED_LANGUAGES = {
    en: 'English',
    ja: '日本語'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Initialize i18n with the specified language
 * Falls back to English if the specified language is not supported
 */
export async function initI18n(language?: string): Promise<void> {
    if (isInitialized) {
        await i18next.changeLanguage(language || 'en');
        return;
    }

    // Get language from Obsidian's locale or use provided language
    const detectedLanguage = language || detectLanguage();
    
    await i18next.init({
        lng: detectedLanguage,
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: { translation: en },
            ja: { translation: ja }
        },
        interpolation: {
            escapeValue: false // Not needed for React/Svelte
        }
    });
    
    isInitialized = true;
}

/**
 * Detect language from Obsidian's moment locale
 */
export function detectLanguage(): SupportedLanguage {
    // Try to get language from Obsidian's moment
    const momentLocale = window.moment?.locale?.() || 'en';
    
    // Check if the locale starts with a supported language code
    if (momentLocale.startsWith('ja')) {
        return 'ja';
    }
    
    // Default to English
    return 'en';
}

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLanguage {
    return (i18next.language || 'en') as SupportedLanguage;
}

/**
 * Change language
 */
export async function changeLanguage(language: SupportedLanguage): Promise<void> {
    await i18next.changeLanguage(language);
}

/**
 * Translation function
 * @param key - The translation key in dot notation (e.g., 'commands.openTracker')
 * @param options - Optional interpolation values
 */
export function t(key: string, options?: any): string {
    return i18next.t(key, options) as string;
}

/**
 * Get nested translation object
 * Useful for getting all translations under a specific namespace
 */
export function getTranslations(namespace?: string): any {
    if (!namespace) {
        return i18next.store.data[i18next.language]?.translation || {};
    }
    
    const translations = i18next.store.data[i18next.language]?.translation || {};
    const keys = namespace.split('.');
    let result: any = translations;
    
    for (const key of keys) {
        result = result?.[key];
        if (!result) break;
    }
    
    return result || {};
}

/**
 * Format date according to current locale
 */
export function formatDate(date: Date | moment.Moment, format?: string): string {
    const currentLang = getCurrentLanguage();
    const momentDate = window.moment(date);
    
    if (currentLang === 'ja') {
        // Japanese date format
        return format 
            ? momentDate.format(format)
            : momentDate.format('YYYY年MM月DD日 HH:mm');
    }
    
    // Default English format
    return format 
        ? momentDate.format(format)
        : momentDate.format('MMMM D, YYYY h:mm A');
}

/**
 * Helper to get emotion translation
 * Returns original if no translation found (for user-added emotions)
 */
export function translateEmotion(emotion: string): string {
    const key = `emotions.${emotion}`;
    const translation = t(key);
    
    // If translation key not found, return original
    if (translation === key) {
        return emotion;
    }
    
    return translation;
}

/**
 * Helper to get emotion group translation
 * Returns original if no translation found (for user-added groups)
 */
export function translateEmotionGroup(groupName: string): string {
    // Try to find matching default group
    const groupKeyMap: Record<string, string> = {
        'Love and joy': 'emotionGroups.loveAndJoy',
        'Neutral and surprise': 'emotionGroups.neutralAndSurprise',
        'Anger and stress': 'emotionGroups.angerAndStress',
        'Sadness and fear': 'emotionGroups.sadnessAndFear'
    };
    
    const key = groupKeyMap[groupName];
    if (key) {
        return t(key);
    }
    
    // Return original for custom groups
    return groupName;
}

/**
 * Helper to get mood rating label translation
 */
export function translateMoodRating(rating: number): string {
    const ratingMap: Record<number, string> = {
        1: 'moodRatings.veryBad',
        2: 'moodRatings.bad',
        3: 'moodRatings.ok',
        4: 'moodRatings.good',
        5: 'moodRatings.veryGood'
    };
    
    const key = ratingMap[rating];
    return key ? t(key) : '';
}

// Export i18next instance for advanced usage
export { i18next };

// Re-export types
export type { I18nResources } from './types';