# Obsidianでの手元動作検証ガイド

このガイドでは、ローカライズしたObsidian Mood Trackerプラグインを実際のObsidian環境で動作検証する方法を説明します。

## 1. 開発環境のセットアップ

### 1.1 必要なツール
- Node.js (v16以上)
- npm
- Obsidian (最新版推奨)

### 1.2 プロジェクトのセットアップ
```bash
# プロジェクトディレクトリに移動
cd obsidian-mood-tracker

# 依存関係をインストール
npm install

# i18n実装を完了（実際のコードにt()関数を適用）
# この段階では基盤のみ作成されているため、実装が必要
```

## 2. テスト用Vaultの作成

### 2.1 専用Vaultの作成
```bash
# テスト用のディレクトリを作成
mkdir ~/obsidian-test-vault
cd ~/obsidian-test-vault

# 基本的なMarkdownファイルを作成
echo "# テスト用Vault" > README.md
echo "このVaultはMood Trackerプラグインのテスト用です。" >> README.md

# 日記用のディレクトリも作成
mkdir journal
mkdir data
```

### 2.2 Obsidianで新しいVaultを開く
1. Obsidianを起動
2. 「新しいVaultを開く」→「既存のフォルダを開く」
3. `~/obsidian-test-vault`を選択
4. Vaultが開かれることを確認

## 3. プラグインのビルドとインストール

### 3.1 開発ビルドの作成
```bash
# 開発用ビルド（ソースマップ付き、ウォッチモード）
npm run dev

# または本番用ビルド
npm run build
```

### 3.2 手動インストール方法

#### Method A: シンボリックリンク（推奨）
```bash
# プラグインディレクトリを作成
mkdir -p ~/obsidian-test-vault/.obsidian/plugins/mood-tracker

# シンボリックリンクを作成（開発中の変更が自動反映される）
ln -sf "$(pwd)/main.js" ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/main.js
ln -sf "$(pwd)/manifest.json" ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/manifest.json
ln -sf "$(pwd)/styles.css" ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/styles.css
```

#### Method B: ファイルコピー
```bash
# プラグインディレクトリを作成
mkdir -p ~/obsidian-test-vault/.obsidian/plugins/mood-tracker

# ファイルをコピー
cp main.js ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/
cp manifest.json ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/
cp styles.css ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/
```

### 3.3 プラグインの有効化
1. Obsidianで`Ctrl/Cmd + ,`で設定を開く
2. 左サイドバーの「コミュニティプラグイン」をクリック
3. 「制限モードをオフにする」（初回のみ）
4. 「Mood Tracker」プラグインを見つけて有効化

## 4. i18nの動作検証手順

### 4.1 言語環境の確認
```bash
# Obsidianの言語設定を確認
# 設定 → 一般 → 言語
```

### 4.2 基本的な動作確認

#### A. リボンアイコンの確認
1. 左サイドバーにMood Trackerのアイコン（😊と📊）があることを確認
2. アイコンにマウスを乗せてツールチップを確認
   - **期待値（日本語）**: 「気分トラッカーを開く」「気分の履歴を開く」
   - **期待値（英語）**: "Open Mood Tracker", "Open Mood Tracking History"

#### B. コマンドパレットの確認
1. `Ctrl/Cmd + P`でコマンドパレットを開く
2. "mood"で検索
3. コマンド名が正しい言語で表示されることを確認
   - **期待値（日本語）**: 「トラッカーを開く」「履歴を開く」
   - **期待値（英語）**: "Open Tracker", "Open History"

#### C. 設定画面の確認
1. 設定 → コミュニティプラグイン → Mood Tracker → ⚙️（設定アイコン）
2. すべての設定項目が正しい言語で表示されることを確認

#### D. 気分トラッカーモーダルの確認
1. リボンアイコンまたはコマンドで気分トラッカーを開く
2. モーダルのすべてのテキストが正しい言語で表示されることを確認
   - タイトル
   - ボタン（保存、キャンセル）
   - フォームラベル（日時、メモ）
   - 気分評価のツールチップ

### 4.3 詳細機能の検証

#### A. 感情の翻訳確認
1. 気分トラッカーモーダルで感情セクションを確認
2. デフォルトの感情が日本語で表示されることを確認
3. 設定で感情を追加し、カスタム感情は翻訳されないことを確認

