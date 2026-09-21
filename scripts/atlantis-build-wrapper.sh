#!/usr/bin/env bash
# Atlantis 构建包装脚本 —— 修正 Docker 发布包的命名大小写。
#
# ## 它在修什么
#
# Atlantis 生成的构建脚本里，Docker 分支用**服务名**拼发布包目录：
#
#     __atls_build_docker() {
#       pkg_name=bspdocsystem                                    # 镜像/包名，小写
#       scratch_dir=$(echo -n "${SVC_NAME}-$VERSION" | ...)      # ← 用的是服务名
#
# 而部署 agent 事后按**镜像/包名**去 OSS 取包。两者大小写不一致时，包传上去叫
# `BSPDocSystem-<VERSION>`，取的时候找 `bspdocsystem-<VERSION>`，于是发布失败在：
#
#     开始从oss安装包:bspdocsystem-1.0.1
#     下载svc pkg失败，err:oss: StatusCode=404, ErrorCode=NoSuchKey
#     package安装失败
#
# 注意这发生在**部署**阶段：镜像已经构建好并推进 Harbor 了，CI 那边是绿的，
# 只有平台的发布页会红。所以从流水线日志里看不出原因。
#
# 同一个脚本里 k8s 分支（`__atls_build_k8s`）用的是 `pkg_name`，是对的 ——
# 所以这只影响 Docker 类型的服务。ApiWorker 早就在用同样的补丁。
#
# ## 为什么是包装而不是把脚本 vendor 进仓库
#
# 构建脚本是平台按服务动态生成的（含镜像仓库地址、清理历史版本的上报地址等）。
# 抄一份进仓库意味着平台改了这些我们拿不到，而漂移会落在发布这条最贵的路径上。
# 这里只在「拉取」和「执行」之间插一行 sed，补丁打不上就立刻失败、看得见。

set -euo pipefail

generated_script=$(mktemp)
fixed_script="${generated_script}.fixed"
build_log="${generated_script}.log"
nocache_script="${generated_script}.nocache"
cleanup() { rm -f "$generated_script" "$fixed_script" "$build_log" "$nocache_script"; }
trap cleanup EXIT

build_request=$(jq -nc \
  --arg svc_name "${ATLS_SVC_NAME}" \
  --arg ns "${ATLS_NS:-}" \
  --arg env "${ATLS_ENV}" \
  --arg branch "${ATLS_BRANCH:-}" \
  --arg running_image "${ATLS_RUNNING_BASE_IMAGE:-}" \
  --arg dockerfile_path "${ATLS_DOCKER_FILE_PATH:-Dockerfile}" \
  --arg git_tag "${ATLS_GIT_TAG:-}" \
  '{svc_name:$svc_name,namespace:$ns,env:$env,svc_branch:$branch,ext_args:{runningImage:$running_image,dockerfilePath:$dockerfile_path,git_tag:$git_tag}}')

curl --fail --show-error --silent --location \
  -H "X-Atlantis-UUID: ${ATLS_SVC_NAME}" \
  -H "skip: atlantis" \
  -H "Content-type: application/json" \
  -X POST \
  --data "$build_request" \
  "${ATLS_API_NEW}/deploy/getSvcBuildScript" \
  -o "$generated_script"

# 只改 Docker 分支那一行（k8s 分支本来就用的 pkg_name，不会被这条规则命中）。
sed '/scratch_dir=.*SVC_NAME/ s/SVC_NAME/pkg_name/' "$generated_script" > "$fixed_script"

# 断言用 -F 固定字符串，不用正则：`${...}` 里的花括号在不同 grep 实现（GNU / BSD /
# ugrep）下是否被当作区间量词并不一致，用正则写这条断言会在某些机器上假阴性。
if ! grep -qF 'scratch_dir=$(echo -n "${pkg_name}-$VERSION"' "$fixed_script"; then
  echo "===>>> 补丁未生效：没能把 Docker 分支的 scratch_dir 改成 pkg_name。" >&2
  echo "       上游可能改了这一行的写法，先看下面的实际内容再决定怎么改 sed：" >&2
  grep -n 'scratch_dir=' "$generated_script" >&2 || echo "       （完全没有 scratch_dir 这一行）" >&2
  exit 1
fi

chmod +x "$fixed_script"

# ---------------------------------------------------------------------------
# 本地构建缓存损坏时自愈重试一次（用 --no-cache，不清宿主机缓存）。
#
# 症状：每一步都 CACHED，然后在某个 stage 上以
#   `failed to solve: ... failed to load cache: not found`
# 失败 —— 缓存记录还在、底层 blob 已经没了。这种状态不会自己恢复，每次构建都停在
# 同一处，而日志里满屏 CACHED，不看最后一行根本判断不出是缓存问题。
#
# 不要用 `docker builder prune` 修：这台 runner 是**共享**的，那是宿主机全局操作，
# 会带走别的项目的缓存。注入 `--no-cache` 只影响本次构建，代价是多跑一轮全量。
#
# 只在匹配到缓存类错误时才重试 —— 真正的编译错误重试一遍还是错，白烧一轮 CI。
# ---------------------------------------------------------------------------
run_build() {
  local script="$1"
  shift
  set +e
  bash -x "$script" "$@" 2>&1 | tee "$build_log"
  local rc=${PIPESTATUS[0]}
  set -e
  return "$rc"
}

exit_code=0
run_build "$fixed_script" "$@" || exit_code=$?

if [ "$exit_code" -ne 0 ] && grep -qE 'failed to load cache: not found|failed to compute cache key|content digest [^ ]+ not found' "$build_log"; then
  echo "===>>> 检测到本地缓存损坏，改用 --no-cache 重试一次（不动宿主机缓存）"
  sed 's/docker build /docker build --no-cache /g' "$fixed_script" > "$nocache_script"
  # 注入失败必须原样返回首次的失败码，不能静默再跑一遍一模一样的构建：那只会再失败
  # 一次，却让日志看起来像是"重试过了"。
  if ! grep -q 'docker build --no-cache ' "$nocache_script"; then
    echo "无法给 docker build 注入 --no-cache，放弃重试" >&2
    exit "$exit_code"
  fi
  chmod +x "$nocache_script"
  exit_code=0
  run_build "$nocache_script" "$@" || exit_code=$?
fi

exit "$exit_code"
