# Domino用 エレクトーン 音源定義ファイル

![](https://img.shields.io/badge/version-1.1.0-orange)

## 使用方法

1. [electone.xml](./electone.xml)を`Domino.exe`と同じ位置にある`Module`フォルダ内にコピーする。
1. Dominoを起動(再起動)する。
1. 「ファイル」→「環境設定」→「MIDI-OUT」、任意のポートの音源を`electone`に変える

## 注意点
### コントロールチェンジマクロに関して
可変長のデータを取るメッセージには対応していません。

### エクスクルーシブメッセージに関して
Dominoに標準搭載されているXG2k定義ファイルなどとの互換性はありません。
したがって、使用する音源定義ファイルを作成途中で変更した場合、意図しないメッセージが送信される可能性があるため、注意して使用するようにしてください。

## サンプル
[sampleフォルダ](./sample)をご覧ください。

## 対応状況

- [x] 音色情報
- [ ] ドラムセット情報
  - [x] PC、Bank
  - [ ] Tone
- [ ] コントロールチェンジマクロ情報
  - [x] チャンネルメッセージ
  - [ ] エクスクルーシブメッセージ
    - [x] ユニバーサルリアルタイムメッセージ
    - [x] ユニバーサルノンリアルタイムメッセージ
    - [ ] XGネイティブ
    - [x] クラビノーバエクスクルーシブ
    - [x] メッセージエクスクルーシブ
    - [x] エレクトーンエクスクルーシブ
- [x] テンプレート情報
  - [x] SEQ.1~4まで点灯
- [ ] デフォルトデータ情報

### Domino用音源定義クラス

- [x] XMLヘッダー
- [x] ModuleData
  - [x] InstrumentList
    - [x] Map
      - [x] PC
        - [x] Bank
  - [x] DrumSetList
    - [x] Map
      - [x] PC
        - [x] Bank
          - [x] Tone
  - [x] ControlChangeMacroList
    - [x] Folder
      - [x] CCM
        - [x] Value,Gate
          - [x] Entry
        - [x] Memo
        - [x] Data
      - [ ] CCMLink
    - [ ] FolderLink
    - [x] Table
  - [x] TemplateList
    - [x] Folder
      - [x] Template
        - [ ] Memo
        - [x] CC
        - [ ] PC
        - [ ] Comment
  - [ ] DefaultData
    - [ ] Mark
    - [ ] Track
      - [ ] CC
      - [ ] PC
      - [ ] Comment
      - [ ] Template
      - [ ] EOT

## 参考元

### データ

[ELS XG拡張ボイスリスト - データライブラリ -
音楽制作会社コムコム](http://www.comcom2.com/lib/els_ext_xg_voice_list.html#113)

### xmlスキーム

[音源定義ファイルの仕様](http://5.pro.tok2.com/~mpc/ranzan86/domino/Domino129/Manual/module.htm)

## メモ

xmlファイル生成方法

```console
$ deno run -A ./tools/make.ts
```