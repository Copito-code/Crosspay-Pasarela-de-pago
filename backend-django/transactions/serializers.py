# serializers.py
from rest_framework import serializers  
from .models import Transaction
from datetime import datetime
import re


class TransactionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('transaction_date', 'currency')
    
    def validate_expiration_date(self, value):
        """
        Validar que la fecha de expiración tenga formato MM/YY y sea futura
        """
        # Validar formato MM/YY
        if not re.match(r'^(0[1-9]|1[0-2])/\d{2}$', value):
            raise serializers.ValidationError("Formato inválido. Use MM/YY (ej: 12/25)")
        
        # Extraer mes y año
        month, year = value.split('/')
        month_int = int(month)
        year_int = int(year)
        
        # Validar mes (1-12)
        if month_int < 1 or month_int > 12:
            raise serializers.ValidationError("Mes inválido. Debe ser entre 01 y 12")
        
        # Convertir a año completo (asumiendo siglo 21)
        full_year = 2000 + year_int
        
        # Obtener fecha actual
        current_date = datetime.now()
        current_year = current_date.year
        current_month = current_date.month
        
        # Validación directa sin crear variable de fecha
        # Comparar año y mes directamente
        if full_year < current_year:
            raise serializers.ValidationError("La tarjeta está expirada")
        elif full_year == current_year and month_int < current_month:
            raise serializers.ValidationError("La tarjeta está expirada")
        
        return value
    
    def validate_card_number(self, value):
        """Validar número de tarjeta - permite 13 a 19 dígitos"""
        # Remover espacios en blanco si los hay
        value = value.replace(' ', '')
        
        # Validar que solo contenga dígitos
        if not value.isdigit():
            raise serializers.ValidationError("El número de tarjeta debe contener solo dígitos")
        
        # Permitir 13 a 19 dígitos
        if len(value) < 13 or len(value) > 19:
            raise serializers.ValidationError(
                f"El número de tarjeta debe tener entre 13 y 19 dígitos. Tienes: {len(value)} dígitos"
            )
        
        return value
    
    def validate_security_code(self, value):
        """Validar código de seguridad (solo dígitos)"""
        if not value.isdigit():
            raise serializers.ValidationError("El código de seguridad debe contener solo dígitos")
        
        if len(value) not in [3, 4]:
            raise serializers.ValidationError("El código de seguridad debe tener 3 o 4 dígitos")
        
        return value
    
