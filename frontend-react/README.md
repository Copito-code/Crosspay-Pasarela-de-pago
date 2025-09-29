# ⚛️ Frontend - Pasarela de Pagos (React + TypeScript)
Este directorio contiene la aplicación de interfaz de usuario, desarrollada en React con TypeScript, que consume la API REST del Backend.

La aplicación tiene dos áreas principales: el formulario de pasarela de pago (público) y el panel administrativo (protegido).

## ✨ Estructura y Componentes Clave
El Frontend se organiza para separar la lógica de autenticación, las rutas y los formularios:

Archivo/Componente	Descripción

src/context/AuthContext.tsx	Maneja el estado global de autenticación (login/logout). Es responsable de enviar 

credenciales a /api/token/ y almacenar el JWT en localStorage.

src/components/TransactionForm.tsx	La pasarela de pago pública. Envía los datos de la tarjeta a /api/transactions/ (POST). No requiere autenticación.

src/components/AdminPanel.tsx	La vista principal del administrador. Muestra la tabla de transacciones. Requiere el JWT almacenado en AuthContext para realizar la solicitud GET a /api/transactions/.

src/components/ProtectedRoute.tsx	Componente wrapper que verifica si el usuario está autenticado (isLoggedIn). Si no lo está, redirige al Login.

src/App.tsx	Define las rutas de la aplicación, incluyendo la protección de rutas para el área /admin/dashboard.


## 🛠️ Tecnologías Adicionales
TypeScript: Utilizado para garantizar la robustez del código y la tipificación de datos, crucial para el manejo de formularios y la respuesta de la API.

Vite: Usado como herramienta de bundling y servidor de desarrollo, ofreciendo un arranque y recarga rápida.

Axios: Cliente HTTP para realizar las peticiones a la API de Django.

react-data-table-component: Componente utilizado en el AdminPanel para mostrar el listado de transacciones de forma paginada y ordenada.

react-router-dom: Gestión de rutas y navegación.

## ⚙️ Guía de Ejecución (Específica del Frontend)
Asumiendo que ya has clonado el repositorio y estás en la carpeta raíz del proyecto (pasarela_de_pago_fullStack/):

1. Navegar e Instalar Dependencias
Abre tu terminal y asegúrate de estar en el directorio del Frontend.



cd frontend-react 
npm install
2. Iniciar el Servidor de Desarrollo
El servidor de desarrollo de React utiliza el puerto 5173 por defecto y se conecta automáticamente al Backend de Django en el puerto 8000.

⚠️ NOTA IMPORTANTE: El Backend (en el puerto 8000) debe estar corriendo simultáneamente para que el Frontend funcione.



## Iniciar el servidor de React
npm run dev
El Frontend estará disponible en: http://localhost:5173/

3. Rutas Funcionales
Ruta	Descripción	Requerimiento
/	Pasarela de Pago (Formulario).	Público
/admin/login	Formulario de inicio de sesión para administradores (JWT).	Público
/admin/dashboard	Listado de transacciones.	Protegida (Requiere JWT válido)


