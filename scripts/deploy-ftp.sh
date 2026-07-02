#!/usr/bin/env bash
set -euo pipefail

: "${FTP_SERVER:?FTP_SERVER is required}"
: "${FTP_USERNAME:?FTP_USERNAME is required}"
: "${FTP_PASSWORD:?FTP_PASSWORD is required}"
: "${FTP_SERVER_DIR:?FTP_SERVER_DIR is required}"

SERVER_DIR="${FTP_SERVER_DIR%/}"
CURL_COMMON=(
  --ftp-create-dirs
  --fail
  --silent
  --show-error
  --connect-timeout 30
  --max-time 180
  --ftp-skip-pasv-ip
  --user "${FTP_USERNAME}:${FTP_PASSWORD}"
)

upload_file() {
  local file="$1"
  local remote_path="${SERVER_DIR}/${file}"
  local attempt

  for attempt in 1 2 3; do
    if curl "${CURL_COMMON[@]}" \
      -T "$file" \
      "ftp://${FTP_SERVER}/${remote_path}"; then
      echo "Uploaded: ${file}"
      return 0
    fi

    echo "FTP retry ${attempt}/3 for ${file}"
    sleep 2
  done

  for attempt in 1 2 3; do
    if curl "${CURL_COMMON[@]}" \
      --ssl-reqd \
      -T "$file" \
      "ftp://${FTP_SERVER}/${remote_path}"; then
      echo "Uploaded via explicit FTPS: ${file}"
      return 0
    fi

    echo "FTPS retry ${attempt}/3 for ${file}"
    sleep 2
  done

  echo "Failed to upload: ${file}" >&2
  return 1
}

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

echo "Deploying ${#ordered_files[@]} files to ${SERVER_DIR}"

for file in "${ordered_files[@]}"; do
  upload_file "$file"
done

echo "Deployment complete."
