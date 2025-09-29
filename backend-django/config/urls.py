"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from transactions.views import TransactionViewSet


# Importaciones de JWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# 1. Configurar el Router para la API
router = DefaultRouter()
# Esto crea rutas como /api/transactions/ (GET/POST)
router.register(r'transactions', TransactionViewSet) 

urlpatterns = [
    path('admin/', admin.site.urls), 
    
    
    
    # ENDPOINTS DE JWT: Reemplazan /api-auth/login/
    # Obtiene el 'access' y 'refresh' token (Login)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    # Renueva el token (sesiones largas)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    
    # Exponemos la API (transactions)
    path('api/', include(router.urls)), 
]