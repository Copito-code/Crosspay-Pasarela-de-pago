# models.py - MANTENER COMO ESTÁ
from django.db import models

class Transaction(models.Model):
    # campos de la transaccion
    currency = models.CharField(max_length=3, default='USD', editable=False)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=255)

    # campos del cliente 
    name = models.CharField(max_length=100)
    DOCUMENT_CHOICES = [('CC', 'Cedula'), ('PP', 'Pasaporte')]
    document_type = models.CharField(max_length=2, choices=DOCUMENT_CHOICES)
    document_number = models.CharField(max_length=50)
    
    # Campos de la Tarjeta
    card_number = models.CharField(max_length=19)  # Cambiado de 16 a 19
    expiration_date = models.CharField(max_length=5)  
    security_code = models.CharField(max_length=4)
    
    # Metadatos
    transaction_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.currency} {self.monto} - {self.name}'