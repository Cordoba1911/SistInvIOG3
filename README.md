# SistInvIOG3
Sistema de Inventario - Proyecto Integrador - Investigacion Operativa


- Conexión a la Base de Datos MySQL
Este proyecto utiliza MySQL como sistema de gestión de bases de datos y se conecta desde Node.js utilizando la librería mysql2 con soporte para promesas.
- Configuración
Las credenciales de acceso a la base de datos (host, usuario, contraseña, puerto y nombre de la base) se almacenan en un archivo .env para mantenerlas seguras y evitar exponerlas en el código fuente.
- Pool de Conexiones
Se crea un pool de conexiones para manejar múltiples conexiones abiertas de forma eficiente. Esto mejora el rendimiento al reutilizar conexiones existentes en lugar de abrir una nueva cada vez que se realiza una consulta.
- Prueba de conexión
Para comprobar que la conexión funciona correctamente, se realiza una consulta simple que suma 1 + 1 y devuelve el resultado. Si la conexión es exitosa, el resultado esperado es 2.
