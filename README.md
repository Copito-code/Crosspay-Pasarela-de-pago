# 💳 Pasarela de Pagos Full Stack: Django + React

Este proyecto es una solución completa (Full Stack) que simula una pasarela de pagos, incluyendo la lógica de validación del pago (Backend) y un panel administrativo seguro para la visualización de transacciones.

El proyecto está estructurado como un **Monorepo**, conteniendo:
1.  **`backend-django/`**: API REST con Django y Django Rest Framework (DRF).
2.  **`frontend-react/`**: Interfaz de usuario (Pasarela de Pago y Panel Admin) con React y TypeScript.

---

## ✅ Objetivos y Requerimientos Cumplidos

El desarrollo se centró en la robustez de la API y la separación de responsabilidades:

| Objetivo Clave | Implementación |
| :--- | :--- |
| **API RESTful (Backend)** | Implementación de vistas basadas en `viewsets` y *routing* claro para las transacciones. |
| **Validación de Pago** | Lógica de validación estricta en el `serializers.py` (formato de tarjeta, fecha de expiración, CVV, etc.) para asegurar datos limpios. |
| **Seguridad de Acceso (Admin)** | Uso de **JSON Web Tokens (JWT)** para proteger el panel administrativo. El acceso a `/api/transactions/` (GET) requiere un token válido. |
| **Frontend Dinámico** | Interfaz de usuario completa en React, con manejo de estado, rutas protegidas y comunicación *client-side* con la API. |
| **Manejo de CORS** | Configuración de `django-cors-headers` para permitir la comunicación entre el dominio del Frontend (React) y el Backend (Django). |

---

## 🛑 Nota de Despliegue y Ejecución Local

Inicialmente se intentó el despliegue del Backend en un servicio gratuito (como Render), pero se optó por la **ejecución local** para esta presentación.

### Justificación de la Ejecución Local:

El principal problema encontrado fue el **error de CORS** persistente en la configuración del servicio gratuito, incluso después de agotar las configuraciones de `CORS_ALLOWED_ORIGINS` y `CORS_ALLOW_ALL_ORIGINS`.

**Para garantizar una revisión fluida y funcional:** El proyecto está configurado para ejecutarse 100% en local, asegurando que el Backend (`http://localhost:8000`) y el Frontend (`http://localhost:5173`) se comuniquen sin problemas de seguridad.

Con mas tiempo de ejecucciòn prodria resolver el problema antes mencionado para esta prueba tecnica u optado por empezar de 0 solo con React js. 

---

## 🛠️ Stack Tecnológico

| Componente | Backend (`backend-django/`) | Frontend (`frontend-react/`) |
| :--- | :--- | :--- |
| **Frameworks** | Django, Django Rest Framework | React, TypeScript, Vite |
| **Autenticación** | Simple JWT | React Context (AuthContext) |
| **Bases de Datos** | SQLite (Local), PostgreSQL (Producción) | N/A |

---

## 🚀 Guía de Instalación y Ejecución Local (Dos Terminales)

Para poner en marcha el proyecto completo, necesitarás dos terminales: una para el Backend y otra para el Frontend.

### 1. Pre-requisitos

* Python 3.x
* Node.js y npm/yarn

### 2. Clonar y Navegar

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Entrar al directorio raíz del proyecto
cd pasarela_de_pago_fullStack

## Entra en el read.md de la caperte de backend-django...