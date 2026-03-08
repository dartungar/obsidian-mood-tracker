import i18next from 'i18next';
import type { I18nResources, I18nKey } from './types';
import en from './locales/en.json';
import ja from './locales/ja.json';

let isInitialized = false;

/**
 * Reset i18n state (for testing only)
 */
export async function resetI18n(): Promise<void> {
    isInitialized = false;
    if (i18next.isInitialized) {
        await i18next.init({
            lng: 'en',
            fallbackLng: 'en',
            resources: {},
            interpolation: { escapeValue: false }
        });
    }
}

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
            // Svelte's text interpolation ({...}) auto-escapes output.
            // Do NOT use {@html} or innerHTML with translation strings.
            escapeValue: false
        }
    });
    
    isInitialized = true;
}

/**
 * Detect language from Obsidian's moment locale
 */
export function detectLanguage(): SupportedLanguage {
    const momentLocale = window.moment?.locale?.() || 'en';

    // Check if the locale starts with any supported language code
    for (const lang of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
        if (momentLocale.startsWith(lang)) {
            return lang;
        }
    }

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
export function t(key: I18nKey, options?: Record<string, unknown>): string {
    if (!isInitialized) {
        console.warn(`i18n: t() called before initialization for key "${key}"`);
    }
    return i18next.t(key, options) as string;
}

/**
 * Get nested translation object
 * Useful for getting all translations under a specific namespace
 */
export function getTranslations(namespace?: string): Record<string, unknown> {
    if (!namespace) {
        return (i18next.store.data[i18next.language]?.translation || {}) as Record<string, unknown>;
    }

    const translations = i18next.store.data[i18next.language]?.translation || {};
    const keys = namespace.split('.');
    let result: any = translations;

    for (const key of keys) {
        if (!result || typeof result !== 'object' || !Object.prototype.hasOwnProperty.call(result, key)) {
            return {};
        }
        result = result[key];
    }

    return (result || {}) as Record<string, unknown>;
}

/**
 * Format date according to current locale
 */
export function formatDate(date: Date | ReturnType<typeof window.moment>, format?: string): string {
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
    // Access the emotions namespace directly to avoid dot-traversal issues
    // with emotion names that might contain dots
    const translations = i18next.store.data[i18next.language]?.translation as any;
    const translation = translations?.emotions?.[emotion];

    if (typeof translation === 'string') {
        return translation;
    }

    // Fallback to English if not found in current language
    const enTranslations = i18next.store.data['en']?.translation as any;
    const enTranslation = enTranslations?.emotions?.[emotion];

    if (typeof enTranslation === 'string' && i18next.language !== 'en') {
        return enTranslation;
    }

    // Return original for user-defined emotions
    return emotion;
}

/**
 * Helper to get emotion group translation
 * Returns original if no translation found (for user-added groups)
 */
export function translateEmotionGroup(groupName: string): string {
    // Try to find matching default group
    const groupKeyMap: Record<string, I18nKey> = {
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
    const ratingMap: Record<number, I18nKey> = {
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