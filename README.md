# Domino用 エレクトーン 音源定義ファイル

## 使用方法

1. [electone.xml](./electone.xml)を`Domino.exe`と同じ位置にある`Module`フォルダ内にコピーする。
1. Dominoを起動(再起動)する。
1. 「ファイル」→「環境設定」→「MIDI-OUT」、任意のポートの音源を`Electone`に変える

## 対応状況

- [x] 音色情報
- [x] ドラムセット情報
- [ ] コントロールチェンジマクロ情報
- [ ] テンプレート情報
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
  - [ ] ControlChangeMacroList
    - [ ] Folder
      - [ ] CCM
        - [ ] Value,Gate
        - [ ] Entry
        - [ ] Memo
        - [ ] Data
      - [ ] CCMLink
    - [ ] FolderLink
    - [ ] Table
  - [ ] TemplateList
    - [ ] Folder
      - [ ] Template
        - [ ] Memo
        - [ ] CC
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
