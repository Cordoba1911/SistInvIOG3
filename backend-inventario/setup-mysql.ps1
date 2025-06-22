# =============================================================================
# SCRIPT DE CONFIGURACIÓN AUTOMÁTICA - SISTEMA DE INVENTARIO IOG3
# =============================================================================
# Descripción: Script de PowerShell para configurar y poblar la base de datos MySQL
# Fecha: 2025-01-15
# Uso: .\setup-mysql.ps1
# =============================================================================

Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "SISTEMA DE INVENTARIO IOG3 - CONFIGURACIÓN DE BASE DE DATOS" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host ""

# Verificar si MySQL está disponible
Write-Host "🔍 Verificando instalación de MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version 2>$null
    if ($mysqlVersion) {
        Write-Host "✅ MySQL encontrado: $mysqlVersion" -ForegroundColor Green
    } else {
        throw "MySQL no encontrado"
    }
} catch {
    Write-Host "❌ MySQL no está instalado o no está en el PATH del sistema" -ForegroundColor Red
    Write-Host "   Por favor instala MySQL Server y asegúrate de que esté en el PATH" -ForegroundColor Red
    Write-Host "   Descarga: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Solicitar credenciales de MySQL
Write-Host "🔐 Configuración de credenciales MySQL" -ForegroundColor Cyan
$username = Read-Host "Usuario de MySQL (por defecto: root)"
if ([string]::IsNullOrEmpty($username)) {
    $username = "root"
}

$password = Read-Host "Contraseña de MySQL" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""

# Probar conexión
Write-Host "🔗 Probando conexión a MySQL..." -ForegroundColor Yellow
try {
    $testQuery = "SELECT 'Conexión exitosa' as mensaje;"
    $result = echo $testQuery | mysql -u $username -p$passwordPlain 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Conexión exitosa a MySQL" -ForegroundColor Green
    } else {
        throw "Error de conexión"
    }
} catch {
    Write-Host "❌ Error al conectar con MySQL" -ForegroundColor Red
    Write-Host "   Verifica las credenciales y que el servidor MySQL esté ejecutándose" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Crear la base de datos
Write-Host "🏗️  Creando estructura de base de datos..." -ForegroundColor Yellow
try {
    mysql -u $username -p$passwordPlain < create-database.sql
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos creada exitosamente" -ForegroundColor Green
    } else {
        throw "Error al crear base de datos"
    }
} catch {
    Write-Host "❌ Error al crear la base de datos" -ForegroundColor Red
    Write-Host "   Verifica el archivo create-database.sql" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Poblar con datos de ejemplo
Write-Host "📊 Poblando base de datos con datos de ejemplo..." -ForegroundColor Yellow
$poblar = Read-Host "¿Deseas poblar la base de datos con datos de ejemplo? (s/n)"
if ($poblar -eq "s" -or $poblar -eq "S" -or $poblar -eq "si" -or $poblar -eq "SI") {
    try {
        mysql -u $username -p$passwordPlain sistema_inventario_iog3 < populate-database.sql
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Datos de ejemplo insertados exitosamente" -ForegroundColor Green
        } else {
            throw "Error al insertar datos"
        }
    } catch {
        Write-Host "❌ Error al insertar datos de ejemplo" -ForegroundColor Red
        Write-Host "   La base de datos se creó correctamente, pero falló la inserción de datos" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Base de datos creada sin datos de ejemplo" -ForegroundColor Blue
}

Write-Host ""

# Aplicar migraciones adicionales si existen
if (Test-Path "migration-add-inventory-fields.sql") {
    Write-Host "🔄 Aplicando migraciones adicionales..." -ForegroundColor Yellow
    try {
        mysql -u $username -p$passwordPlain sistema_inventario_iog3 < migration-add-inventory-fields.sql
        Write-Host "✅ Migraciones aplicadas exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Advertencia: Error al aplicar migraciones adicionales" -ForegroundColor Yellow
    }
}

Write-Host ""

# Mostrar información de configuración para la aplicación
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información de la base de datos:" -ForegroundColor Cyan
Write-Host "   • Nombre: sistema_inventario_iog3" -ForegroundColor White
Write-Host "   • Usuario: $username" -ForegroundColor White
Write-Host "   • Host: localhost" -ForegroundColor White
Write-Host "   • Puerto: 3306 (por defecto)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Configuración para el backend (NestJS):" -ForegroundColor Cyan
Write-Host "   Actualiza tu archivo .env con:" -ForegroundColor White
Write-Host "   DB_HOST=localhost" -ForegroundColor Gray
Write-Host "   DB_PORT=3306" -ForegroundColor Gray
Write-Host "   DB_USERNAME=$username" -ForegroundColor Gray
Write-Host "   DB_PASSWORD=tu_contraseña" -ForegroundColor Gray
Write-Host "   DB_DATABASE=sistema_inventario_iog3" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Para iniciar el backend:" -ForegroundColor Cyan
Write-Host "   cd backend-inventario" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "✅ ¡Configuración completada exitosamente!" -ForegroundColor Green
Write-Host ""

# Limpiar la contraseña de la memoria
$passwordPlain = $null
$password = $null 