#### B. 統計・履歴画面の確認
1. 履歴アイコンをクリック
2. 統計情報のラベルが正しい言語で表示されることを確認
   - 平均気分
   - 最も多い気分
   - 最も多い感情

#### C. 日付フォーマットの確認
1. エントリーを作成し、日付表示を確認
2. 履歴画面で日付が正しい形式で表示されることを確認
   - **日本語**: 2024年03月15日 14:30
   - **英語**: March 15, 2024 2:30 PM

### 4.4 エラーケースの確認
1. 無効な設定を入力してエラーメッセージを確認
2. 削除操作で確認ダイアログの言語を確認
3. ファイル操作エラー時の通知言語を確認

## 5. デバッグとトラブルシューティング

### 5.1 開発者コンソールの活用
```javascript
// Obsidianの開発者コンソール（Ctrl/Cmd + Shift + I）を開いて実行

// プラグインインスタンスを取得
const plugin = app.plugins.plugins['mood-tracker'];

// 現在の言語を確認
console.log('Current language:', plugin.getCurrentLanguage());

// 特定の翻訳を確認
console.log('Translation test:', plugin.t('commands.openTracker'));

// 全翻訳の確認
console.log('All translations:', plugin.getTranslations());

// 言語を手動で切り替え
await plugin.changeLanguage('ja');
console.log('Changed to Japanese');

await plugin.changeLanguage('en');
console.log('Changed to English');

// 感情翻訳のテスト
console.log('Emotion translation:', plugin.translateEmotion('happy'));
```

### 5.2 よくある問題と解決方法

#### 問題1: プラグインが表示されない
```bash
# プラグインファイルの存在確認
ls -la ~/obsidian-test-vault/.obsidian/plugins/mood-tracker/

# 期待されるファイル:
# - main.js
# - manifest.json  
# - styles.css (オプション)
```

#### 問題2: 翻訳が表示されない
- i18nが正しく初期化されているか確認
- 翻訳ファイル（en.json, ja.json）がビルドに含まれているか確認
- ブラウザのコンソールでエラーがないか確認

#### 問題3: 日本語が文字化けする
- ファイルのエンコーディングがUTF-8か確認
- Obsidianのフォント設定を確認

#### 問題4: 日本語でレイアウトが崩れる
- 日本語テキストの長さに合わせてCSSを調整
- 必要に応じて文字数制限や省略記号を追加

### 5.3 ログとデバッグ情報の確認
```bash
# Obsidianのログファイル（macOS）
tail -f ~/Library/Application\ Support/obsidian/logs/main.log

# Obsidianのログファイル（Windows）
# %APPDATA%\obsidian\logs\main.log

# Obsidianのログファイル（Linux）  
# ~/.config/obsidian/logs/main.log
```

## 6. 自動テストとの組み合わせ

### 6.1 開発フロー
```bash
# 1. 自動テストを実行
npm run test:i18n

# 2. ビルド
npm run build

# 3. 手動テスト（この手順に従って）

# 4. 問題があれば修正して1に戻る
```

### 6.2 継続的な検証
- コード変更後は必ず手動テストも実行
- 新機能追加時は翻訳も追加
- 定期的に両言語での動作確認

## 7. 検証チェックリスト

### 基本動作
- [ ] プラグインがロードされる
- [ ] リボンアイコンが表示される
- [ ] コマンドパレットに項目が表示される
- [ ] 設定画面が開く

### 日本語環境
- [ ] すべてのUIテキストが日本語
- [ ] 感情が日本語で表示される
- [ ] 日付が日本式フォーマット
- [ ] 通知メッセージが日本語

### 英語環境
- [ ] すべてのUIテキストが英語  
- [ ] 感情が英語で表示される
- [ ] 日付が英語式フォーマット
- [ ] 通知メッセージが英語

### データ整合性
- [ ] 言語切り替えでデータが失われない
- [ ] カスタム感情が翻訳されない
- [ ] 既存データとの互換性

## 8. リリース前の最終確認

### 8.1 複数環境での確認
- Windows + 日本語環境
- macOS + 日本語環境  
- Linux + 英語環境

### 8.2 パフォーマンステスト
- 大量データでの動作確認
- 言語切り替えの応答時間
- メモリリークの確認

### 8.3 ユーザビリティテスト
- 日本語ユーザーにとって自然な表現か
- UIレイアウトに問題ないか
- 操作フローに違和感ないか

この手順に従って検証することで、ローカライズ版プラグインの品質を確保できます。