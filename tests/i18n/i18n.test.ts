import { describe, it, expect, beforeEach } from 'vitest';
import {
    initI18n,
    resetI18n,
    t,
    detectLanguage,
    translateEmotion,
    translateEmotionGroup,
    translateMoodRating,
    formatDate,
    getCurrentLanguage,
    changeLanguage,
    getTranslations,
    i18next,
} from 'src/i18n';

describe('i18n basic functionality', () => {
    beforeEach(async () => {
        await resetI18n();
        await initI18n('ja');
    });

    describe('translation retrieval', () => {
        it('retrieves Japanese translations', () => {
            expect(t('commands.openTracker')).toBe('トラッカーを開く');
            expect(t('commands.openHistory')).toBe('履歴を開く');
            expect(t('modals.tracker.title')).toBe('今の気分はどうですか？');
            expect(t('modals.tracker.save')).toBe('保存');
            expect(t('modals.tracker.cancel')).toBe('キャンセル');
        });

        it('retrieves nested keys correctly', () => {
            expect(t('settings.trackerModalTitle.name')).toBe('トラッカーモーダルのタイトル');
            expect(t('settings.trackerModalTitle.desc')).toBe('気分トラッカーモーダルのタイトル');
        });

        it('returns the key itself for missing keys', () => {
            expect(i18next.t('nonexistent.key')).toBe('nonexistent.key');
        });
    });

    describe('language switching', () => {
        it('switches to English', async () => {
            await changeLanguage('en');
            expect(t('commands.openTracker')).toBe('Open Tracker');
            expect(t('modals.tracker.title')).toBe('How are you feeling?');

            await changeLanguage('ja');
            expect(t('commands.openTracker')).toBe('トラッカーを開く');
        });

        it('returns current language', async () => {
            expect(getCurrentLanguage()).toBe('ja');

            await changeLanguage('en');
            expect(getCurrentLanguage()).toBe('en');
        });
    });

    describe('language detection', () => {
        it('detects ja from moment locale', () => {
            expect(detectLanguage()).toBe('ja');
        });

        it('falls back to en for unsupported locales', () => {
            const momentMock = (global as any).window.moment;
            const originalLocale = momentMock.locale;
            momentMock.locale = () => 'fr';
            expect(detectLanguage()).toBe('en');
            momentMock.locale = originalLocale;
        });

        it('detects ja from regional variant ja-JP', () => {
            const momentMock = (global as any).window.moment;
            const originalLocale = momentMock.locale;
            momentMock.locale = () => 'ja-JP';
            expect(detectLanguage()).toBe('ja');
            momentMock.locale = originalLocale;
        });

        it('falls back to en when moment is undefined', () => {
            const saved = (global as any).window.moment;
            (global as any).window.moment = undefined;
            expect(detectLanguage()).toBe('en');
            (global as any).window.moment = saved;
        });
    });

    describe('unsupported language fallback', () => {
        it('falls back to English for unsupported language', async () => {
            await resetI18n();
            await initI18n('fr');
            expect(t('commands.openTracker')).toBe('Open Tracker');
        });
    });
});

describe('emotion translation', () => {
    beforeEach(async () => {
        await resetI18n();
        await initI18n('ja');
    });

    it('translates default emotions to Japanese', () => {
        expect(translateEmotion('happy')).toBe('幸せ');
        expect(translateEmotion('joyful')).toBe('喜んでいる');
        expect(translateEmotion('excited')).toBe('興奮している');
        expect(translateEmotion('loving')).toBe('愛情深い');
        expect(translateEmotion('ok')).toBe('まあまあ');
        expect(translateEmotion('bored')).toBe('退屈');
        expect(translateEmotion('stressed')).toBe('ストレスを感じている');
        expect(translateEmotion('angry')).toBe('怒っている');
        expect(translateEmotion('sad')).toBe('悲しい');
        expect(translateEmotion('anxious')).toBe('不安な');
        expect(translateEmotion('lonely')).toBe('寂しい');
    });

    it('returns original string for custom emotions', () => {
        expect(translateEmotion('customemotion')).toBe('customemotion');
        expect(translateEmotion('user-added-emotion')).toBe('user-added-emotion');
    });
});

describe('emotion group translation', () => {
    beforeEach(async () => {
        await resetI18n();
        await initI18n('ja');
    });

    it('translates default group names to Japanese', () => {
        expect(translateEmotionGroup('Love and joy')).toBe('愛と喜び');
        expect(translateEmotionGroup('Neutral and surprise')).toBe('中立と驚き');
        expect(translateEmotionGroup('Anger and stress')).toBe('怒りとストレス');
        expect(translateEmotionGroup('Sadness and fear')).toBe('悲しみと恐れ');
    });

    it('returns original for custom group names', () => {
        expect(translateEmotionGroup('Custom Group')).toBe('Custom Group');
    });
});

describe('mood rating translation', () => {
    beforeEach(async () => {
        await resetI18n();
        await initI18n('ja');
    });

    it('translates rating levels to Japanese', () => {
        expect(translateMoodRating(1)).toBe('とても悪い');
        expect(translateMoodRating(2)).toBe('悪い');
        expect(translateMoodRating(3)).toBe('普通');
        expect(translateMoodRating(4)).toBe('良い');
        expect(translateMoodRating(5)).toBe('とても良い');
    });

    it('returns empty string for out-of-range ratings', () => {
        expect(translateMoodRating(0)).toBe('');
        expect(translateMoodRating(6)).toBe('');
        expect(translateMoodRating(-1)).toBe('');
    });
});

describe('date formatting', () => {
    const testDate = new Date('2024-03-15T14:30:00');

    beforeEach(async () => {
        await resetI18n();
        await initI18n('ja');
    });

    it('uses Japanese format in ja locale', async () => {
        const formatted = formatDate(testDate);
        expect(formatted).toContain('2024');
        expect(formatted).toContain('03');
        expect(formatted).toContain('15');
        expect(formatted).toContain('14:30');
    });

    it('uses English format in en locale', async () => {
        await changeLanguage('en');
        const formatted = formatDate(testDate);
        expect(formatted).toBeTruthy();
        expect(formatted).toContain('2024');
    });

    it('supports custom format', () => {
        const formatted = formatDate(testDate, 'YYYY-MM-DD');
        expect(formatted).toBe('2024-03-15');
    });
});

describe('translation namespace retrieval', () => {
    beforeEach(async () => {
        await resetI18n();
        await initI18n('ja');
    });

    it('retrieves all translations', () => {
        const translations = getTranslations();
        expect(translations).toBeDefined();
        expect(translations.commands).toBeDefined();
        expect(translations.modals).toBeDefined();
        expect(translations.settings).toBeDefined();
    });

    it('retrieves specific namespace', () => {
        const commands = getTranslations('commands');
        expect(commands.openTracker).toBe('トラッカーを開く');
        expect(commands.openHistory).toBe('履歴を開く');
    });

    it('returns empty object for nonexistent namespace', () => {
        const nonexistent = getTranslations('nonexistent.namespace');
        expect(Object.keys(nonexistent).length).toBe(0);
    });
});
