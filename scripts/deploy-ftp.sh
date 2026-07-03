#!/usr/bin/env bash
set -euo pipefail

: "${FTP_SERVER:?FTP_SERVER is required}"
: "${FTP_USERNAME:?FTP_USERNAME is required}"
: "${FTP_PASSWORD:?FTP_PASSWORD is required}"
: "${FTP_SERVER_DIR:?FTP_SERVER_DIR is required}"

SERVER_DIR="${FTP_SERVER_DIR%/}"

# Upload only the files most likely to change. Keeps one FTP session and
# avoids hitting the host's concurrent-login limit.
DEPLOY_FILES=(
  index.html
  css/style.css
)

install_lftp() {
  sudo apt-get update -qq
  sudo apt-get install -y -qq lftp
}

build_put_commands() {
  local file
  for file in "${DEPLOY_FILES[@]}"; do
    if [[ -f "$file" ]]; then
      printf 'put -O . "%s"\n' "$file"
    fi
  done
}

deploy_ftps() {
  local put_commands
  local attempt
  put_commands="$(build_put_commands)"
  echo "Uploading ${#DEPLOY_FILES[@]} files to ${SERVER_DIR} via FTPS..."
  for attempt in 1 2 3; do
    if lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set net:timeout 90
set net:max-retries 3
set ftp:use-feat false
cd ${SERVER_DIR}
lcd .
${put_commands}
bye
EOF
    then
      return 0
    fi
    echo "FTPS attempt ${attempt}/3 failed; waiting before retry..."
    sleep $((attempt * 30))
  done
  return 1
}

deploy_ftp() {
  local put_commands
  put_commands="$(build_put_commands)"
  echo "Uploading ${#DEPLOY_FILES[@]} files to ${SERVER_DIR} via FTP..."
  lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ftp:passive-mode true
set net:timeout 90
set net:max-retries 3
cd ${SERVER_DIR}
lcd .
${put_commands}
bye
EOF
}

install_lftp

if deploy_ftps; then
  echo "Deployment complete via FTPS."
  exit 0
fi

echo "FTPS failed, trying plain FTP..."
deploy_ftp
echo "Deployment complete via FTP."
