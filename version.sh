#!/bin/bash
# Atlantis 构建所需的版本基线文件（Docker 构建模板会 `source version.sh` 读取 VERSION）。
# 构建脚本会在此基础上自动追加 分支/tag/时间戳；打 tag 时 tag 名优先级更高。
#
# ⚠️ Harbor 拒绝已存在的 tag —— 同一个 VERSION 推第二次会让流水线直接失败
# （`已经存在，请修改版本号再进行提交`）。scripts/git-hooks/pre-commit 每次提交
# 自动把补丁号 +1；启用方式见 README。需要抬主版本时直接改这里。
export VERSION=1.0.3
