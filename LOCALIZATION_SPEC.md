# Obsidian Mood Tracker - 日本語ローカライズ仕様書

## 1. 概要

このドキュメントは、Obsidian Mood TrackerプラグインをJavascript/TypeScriptの国際化(i18n)フレームワークを使用して日本語にローカライズするための仕様を定義します。

## 2. 技術スタック

### 推奨ライブラリ
- **i18next**: 軽量で柔軟なi18nライブラリ
- **svelte-i18n**: Svelteコンポーネント用のi18nサポート

### 選定理由
- Obsidianプラグインのバンドルサイズを最小限に抑える
- TypeScriptとの優れた統合
- Svelteコンポーネントとの互換性
- 動的な言語切り替えのサポート

## 3. ファイル構造

```
src/
├── i18n/
│   ├── index.ts           # i18n初期化と設定
│   ├── locales/
│   │   ├── en.json        # 英語（デフォルト）
│   │   └── ja.json        # 日本語
│   └── types.ts           # 型定義
├── main.ts                # i18n初期化を追加
└── ...
```

## 4. 実装アーキテクチャ

### 4.1 初期化フロー
1. プラグイン起動時にObsidianのロケール設定を取得
2. 対応する言語ファイルをロード
3. フォールバック言語として英語を設定

### 4.2 言語検出
```typescript
// Obsidianのロケールを取得
const locale = window.moment?.locale() || 'en';
// 対応言語にマッピング
const language = locale.startsWith('ja') ? 'ja' : 'en';
```

### 4.3 設定での言語切り替え
- 設定タブに言語選択オプションを追加
- ユーザーが手動で言語を上書きできる

## 5. ローカライズ対象項目

### 5.1 UI文字列

#### コマンド・リボンアイコン
- "Open Mood Tracker" → "気分トラッカーを開く"
- "Open Mood Tracking History" → "気分の履歴を開く"
- "Open Tracker" → "トラッカーを開く"
- "Open History" → "履歴を開く"

#### モーダルタイトル
- "How are you feeling?" → "今の気分はどうですか？"
- "Mood Tracking History" → "気分の履歴"
- "Delete Entry" → "エントリーを削除"
- "Edit Emotion Group" → "感情グループを編集"
- "Delete Emotion Group" → "感情グループを削除"

#### ボタンラベル
- "Save" → "保存"
- "Cancel" → "キャンセル"
- "Delete" → "削除"
- "Add" → "追加"
- "Edit" → "編集"
- "Confirm" → "確認"
- "Move" → "移動"

#### 設定項目
- "Tracker modal title" → "トラッカーモーダルのタイトル"
- "Folder to store data file" → "データファイルを保存するフォルダ"
- "Mood Rating Labels" → "気分評価ラベル"
- "Add to journal" → "ジャーナルに追加"
- "Journal path pattern" → "ジャーナルパスパターン"
- "Entry template" → "エントリーテンプレート"
- "Chart color" → "グラフの色"
- "Use emotions" → "感情を使用"
- "Sort emotions alphabetically" → "感情をアルファベット順に並べ替え"

#### フォームラベル
- "Date and time" → "日時"
- "Note" → "メモ"
- "Name" → "名前"
- "Color" → "色"
- "Emotions" → "感情"
- "Add new emotion" → "新しい感情を追加"

#### 統計・グラフ
- "Average mood" → "平均気分"
- "Most common mood" → "最も多い気分"
- "Most common emotions" → "最も多い感情"
- "No entries found" → "エントリーが見つかりません"
- "No data available" → "データがありません"

### 5.2 気分評価ラベル（デフォルト）
- "very bad" → "とても悪い"
- "bad" → "悪い"
- "ok" → "普通"
- "good" → "良い"
- "very good" → "とても良い"

### 5.3 感情グループ（デフォルト）

#### グループ名
- "Love and joy" → "愛と喜び"
- "Neutral and surprise" → "中立と驚き"
- "Anger and stress" → "怒りとストレス"
- "Sadness and fear" → "悲しみと恐れ"

