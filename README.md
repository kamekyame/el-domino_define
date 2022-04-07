# Domino用 エレクトーン 音源定義ファイル

![](https://img.shields.io/github/v/release/kamekyame/el-domino_define)
![](https://img.shields.io/github/downloads/kamekyame/el-domino_define/v1.2.0/electone.xml?color=green)

## ダウンロード

最新版のダウンロードは以下のリンクから行えます。

[Domino用音源定義ファイル - エレクトーン技術屋](https://kamekyame.github.io/el-tech/domino-define/index.html)

過去の音源定義ファイルは各releaseからダウンロードしてください。

## 使用方法

1. [electone.xml](./electone.xml)を`Domino.exe`と同じ位置にある`Module`フォルダ内にコピーする。
1. Dominoを起動(再起動)する。
1. 「ファイル」→「環境設定」→「MIDI-OUT」、任意のポートの音源を`electone`に変える

## 注意点

### コントロールチェンジマクロに関して

可変長のデータを取るメッセージには対応していません。

### マクロに関して

マクロについては、[ぱるぷ様](http://parupu.chu.jp/)が作成されたYAMAHA mu50用定義ファイルをベースに作成しています。
Dominoに標準搭載されているXG2k定義ファイルとの互換性はありません。
したがって、使用する音源定義ファイルを作成途中で変更した場合、意図しないメッセージが送信される可能性があるため、注意して使用するようにしてください。

## サンプル

[sampleフォルダ](./sample)をご覧ください。

## 対応状況

- [x] 音色情報
- [x] ドラムセット情報
  - [x] PC、Bank
  - [x] Tone (ELシリーズは未対応)
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

## Contributor

- [kamekyame](https://github.com/kamekyame)
- wakmin

## 参考元

### データ

[ELS XG拡張ボイスリスト - データライブラリ -
音楽制作会社コムコム](http://www.comcom2.com/lib/els_ext_xg_voice_list.html#113)

### xmlスキーム

[音源定義ファイルの仕様](http://5.pro.tok2.com/~mpc/ranzan86/domino/Domino129/Manual/module.htm)

## 開発者用メモ

### tools

#### `extract-mu50-ccm.ts`

[mu50.yml](./memo/mu50.xml)を読み込んで、マクロ部分のみを[mu50-ccm-utf8.txt](./data/mu50-ccm-utf8.txt)に出力するプログラムです。
変換の際に不必要なCCMを削除しています。

### `data/***.json`ファイル生成・更新方法

```console
$ deno run -A ./tools/makeJson.ts
```

### `electone.xml`ファイル生成方法

```console
$ deno task create
```
