

## [3.0.2](https://github.com/TGiles/auto-lighthouse/compare/3.0.1...3.0.2) (2022-08-18)

## [3.0.1](https://github.com/TGiles/auto-lighthouse/compare/3.0.0...3.0.1) (2022-03-20)

**Node 12 is no longer supported as of 3.0.0.**
Fixes release mismatch between GitHub and NPM.
Note, there is no 3.0.0 release available because of this.
## [3.0.0](https://github.com/TGiles/auto-lighthouse/compare/2.0.5...3.0.0) (2022-03-20)


### Bug Fixes

* check if chrome or chromium is installed before trying to run ([2524887](https://github.com/TGiles/auto-lighthouse/commit/2524887858cdbe3686d956de4997ad77f478703c))
* throw errors instead of just logging them ([0b82f33](https://github.com/TGiles/auto-lighthouse/commit/0b82f33c2ef46ac9cbd0321a488f33277d3db6ed))


* build!: drop node 12 support ([12ff14c](https://github.com/TGiles/auto-lighthouse/commit/12ff14c0de1ad8c49e2fdcfee5e3f7279363c914))


### BREAKING CHANGES

* drop support for Node 12 [2.0.5](https://github.com/TGiles/auto-lighthouse/compare/2.0.4...2.0.5) (2021-11-30)


### Bug Fixes

* fix generateReport module path ([1e3d676](https://github.com/TGiles/auto-lighthouse/commit/1e3d67630d73ad2b8a9685fe67b63c97cd8512ca))

## [2.0.4](https://github.com/TGiles/auto-lighthouse/compare/2.0.3...2.0.4) (2021-08-05)

* build(deps-dev): bump @release-it/conventional-changelog (#260) (1ead7ea)
* build(deps-dev): bump release-it from 14.8.0 to 14.9.0 (#261) (0a01dba)
* build(deps): bump normalize-url from 4.5.0 to 4.5.1 (#258) (ed90497)
* build(deps-dev): bump release-it from 14.7.0 to 14.8.0 (#256) (e169f41)
* build(deps): bump chrome-launcher from 0.13.4 to 0.14.0 (#248) (4340584)
* build(deps): bump open from 8.0.9 to 8.2.0 (#251) (414bf41)
* chore: fix husky and commitlint due to husky 6 changes (#255) (5d9a34c)
* build(deps-dev): bump release-it from 14.6.2 to 14.7.0 (#252) (b64ae7d)
* build(deps): bump lighthouse from 7.5.0 to 8.0.0 (#254) (7692252)
* Fix cli-version, does not have options when called via cli (#249) (d7122e6)
* Update bug_report.md (287769d)
* build(deps): bump lighthouse from 7.4.0 to 7.5.0 (#247) (dc51894)
* build(deps): bump open from 8.0.8 to 8.0.9 (#246) (ba23873)
* build(deps-dev): bump @commitlint/cli from 12.1.1 to 12.1.4 (#244) (e5f2d47)
* build(deps-dev): bump @commitlint/config-conventional (#243) (0136dd5)

* build(deps): bump hosted-git-info from 2.8.4 to 2.8.9 (#242) (1e01adf)
* build(deps): bump lodash from 4.17.19 to 4.17.21 (#241) (d9fd69b)
* build(deps-dev): bump release-it from 14.6.1 to 14.6.2 (#240) (9f1b4e8)
* build(deps): bump open from 8.0.7 to 8.0.8 (#239) (429e292)
* Upgrade to GitHub-native Dependabot (#238) (d1f7d2a)
* build(deps): bump open from 8.0.6 to 8.0.7 (#237) (5b575eb)
* build(deps): bump lighthouse from 7.3.0 to 7.4.0 (#236) (6547ef0)
* build(deps): bump open from 8.0.5 to 8.0.6 (#235) (b4315e9)
* build(deps-dev): bump release-it from 14.5.1 to 14.6.1 (#234) (0f81b71)

* fix: fix emulation flags due to Lighthouse v7 update (#233) (4e42b0f)
* build(deps): bump open from 8.0.4 to 8.0.5 (#232) (c12b0e1)
* build(deps-dev): bump release-it from 14.5.0 to 14.5.1 (#230) (ee780df)
* build(deps-dev): bump @commitlint/config-conventional (#231) (d864d50)
* build(deps-dev): bump @commitlint/cli from 12.0.1 to 12.1.1 (#229) (d44b584)
* build(deps-dev): bump husky from 5.2.0 to 6.0.0 (#228) (ff7c392)
* build(deps): [security] bump y18n from 4.0.0 to 4.0.1 (#227) (e422a7f)
* build(deps-dev): bump husky from 5.1.3 to 5.2.0 (#225) (54f09ce)
* build(deps-dev): bump release-it from 14.4.1 to 14.5.0 (#224) (dbcd2c4)
* build(deps): bump commander from 7.1.0 to 7.2.0 (#223) (e2a705e)
* build(deps): bump open from 8.0.3 to 8.0.4 (#226) (aad5ab0)
* build(deps): bump lighthouse from 7.2.0 to 7.3.0 (#222) (5d81e0b)
* build(deps): bump open from 8.0.2 to 8.0.3 (#221) (7be7175)
* build(deps-dev): bump jasmine from 3.6.4 to 3.7.0 (#220) (ec5838a)
* build(deps): bump open from 7.4.2 to 8.0.2 (#219) (a9b3c7d)
* build(deps-dev): bump husky from 5.1.2 to 5.1.3 (#217) (6d29825)
* build(deps-dev): bump husky from 5.1.1 to 5.1.2 (#213) (bf7d6d4)
* build(deps): bump urijs from 1.19.5 to 1.19.6 (#215) (d250865)
* build(deps-dev): bump @commitlint/cli from 12.0.0 to 12.0.1 (#212) (e6053cd)
* build(deps-dev): bump @commitlint/config-conventional (#214) (110ddd6)
* build(deps): bump lighthouse from 7.1.0 to 7.2.0 (#211) (ebcf147)
* build(deps-dev): bump husky from 5.1.0 to 5.1.1 (#209) (fafd224)
* build(deps-dev): bump @commitlint/cli from 11.0.0 to 12.0.0 (#210) (6319cc6)
* build(deps-dev): bump @commitlint/config-conventional (#208) (babc2c7)
* build(deps-dev): bump @release-it/conventional-changelog (#207) (80ace15)
* build(deps-dev): bump husky from 5.0.9 to 5.1.0 (#206) (8ad71e5)
* build(deps-dev): bump release-it from 14.4.0 to 14.4.1 (#205) (4722cfc)
* build(deps): bump open from 7.4.1 to 7.4.2 (#204) (e3cb7ca)
* fix: add missing semicolons (#203) (7159945)
* build(deps-dev): bump release-it from 14.3.0 to 14.4.0 (#201) (335cbf6)
* build(deps): bump open from 7.4.0 to 7.4.1 (#200) (64cf2dd)
* build(deps): bump commander from 6.2.1 to 7.1.0 (#202) (67219a1)
* build(deps): bump lighthouse from 7.0.1 to 7.1.0 (#199) (1d30945)

* build(deps-dev): bump husky from 4.3.8 to 5.0.9 (#198) (3f48b75)
* build(deps): bump open from 7.3.1 to 7.4.0 (#196) (092f2ed)
* build(deps-dev): bump release-it from 14.2.2 to 14.3.0 (#197) (443e4b0)
* build(deps): bump cli-progress from 3.8.2 to 3.9.0 (#194) (e895908)
* build(deps): bump lighthouse from 7.0.0 to 7.0.1 (#193) (c313a4d)
* build(deps-dev): bump jasmine from 3.6.3 to 3.6.4 (#192) (fec8341)
* build(deps-dev): bump husky from 4.3.7 to 4.3.8 (#191) (9d2ee5a)
* build(deps): bump open from 7.3.0 to 7.3.1 (#189) (3ba343a)
* build(deps-dev): bump husky from 4.3.6 to 4.3.7 (#188) (7c43b2b)
* build(deps): [security] bump urijs from 1.19.2 to 1.19.5 (#187) (223e690)
* build!: update lighthouse to 7.0.0 (#186) (ddeaefd)

* feat: add silent and verbose modes, add spinner and loading bars (#185) (a400ca7)
* feat: add device CLI flag (#183) (e02915a)
* fix: fix CLI not parsing multiple starting URLs (#184) (b8eccc9)
* ci: add node 14 job (#179) (9a6d5ed)
* build(deps): bump commander from 6.2.0 to 6.2.1 (#176) (7a6f089)
* build(deps-dev): bump husky from 4.3.5 to 4.3.6 (#177) (7d4d3ae)
* build(deps): [security] bump ini from 1.3.5 to 1.3.7 (#175) (f88c994)
* build(deps-dev): bump husky from 4.3.0 to 4.3.5 (#173) (4b3a50e)
* build(deps-dev): bump release-it from 14.2.1 to 14.2.2 (#171) (060d46e)
* build(deps): bump lighthouse from 6.4.1 to 6.5.0 (#172) (bb849b7)

* fix: ensure write streams are closed before leaving CSV aggregation function (#170) (0de43b6)
* build(deps-dev): bump release-it from 14.2.0 to 14.2.1 (#169) (086cc44)
* build(deps-dev): bump jasmine from 3.6.2 to 3.6.3 (#168) (1e00211)
* build(deps): bump commander from 6.1.0 to 6.2.0 (#167) (7528577)
* build(deps-dev): bump release-it from 14.1.0 to 14.2.0 (#166) (38e5fb4)
* build(deps-dev): bump jasmine from 3.6.1 to 3.6.2 (#165) (23ed4df)

* build(deps-dev): bump release-it from 14.0.4 to 14.1.0 (#164) (4bab439)
* build(deps-dev): bump release-it from 14.0.3 to 14.0.4 (#163) (e3ff7fa)
* build(deps): bump lighthouse from 6.3.0 to 6.4.1 (#162) (f3a00c3)
* build(deps): bump open from 7.2.1 to 7.3.0 (#161) (d7b695d)
* build(deps-dev): bump release-it from 14.0.2 to 14.0.3 (#159) (8fc9322)
* build(deps-dev): bump @commitlint/cli from 9.1.2 to 11.0.0 (#160) (d10d34a)
* refactor: reduce tech debt and complexity (#158) (ae198f2)

* ci: fix forks not being able to use labeler action (1aa19bd)
* refactor: make output names prettier (#157) (0362ca1)
* build(deps-dev): bump @release-it/conventional-changelog (#156) (ff15a41)
* build(deps-dev): bump @commitlint/config-conventional (#154) (9b19d6c)
* build(deps-dev): bump release-it from 13.7.0 to 14.0.2 (#155) (6c37514)
* build(deps-dev): bump husky from 4.2.5 to 4.3.0 (#153) (7377f0f)
* build(deps): bump open from 7.2.0 to 7.2.1 (#150) (0c74af3)
* build(deps): bump lighthouse from 6.2.0 to 6.3.0 (#149) (d90f063)
* build(deps): bump commander from 6.0.0 to 6.1.0 (#151) (f00e2e4)
* build(deps-dev): bump release-it from 13.6.8 to 13.7.0 (#148) (d4141ca)
* build(deps): bump open from 7.1.0 to 7.2.0 (#147) (4cbb069)
* build(deps-dev): bump release-it from 13.6.7 to 13.6.8 (#145) (c25ee81)

* fix: fix intermittent test failure (#144) (bb6a0c9)
* build(deps-dev): bump release-it from 13.6.6 to 13.6.7 (#139) (f666239)
* fix: fix timing issue in test (#143) (96429ce)
* fix: fix path parsing logic in test (#141) (50a48d7)
* build(deps-dev): bump @commitlint/config-conventional (#140) (4b4f1d5)
* build(deps): bump lighthouse from 6.1.1 to 6.2.0 (#138) (c7c6f42)
* build(deps-dev): bump release-it from 13.6.5 to 13.6.6 (#136) (e281031)
* build(deps-dev): bump jasmine from 3.5.0 to 3.6.1 (#137) (3737c1c)
* build(deps): bump open from 7.0.4 to 7.1.0 (#132) (e102e91)
* build(deps): bump commander from 5.1.0 to 6.0.0 (#131) (b2ed564)

* feat: add aggregation for csv (#130) (fd1e0fe)
* build(deps): [security] bump lodash from 4.17.15 to 4.17.19 (#129) (e451700)
* build(deps-dev): bump @commitlint/config-conventional (#126) (d56f493)
* build(deps-dev): bump @commitlint/cli from 9.0.1 to 9.1.1 (#127) (8029b31)

* build(deps-dev): bump release-it from 13.6.4 to 13.6.5 (#125) (3714160)
* build(deps): bump lighthouse from 6.1.0 to 6.1.1 (#124) (4520fbb)
* build(deps): bump chrome-launcher from 0.13.3 to 0.13.4 (#123) (8d4a1e9)
* build(deps-dev): bump release-it from 13.6.3 to 13.6.4 (#122) (ddc97f5)
* build(deps): bump lighthouse from 6.0.0 to 6.1.0 (#121) (67b8ab3)
* build(deps-dev): bump @commitlint/cli from 8.3.5 to 9.0.1 (#119) (2194708)
* build(deps-dev): bump @commitlint/config-conventional (#120) (67d59a7)

* build(deps-dev): bump release-it from 13.6.2 to 13.6.3 (#118) (501e078)
* build(deps): bump chrome-launcher from 0.13.2 to 0.13.3 (#117) (292ed24)

* docs: update README (e876ce2)
* build(deps-dev): bump release-it from 13.6.1 to 13.6.2 (#116) (4b83c66)
* build(deps-dev): bump nyc from 15.0.1 to 15.1.0 (#114) (e273a62)
* fix: update README.md (#115) (937069f)

* feat: add default help, thread option, fix blacklist regex (#113) (f0341c3)
* fix: add more extentions to the blacklist like audio and video files (#111) (e79a25c)
* build(deps): bump lighthouse from 5.6.0 to 6.0.0 (#110) (f9e7de0)
* build(deps): bump open from 7.0.3 to 7.0.4 (#108) (92ded81)
* build(deps-dev): bump release-it from 13.5.8 to 13.6.1 (#109) (1cd72b3)

## [1.1.7](https://github.com/TGiles/auto-lighthouse/compare/1.1.6...1.1.7) (2020-05-12)

## [1.1.6](https://github.com/TGiles/auto-lighthouse/compare/1.1.5...1.1.6) (2020-04-18)


### Reverts

* Revert "build: update dependencies" ([00e4857](https://github.com/TGiles/auto-lighthouse/commit/00e4857a6db98761019c18e25813b7e73a34a732))

## [1.1.5](https://github.com/TGiles/auto-lighthouse/compare/1.1.4...1.1.5) (2020-04-02)

## [1.1.4](https://github.com/TGiles/auto-lighthouse/compare/1.1.3...1.1.4) (2020-03-12)

## [1.1.3](https://github.com/TGiles/auto-lighthouse/compare/1.1.2...1.1.3) (2020-02-21)

## [1.1.2](https://github.com/TGiles/auto-lighthouse/compare/1.1.1...1.1.2) (2020-02-02)

## [1.1.1](https://github.com/TGiles/auto-lighthouse/compare/1.1.0...1.1.1) (2020-01-15)

# [1.1.0](https://github.com/TGiles/auto-lighthouse/compare/1.0.0...1.1.0) (2019-12-28)


### Features

* allow multiple output formats through CLI ([#55](https://github.com/TGiles/auto-lighthouse/issues/55)) ([d6172eb](https://github.com/TGiles/auto-lighthouse/commit/d6172eb))

# [1.0.0](https://github.com/TGiles/auto-lighthouse/compare/0.3.5...1.0.0) (2019-12-13)


### Features

* add auto open test coverage ([#50](https://github.com/TGiles/auto-lighthouse/issues/50)) ([fa7c13c](https://github.com/TGiles/auto-lighthouse/commit/fa7c13c))


* feat!: add crawling and auditing multiple domains (#51) ([c8e0a12](https://github.com/TGiles/auto-lighthouse/commit/c8e0a12)), closes [#51](https://github.com/TGiles/auto-lighthouse/issues/51)


### BREAKING CHANGES

* Removes the dependency on the crawler config

* chore: update package-lock

* refactor: update tests due to breaking change

* chore: fix typo in test

* test: add tests for differently sized URL arrays

## [0.3.5](https://github.com/TGiles/auto-lighthouse/compare/0.3.4...0.3.5) (2019-11-14)

## [0.3.4](https://github.com/TGiles/auto-lighthouse/compare/0.3.3...0.3.4) (2019-11-08)

## [0.3.3](https://github.com/TGiles/auto-lighthouse/compare/0.3.2...0.3.3) (2019-10-17)


### Bug Fixes

* fix auto open not working as expected ([3212aee](https://github.com/TGiles/auto-lighthouse/commit/3212aee))

## [0.3.2](https://github.com/TGiles/auto-lighthouse/compare/0.3.1...0.3.2) (2019-09-27)

## [0.3.1](https://github.com/TGiles/auto-lighthouse/compare/0.3.0...0.3.1) (2019-09-18)

# [0.3.0](https://github.com/TGiles/auto-lighthouse/compare/0.2.2...0.3.0) (2019-09-17)


### Features

* Add simple tests ([#24](https://github.com/TGiles/auto-lighthouse/issues/24)) ([68000aa](https://github.com/TGiles/auto-lighthouse/commit/68000aa))
* Add Travis CI ([#23](https://github.com/TGiles/auto-lighthouse/issues/23)) ([0a7b86c](https://github.com/TGiles/auto-lighthouse/commit/0a7b86c))

## [0.2.2](https://github.com/TGiles/auto-lighthouse/compare/0.2.1...0.2.2) (2019-09-10)

## [0.2.1](https://github.com/TGiles/auto-lighthouse/compare/0.2.0...0.2.1) (2019-08-22)

# [0.2.0](https://github.com/TGiles/auto-lighthouse/compare/0.1.2...0.2.0) (2019-08-19)


### Features

* expose more API calls for development ([#17](https://github.com/TGiles/auto-lighthouse/issues/17)) ([f6ebbc0](https://github.com/TGiles/auto-lighthouse/commit/f6ebbc0))

## [0.1.2](https://github.com/TGiles/auto-lighthouse/compare/0.1.1...0.1.2) (2019-08-18)

## [0.1.1](https://github.com/TGiles/auto-lighthouse/compare/0.1.0...0.1.1) (2019-08-18)


### Bug Fixes

* output reports relative to process path ([fce58ca](https://github.com/TGiles/auto-lighthouse/commit/fce58ca))

# 0.1.0 (2019-08-18)


### Features

* add automated deployment ([#9](https://github.com/TGiles/auto-lighthouse/issues/9)) ([c270d7c](https://github.com/TGiles/auto-lighthouse/commit/c270d7c))
* Add CLI ([#5](https://github.com/TGiles/auto-lighthouse/issues/5)) ([cc0c180](https://github.com/TGiles/auto-lighthouse/commit/cc0c180))

## 0.0.1 (2019-08-18)


### Features

* Add CLI ([#5](https://github.com/TGiles/auto-lighthouse/issues/5)) ([cc0c180](https://github.com/TGiles/auto-lighthouse/commit/cc0c180))