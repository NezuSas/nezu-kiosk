# ==========================================================
# NEZU ENV ACTIVATOR
# Entorno: nezu-kiosk
# ==========================================================

# Activar Node (nodeenv)
. "$PSScriptRoot\nodeenv\Scripts\Activate.ps1"

# Prompt personalizado
$env:NEZU_ENV_NAME = "nezu-kiosk"
function global:prompt {
  "($env:NEZU_ENV_NAME) $PWD> "
}
