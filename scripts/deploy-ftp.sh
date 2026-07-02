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

install_lftp() {
  sudo apt-get update -qq
  sudo apt-get install -y -qq lftp
}

deploy_sftp() {
  echo "Deploying via SFTP..."
  lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "sftp://${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set sftp:auto-confirm yes
set net:timeout 120
set net:max-retries 5
cd ${SERVER_DIR}
lcd .
mirror -R --verbose --parallel=2 ${EXCLUDES[*]} .
bye
EOF
}

deploy_ftp() {
  local use_ssl="$1"
  echo "Deploying via FTP (ssl=${use_ssl})..."

  if [[ "$use_ssl" == "true" ]]; then
    lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ssl:verify-certificate no
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set net:timeout 120
set net:max-retries 5
cd ${SERVER_DIR}
lcd .
mirror -R --verbose --parallel=1 ${EXCLUDES[*]} .
bye
EOF
  else
    lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ftp:passive-mode true
set net:timeout 120
set net:max-retries 5
cd ${SERVER_DIR}
lcd .
mirror -R --verbose --parallel=1 ${EXCLUDES[*]} .
bye
EOF
  fi
}

install_lftp

if deploy_sftp; then
  echo "Deployment complete via SFTP."
  exit 0
fi

echo "SFTP failed, trying FTPS..."
if deploy_ftp true; then
  echo "Deployment complete via FTPS."
  exit 0
fi

echo "FTPS failed, trying plain FTP..."
deploy_ftp false
echo "Deployment complete via FTP."
