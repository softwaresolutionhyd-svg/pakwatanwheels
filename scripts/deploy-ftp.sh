#!/usr/bin/env bash
set -euo pipefail

: "${FTP_SERVER:?FTP_SERVER is required}"
: "${FTP_USERNAME:?FTP_USERNAME is required}"
: "${FTP_PASSWORD:?FTP_PASSWORD is required}"
: "${FTP_SERVER_DIR:?FTP_SERVER_DIR is required}"

SERVER_DIR="${FTP_SERVER_DIR%/}"

EXCLUDES=(
  -X .git/
  -X .git*/
  -X .github/
  -X scripts/
  -X .gitignore
  -X .cursor/
  -X .vscode/
  -X '*.zip'
)

PRIORITY_FILES=(
  index.html
  css/style.css
  js/main.js
  js/cars-data.js
  images/cars-preview/05-toyota-revo-dala.jpg
)

install_lftp() {
  sudo apt-get update -qq
  sudo apt-get install -y -qq lftp
}

build_put_commands() {
  local file
  for file in "${PRIORITY_FILES[@]}"; do
    if [[ -f "$file" ]]; then
      printf 'put -O . "%s"\n' "$file"
    fi
  done
}

deploy_ftps() {
  local put_commands
  put_commands="$(build_put_commands)"
  echo "Uploading priority files to ${SERVER_DIR} via FTPS..."
  lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set net:timeout 60
set net:max-retries 3
cd ${SERVER_DIR}
lcd .
${put_commands}
mirror -R --ignore-time --overwrite --verbose --parallel=2 ${EXCLUDES[*]} .
bye
EOF
}

deploy_ftp() {
  local put_commands
  put_commands="$(build_put_commands)"
  echo "Uploading priority files to ${SERVER_DIR} via FTP..."
  lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ftp:passive-mode true
set net:timeout 60
set net:max-retries 3
cd ${SERVER_DIR}
lcd .
${put_commands}
mirror -R --ignore-time --overwrite --verbose --parallel=1 ${EXCLUDES[*]} .
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
