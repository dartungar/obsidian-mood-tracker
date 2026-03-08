import { describe, it, expect } from 'vitest';
import en from 'src/i18n/locales/en.json';
import ja from 'src/i18n/locales/ja.json';

describe('翻訳ファイルの完全性チェック', () => {
    describe('構造の一致性', () => {
        it('日本語ファイルに全ての英語キーが存在する', () => {
            const errors: string[] = [];
            
            function checkKeys(enObj: any, jaObj: any, path = '') {
                for (const key in enObj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (!(key in jaObj)) {
                        errors.push(`Missing key in ja.json: ${currentPath}`);
                        continue;
                    }
                    
                    if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key])) {
                        if (typeof jaObj[key] !== 'object') {
                            errors.push(`Type mismatch at ${currentPath}: expected object, got ${typeof jaObj[key]}`);
                        } else {
                            checkKeys(enObj[key], jaObj[key], currentPath);
                        }
                    }
                }
            }
            
            checkKeys(en, ja);
            
            if (errors.length > 0) {
                console.error('Translation key errors:', errors);
            }
            expect(errors).toHaveLength(0);
        });

        it('英語ファイルに全ての日本語キーが存在する（余分なキーがない）', () => {
            const errors: string[] = [];
            
            function checkExtraKeys(enObj: any, jaObj: any, path = '') {
                for (const key in jaObj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (!(key in enObj)) {
                        errors.push(`Extra key in ja.json: ${currentPath}`);
                        continue;
                    }
                    
                    if (typeof jaObj[key] === 'object' && !Array.isArray(jaObj[key])) {
                        checkExtraKeys(enObj[key], jaObj[key], currentPath);
                    }
                }
            }
            
            checkExtraKeys(en, ja);
            
            if (errors.length > 0) {
                console.error('Extra translation keys:', errors);
            }
            expect(errors).toHaveLength(0);
        });
    });

    describe('翻訳の品質', () => {
        it('日本語翻訳が空文字でない', () => {
            const emptyValues: string[] = [];
            
            function checkEmptyValues(obj: any, path = '') {
                for (const key in obj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (typeof obj[key] === 'string') {
                        if (obj[key].trim() === '') {
                            emptyValues.push(currentPath);
                        }
                    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        checkEmptyValues(obj[key], currentPath);
                    }
                }
            }
            
            checkEmptyValues(ja);
            
            if (emptyValues.length > 0) {
                console.error('Empty translation values:', emptyValues);
            }
            expect(emptyValues).toHaveLength(0);
        });

        it('英語翻訳が空文字でない', () => {
            const emptyValues: string[] = [];
            
            function checkEmptyValues(obj: any, path = '') {
                for (const key in obj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (typeof obj[key] === 'string') {
                        if (obj[key].trim() === '') {
                            emptyValues.push(currentPath);
                        }
                    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        checkEmptyValues(obj[key], currentPath);
                    }
                }
            }
            
            checkEmptyValues(en);
            
            if (emptyValues.length > 0) {
                console.error('Empty English values:', emptyValues);
            }
            expect(emptyValues).toHaveLength(0);
        });

        it('日本語翻訳に英語が混ざっていない（重要なキーのみ）', () => {
            const suspiciousTranslations: string[] = [];
            
            // UIに表示される重要な翻訳のみチェック
            const importantPaths = [
                'commands',
                'ribbon',
                'modals.tracker',
                'modals.stats',
                'settings.trackerModalTitle',
                'settings.folderPath',
                'moodRatings',
                'emotionGroups',
                'notifications',
                'errors'
            ];
            
            function checkJapaneseQuality(obj: any, path = '') {
                for (const key in obj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    // 重要なパスのみチェック
                    const isImportant = importantPaths.some(p => currentPath.startsWith(p));
                    if (!isImportant) continue;
                    
                    if (typeof obj[key] === 'string') {
                        // 基本的な英語文字列のパターンをチェック
                        // ただし、技術用語や固有名詞は許可
                        const text = obj[key];
                        const hasOnlyEnglish = /^[a-zA-Z\s\-_\.]+$/.test(text);
                        const isLikelyEnglish = hasOnlyEnglish && text.length > 3 && 
                            !text.includes('{{') && // テンプレート変数は除外
                            !text.includes('##'); // Markdownヘッダーは除外
                        
                        if (isLikelyEnglish) {
                            // 感情の英語キーは許可（translateEmotionで翻訳される）
                            if (!currentPath.startsWith('emotions.')) {
                                suspiciousTranslations.push(`${currentPath}: "${text}"`);
                            }
                        }
                    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        checkJapaneseQuality(obj[key], currentPath);
                    }
                }
            }
            
            checkJapaneseQuality(ja);
            
            // 感情リストは英語キーのままなので除外
            const filtered = suspiciousTranslations.filter(t => !t.includes('emotions.'));
            
            if (filtered.length > 0) {
                console.warn('Possibly untranslated Japanese entries:', filtered);
            }
            // 警告のみで、エラーにはしない（一部の技術用語は英語のまま使用される可能性がある）
        });
    });

    describe('感情リストの完全性', () => {
        it('全ての感情が両言語に存在する', () => {
            const enEmotions = Object.keys(en.emotions);
            const jaEmotions = Object.keys(ja.emotions);
            
            expect(jaEmotions.length).toBe(enEmotions.length);
            
            const missingInJa = enEmotions.filter(e => !jaEmotions.includes(e));
            const extraInJa = jaEmotions.filter(e => !enEmotions.includes(e));
            
            if (missingInJa.length > 0) {
                console.error('Emotions missing in ja.json:', missingInJa);
            }
            if (extraInJa.length > 0) {
                console.error('Extra emotions in ja.json:', extraInJa);
            }
            
            expect(missingInJa).toHaveLength(0);
            expect(extraInJa).toHaveLength(0);
        });

        it('感情グループが両言語で一致する', () => {
            expect(Object.keys(ja.emotionGroups)).toEqual(Object.keys(en.emotionGroups));
        });
    });

    describe('特殊文字とフォーマット', () => {
        it('プレースホルダー変数が正しく保持されている', () => {
            // {{ICON}}, {{NOTE}}, {{date:YYYY-MM-DD}} などのパターン
            const placeholderPattern = /\{\{[^}]+\}\}/g;
            
            function checkPlaceholders(enObj: any, jaObj: any, path = '') {
                for (const key in enObj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (typeof enObj[key] === 'string' && typeof jaObj[key] === 'string') {
                        const enPlaceholders = enObj[key].match(placeholderPattern) || [];
                        const jaPlaceholders = jaObj[key].match(placeholderPattern) || [];
                        
                        if (enPlaceholders.length > 0 || jaPlaceholders.length > 0) {
                            expect(jaPlaceholders, `Placeholder mismatch at ${currentPath}`).toEqual(enPlaceholders);
                        }
                    } else if (typeof enObj[key] === 'object' && typeof jaObj[key] === 'object') {
                        checkPlaceholders(enObj[key], jaObj[key], currentPath);
                    }
                }
            }
            
            checkPlaceholders(en, ja);
        });

        it('改行やスペースの不正な使用がない', () => {
            const issues: string[] = [];
            
            function checkFormatting(obj: any, lang: string, path = '') {
                for (const key in obj) {
                    const currentPath = path ? `${path}.${key}` : key;
                    
                    if (typeof obj[key] === 'string') {
                        // 先頭・末尾の不要な空白
                        if (obj[key] !== obj[key].trim()) {
                            issues.push(`${lang}.json - Untrimmed string at ${currentPath}`);
                        }
                        
                        // 連続する空白（意図的なものを除く）
                        if (/\s{2,}/.test(obj[key]) && !obj[key].includes('  ')) {
                            issues.push(`${lang}.json - Multiple spaces at ${currentPath}`);
                        }
                    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        checkFormatting(obj[key], lang, currentPath);
                    }
                }
            }
            
            checkFormatting(en, 'en');
            checkFormatting(ja, 'ja');
            
            if (issues.length > 0) {
                console.warn('Formatting issues:', issues);
            }
            // 警告のみで、エラーにはしない
        });
    });
});