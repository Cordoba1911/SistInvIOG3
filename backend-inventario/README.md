
Configuracion de la DB:
1. Descargamos mysql y lo configuramos correctamente. Obtenemos puerto, username y password.
2. Instalamos y ejecutamos mysql workbench.
3. Descargamos de la carpeta de investigacion operativa el archivo "database.sql"
4. En MySql workbench, apretamos en archivo, y en abrir SQL Script, ahi buscamos el archivo descargado.
5. Una vez cargado el archivo le damos a ejecutar y ya quedaria configurado.

Funcionamiento del backend:
-Para dejar operativo el backend y hacer pruebas, necesitamos hacer lo siguiente:
1. Nos ubicamos en la carpeta "backend-inventario" con cd backend-inventario
2. Ejecutamos el comando npm install
3. Creamos un archivo ".env" en la carpeta raiz (/backend-inventario/.env)
4. Dentro del .env colocamos las credenciales de la DB, ejemplo:
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=root
    DB_NAME=inventario
5. Una vez realizado esto levantamos el servidor de NestJS con npm run start:dev
6. El servidor esta configurado para levantarse en el puerto 3000. OJO con el frontend, no deberia exponerse en el 3000 porque traera problemas. Moverlo al 4000.
7. Con esto ya tienen el backend configurado para trabajar, y pueden empezar a hacerle peticiones a los endpoints.