#### 感情リスト
感情リストは膨大なため、主要な感情の翻訳例：

**Love and joy グループ**
- joyful → 喜んでいる
- content → 満足している
- pleased → 嬉しい
- happy → 幸せ
- excited → 興奮している
- loving → 愛情深い
- peaceful → 平和的

**Neutral and surprise グループ**
- ok → まあまあ
- fine → 大丈夫
- bored → 退屈
- surprised → 驚いた
- confused → 困惑している

**Anger and stress グループ**
- stressed → ストレス
- angry → 怒っている
- frustrated → イライラしている
- irritated → 苛立っている
- annoyed → うんざりしている

**Sadness and fear グループ**
- sad → 悲しい
- depressed → 憂鬱
- disappointed → 失望している
- lonely → 寂しい
- anxious → 不安
- worried → 心配している

### 5.4 通知メッセージ
- "Entry saved successfully" → "エントリーが正常に保存されました"
- "Entry deleted" → "エントリーが削除されました"
- "Settings saved" → "設定が保存されました"
- "Error saving data" → "データの保存中にエラーが発生しました"
- "Folder does not exist" → "フォルダが存在しません"

### 5.5 日付フォーマット
- 日本語環境では日付を "YYYY年MM月DD日" 形式で表示
- 時刻は24時間表記を使用

## 6. 実装段階

### Phase 1: 基盤構築
1. i18nextのセットアップ
2. 言語ファイルの構造定義
3. TypeScript型定義の作成

### Phase 2: コア機能のローカライズ
1. メインUIコンポーネントの翻訳
2. 設定画面の翻訳
3. コマンド・リボンアイコンの翻訳

### Phase 3: 詳細機能のローカライズ
1. 統計・グラフ関連の翻訳
2. 通知メッセージの翻訳
3. エラーメッセージの翻訳

### Phase 4: デフォルトデータのローカライズ
1. 感情グループ名の翻訳
2. 感情リストの翻訳（ユーザーがカスタマイズ可能な形で）

### Phase 5: テストと改善
1. 言語切り替えのテスト
2. UIレイアウトの調整（文字長の違いに対応）
3. ユーザーフィードバックの反映

## 7. 考慮事項

### 7.1 後方互換性
- 既存のデータファイルとの互換性を維持
- 感情名は内部的に英語のキーを保持し、表示時に翻訳

### 7.2 カスタマイズ性
- ユーザーが追加した感情グループ・感情は翻訳されない
- デフォルトの感情のみ翻訳を提供

### 7.3 パフォーマンス
- 言語ファイルは必要に応じて遅延ロード
- バンドルサイズへの影響を最小限に

### 7.4 メンテナンス性
- 翻訳キーは階層構造で整理
- 新機能追加時の翻訳追加が容易

## 8. 実装例

### i18n初期化 (src/i18n/index.ts)
```typescript
import i18next from 'i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

export async function initI18n(locale: string) {
    await i18next.init({
        lng: locale.startsWith('ja') ? 'ja' : 'en',
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            ja: { translation: ja }
        }
    });
}

export const t = i18next.t.bind(i18next);
```

### 言語ファイル構造 (src/i18n/locales/ja.json)
```json
{
    "commands": {
        "openTracker": "気分トラッカーを開く",
        "openHistory": "気分の履歴を開く"
    },
    "modals": {
        "tracker": {
            "title": "今の気分はどうですか？",
            "save": "保存",
            "cancel": "キャンセル"
        }
    },
    "settings": {
        "trackerModalTitle": {
            "name": "トラッカーモーダルのタイトル",
            "desc": "気分トラッカーモーダルのタイトル"
        }
    },
    "emotions": {
        "groups": {
            "loveAndJoy": "愛と喜び",
            "neutralAndSurprise": "中立と驚き"
        },
        "list": {
            "happy": "幸せ",
            "sad": "悲しい"
        }
    }
}
```

## 9. 今後の拡張

- 他言語への対応（中国語、韓国語、スペイン語など）
- RTL言語のサポート
- 地域別のカスタマイズ（日付形式、数値形式など）