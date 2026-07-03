#!/usr/bin/env bash
set -euo pipefail

: "${FTP_SERVER:?FTP_SERVER is required}"
: "${FTP_USERNAME:?FTP_USERNAME is required}"
: "${FTP_PASSWORD:?FTP_PASSWORD is required}"
: "${FTP_SERVER_DIR:?FTP_SERVER_DIR is required}"

SERVER_DIR="${FTP_SERVER_DIR%/}"

mapfile -t files < <(
  find . -type f \
    ! -path './.git/*' \
    ! -path './.github/*' \
    ! -path './scripts/*' \
    ! -path './.cursor/*' \
    ! -path './.vscode/*' \
    ! -name '.gitignore' \
    ! -name '*.zip' \
    -printf '%P\n' | sort
)

priority_files=(index.html css/style.css js/main.js js/cars-data.js)
ordered_files=()

for priority in "${priority_files[@]}"; do
  for file in "${files[@]}"; do
    if [[ "$file" == "$priority" ]]; then
      ordered_files+=("$file")
    fi
  done
done

for file in "${files[@]}"; do
  skip=false
  for priority in "${priority_files[@]}"; do
    if [[ "$file" == "$priority" ]]; then
      skip=true
      break
    fi
  done
  if [[ "$skip" == false ]]; then
    ordered_files+=("$file")
  fi
done

install_lftp() {
  sudo apt-get update -qq
  sudo apt-get install -y -qq lftp
}

build_put_commands() {
  local file
  for file in "${ordered_files[@]}"; do
    printf 'put -O . "%s"\n' "$file"
  done
}

deploy_sftp() {
  local put_commands
  put_commands="$(build_put_commands)"
  echo "Deploying ${#ordered_files[@]} files to ${SERVER_DIR} via SFTP..."
  lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "sftp://${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set sftp:auto-confirm yes
set net:timeout 120
set net:max-retries 5
cd ${SERVER_DIR}
lcd .
${put_commands}
bye
EOF
}

deploy_ftps() {
  local put_commands
  put_commands="$(build_put_commands)"
  echo "Deploying ${#ordered_files[@]} files to ${SERVER_DIR} via FTPS..."
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
${put_commands}
bye
EOF
}

deploy_ftp() {
  local put_commands
  put_commands="$(build_put_commands)"
  echo "Deploying ${#ordered_files[@]} files to ${SERVER_DIR} via FTP..."
  lftp -u "${FTP_USERNAME}","${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set cmd:fail-exit yes
set ftp:passive-mode true
set net:timeout 120
set net:max-retries 5
cd ${SERVER_DIR}
lcd .
${put_commands}
bye
EOF
}

install_lftp

if deploy_sftp; then
  echo "Deployment complete via SFTP."
  exit 0
fi

echo "SFTP failed, trying FTPS..."
if deploy_ftps; then
  echo "Deployment complete via FTPS."
  exit 0
fi

echo "FTPS failed, trying plain FTP..."
deploy_ftp
echo "Deployment complete via FTP."
