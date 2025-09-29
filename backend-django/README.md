## 🚀 Backend - API Pasarela de Pagos (Django + DRF)
Este proyecto backend implementa una API RESTful para la simulación de una pasarela de pagos y un portal administrativo. Utiliza Django y Django Rest Framework (DRF). La autenticación para el panel administrativo se gestiona mediante JSON Web Tokens (JWT).

## 🛠️ Stack Tecnológico
Framework: Django 

API: Django Rest Framework (DRF)

Base de Datos (Local/Desarrollo): SQLite

Base de Datos (Producción): PostgreSQL (se requiere un servicio externo como Render/Railway)

Autenticación: Simple JWT (djangorestframework-simplejwt)

Servidor de Producción: Gunicorn

Manejo de CORS: django-cors-headers

## 🧠 Arquitectura y Diseño
La API se basa en un diseño de dos endpoints principales:

/api/transactions/ (POST - Público):

Diseñado para recibir los datos de pago del formulario de la pasarela.

No requiere autenticación (es una ruta de pago pública).

Solo permite el método POST para el registro.

/api/transactions/ (GET - Protegido):

Diseñado para el portal administrativo.

Requiere autenticación mediante Bearer Token (JWT).

Permite al administrador listar todas las transacciones registradas.

## Endpoints de Autenticación (JWT):

/api/token/: Permite a un usuario enviar credenciales (username/password) y recibir el access y refresh token.

/api/token/refresh/: Permite refrescar un token de acceso expirado usando el refresh token.

## ⚙️ Configuración y Ejecución Local
Sigue estos pasos para poner en marcha el backend en tu máquina local.

1. Clonar el Repositorio

git clone <URL_DE_TU_REPOSITORIO_BACKEND>
cd backend-django


2. Crear Entorno Virtual e Instalar Dependencias
Es crucial usar un entorno virtual para aislar las dependencias del proyecto.


## Crear entorno virtual (ej. venv)
python3 -m venv .venv

## Activar el entorno virtual
source .venv/bin/activate  # En Linux/macOS


## .venv\Scripts\activate   # En Windows


## Instalar dependencias
pip install -r requirements.txt

Nota: Debes generar el archivo requirements.txt si aún no existe, ejecutando: pip freeze > requirements.txt

3. Configurar Variables de Entorno
El proyecto usa un archivo .env en la raíz para las configuraciones sensibles. Crea un archivo llamado .env con el siguiente contenido (reemplaza <TU_CLAVE_SECRETA>):

.env

Fragmento de código
## Configuración del proyecto Django
SECRET_KEY=<TU_CLAVE_SECRETA_UNICA_Y_LARGA>
DEBUG=True

## Configuración de la base de datos (SQLite en desarrollo)
En producción, esto sería diferente (PostgreSQL)

DATABASE_URL=sqlite:///db.sqlite3


4. Inicializar la Base de Datos
Ejecuta las migraciones de Django para crear el esquema de la base de datos y la tabla de transacciones.


python manage.py makemigrations
python manage.py migrate



5. Crear Superusuario (Administrador)
Necesitas un usuario para acceder al Portal Administrativo y obtener un JWT.

python manage.py createsuperuser


## Sigue las instrucciones para crear el usuario (ej: admin / adminpass)

6. Ejecutar el Servidor
Inicia el servidor de desarrollo de Django:

python manage.py runserver
El backend estará disponible en: http://127.0.0.1:8000/

Endpoint	Descripción	Requiere Auth
/api/token/	Obtener token JWT (Login)	No
/api/token/refresh/	Refrescar token JWT	No
/api/transactions/ (POST)	Registrar una transacción (Pago)	No
/api/transactions/ (GET)	Listar transacciones (Admin Panel)	Sí (JWT)