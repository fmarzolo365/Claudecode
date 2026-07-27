#!/usr/bin/env bash
# Telefontrainer launcher. First run asks for your API key and stores it in ./.env
# (which is gitignored). After that: just  ./start.sh
cd "$(dirname "$0")"

if [ ! -f .env ] && [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$ANTHROPIC_AUTH_TOKEN" ]; then
  echo "Pega tu clave API de Anthropic (empieza con sk-ant-) y pulsa Enter:"
  read -r KEY
  if [ -z "$KEY" ]; then
    echo "No se recibió ninguna clave. Saliendo."
    exit 1
  fi
  printf 'ANTHROPIC_API_KEY=%s\n' "$KEY" > .env
  chmod 600 .env
  echo "Clave guardada en .env — no tendrás que volver a pegarla."
fi

exec node server.js
