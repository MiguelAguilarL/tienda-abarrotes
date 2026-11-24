# INSTRUCCIONES PARA CLONAR Y CORRER EL PROYECTO EN LOCAL

1. Clonar el repositorio con el siguiente comando: `git clone https://github.com/MiguelAguilarL/tienda-abarrotes.git`
2. Ingresar al proyecto con: `cd tienda-abarrotes`
3. Abrir el proyecto en Visual Studio Code con: `code .`
4. Crear un archivo llamado ".env" dentro de la carpeta "backend/"
5. Ingresar lo siguiente en el archivo .env:

``` .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_PORT=3306
DB_NAME=mi_base_de_datos
```

6. Crear una base de datos llamada "mi_base_de_datos" desde workbench
7. Ejecutar los scripts `estructura.sql` y `datos_prueba.sql` que se encuentran en la carpeta `references/` desde workbench.
8. Abrir dos terminales desde la carpeta del proyecto.
9. Entrar a la carpeta `backend` con: `cd backend`
10. Ejecutar los comandos `npm install` y `npm run dev`
11. Hacer lo mismo pero en la carpeta `frontend`
12. Ingresar desde un navegador a `http://localhost:5173/`
