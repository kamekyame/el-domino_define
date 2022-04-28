# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.4.0

### Added

- fix(ccm1206): バーシグナルのCCMを追加 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/28
- feat(ccm1207): XG Nativeにあたるドラムセットアップ（Part Mode）を追加 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/31
- feat(ccm510): Solo BarのEntryを追加 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/33
- feat(ccm1208-1212): スタイルファイルにある謎のSysEx.を追加 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/37

### Changed

- fix!(ccm200,503): GM ONが2系統ある問題を解消 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/32
- fix(ccm0-127): [XXX]の部分を消去 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/35
- feat!(ccm544-547,866): 2つあるSEQ SysEx.の表記を統一 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/39

### Removed

- CCM503を削除（CCM200と同機能のため統合）
- CCM545-547を削除（CCM544を同機能であるCCM866と同様にValueとGateで指定できるように変更）

### Fixed

- fix(ccm556): Fix typo by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/25

## v1.3.0

## Added

- Fix(docs): READMEにダウンロードに関する音源定義ファイルを追加 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/5
- feat: mu50のCCMを追加 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/17

## Changed

- feat(ccm): change ccm id by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/14

## Fixed

- fix(xml): 文字化けの問題を修正 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/6
- fix(ccm): ccm#601~604の名前が被っていた問題を修正 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/7
- fix(ccm): レジストバンクのSYSEXが間違っている問題を修正 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/8
- fix(ccm): ccm#745の名前の間違いを修正 by @kamekyame in
  https://github.com/kamekyame/el-domino_define/pull/11

### Added

- feat(ccm): mu50のCCMを追加 (#17)

## v1.2.0

### Added

- fix(ccm): #151 ベンド幅 を追加
- fix(pc): ELS-02のドラムセットに対応するToneを追加

## v1.1.0

- エレクトーン用音源定義ファイルリリース
