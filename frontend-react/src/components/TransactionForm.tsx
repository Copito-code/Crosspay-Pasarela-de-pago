import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';

// URL del API - APUNTANDO A RENDER
const API_URL = 'http://localhost:8000/api/transactions/';

// Definición de la Interfaz (tipos de datos)
interface TransactionFormData {
    monto: number | string;
    descripcion: string;
    name: string;
    document_type: 'CC' | 'PP';
    document_number: string;
    card_number: string;
    expiration_date: string;
    security_code: string;
}

// Estado inicial del formulario
const initialFormData: TransactionFormData = {
    monto: '',
    descripcion: '',
    name: '',
    document_type: 'CC',
    document_number: '',
    card_number: '',
    expiration_date: '',
    security_code: '',
};

const TransactionForm: React.FC = () => {
    const [formData, setFormData] = useState<TransactionFormData>(initialFormData);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Manejador de cambios en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    
    // FUNCIÓN PARA MANEJAR ERRORES CON TRADUCCIÓN (YA EXISTENTE Y ROBUSTA)
    const getErrorMessage = (error: any): string => {
        if (!axios.isAxiosError(error)) {
            return '❌ Error de conexión. Por favor, verifica tu internet e intenta nuevamente.';
        }

        if (!error.response) {
            return '❌ No se pudo conectar con el servidor. Verifica que el servicio esté activo.';
        }

        const { status, data } = error.response;

        // Función para traducir mensajes comunes de Django
        const translateDjangoError = (errorMessage: string): string => {
            const translations: { [key: string]: string } = {
                'Ensure that there are no more than 10 digits in total.': 'Asegúrate de que no haya más de 10 dígitos en total.',
                'This field is required.': 'Este campo es obligatorio.',
                'Enter a valid email address.': 'Ingresa una dirección de email válida.',
                'Enter a valid URL.': 'Ingresa una URL válida.',
                'Enter a valid date.': 'Ingresa una fecha válida.',
                'Enter a valid time.': 'Ingresa una hora válida.',
                'Enter a valid datetime.': 'Ingresa una fecha y hora válidas.',
                'Ensure this value is less than or equal to {max_value}.': 'Asegúrate de que este valor sea menor o igual a {max_value}.',
                'Ensure this value is greater than or equal to {min_value}.': 'Asegúrate de que este valor sea mayor o igual a {min_value}.',
                'Ensure this field has no more than {max_length} characters.': 'Asegúrate de que este campo no tenga más de {max_length} caracteres.',
                'Ensure this field has at least {min_length} characters.': 'Asegúrate de que este campo tenga al menos {min_length} caracteres.',
                'Invalid card number.': 'Número de tarjeta inválido.',
                'Card has expired.': 'La tarjeta ha expirado.',
                'Invalid security code.': 'Código de seguridad inválido.',
            };

            // Buscar traducción exacta
            if (translations[errorMessage]) {
                return translations[errorMessage];
            }

            // Buscar patrones con parámetros
            for (const [pattern, translation] of Object.entries(translations)) {
                if (pattern.includes('{')) {
                    const regexPattern = pattern.replace(/\{.*?\}/g, '.*');
                    if (new RegExp(regexPattern).test(errorMessage)) {
                        return translation;
                    }
                }
            }

            return errorMessage; // Devolver original si no hay traducción
        };

        // Errores HTTP comunes
        switch (status) {
            case 400:
                if (typeof data === 'object' && data !== null) {
                    // Procesar errores de validación de Django
                    // Intentamos aplanar todos los mensajes de error
                    const errors = Object.values(data).flat();
                    const translatedErrors = errors.map(error => 
                        typeof error === 'string' ? translateDjangoError(error) : String(error)
                    );
                    return `❌ Errores de validación: ${translatedErrors.join(', ')}`;
                }
                return '❌ Datos del formulario incorrectos. Verifica la información ingresada.';
            
            case 401:
                return '❌ No autorizado. Por favor, verifica tus credenciales.';
            
            case 403:
                return '❌ No tienes permisos para realizar esta acción.';
            
            case 404:
                return '❌ El servicio no está disponible en este momento.';
            
            case 500:
                return '❌ Error interno del servidor. Por favor, intenta más tarde.';
            
            default:
                if (typeof data === 'string') {
                    return `❌ Error: ${translateDjangoError(data)}`;
                }
                if (typeof data === 'object' && data !== null) {
                    // Intentar extraer mensajes específicos del backend
                    const detail = (data as any).detail || (data as any).message;
                    if (detail) return `❌ ${translateDjangoError(detail)}`;
                    
                    const errors = Object.values(data).flat();
                    if (errors.length > 0) {
                        const translatedErrors = errors.map(error => 
                            typeof error === 'string' ? translateDjangoError(error) : String(error)
                        );
                        return `❌ ${translatedErrors.join(', ')}`;
                    }
                }
                return '❌ Ha ocurrido un error inesperado. Por favor, contacta al soporte.';
        }
    };

    // Manejador de envío del formulario MEJORADO
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // 1. Validación de Monto
        const montoValue = parseFloat(formData.monto as string);
        if (isNaN(montoValue) || montoValue <= 0) {
            setMessage({ 
                type: 'error', 
                text: '❌ Por favor ingresa un monto válido mayor a cero.' 
            });
            setLoading(false);
            return;
        }

        // 2. Validación de Fecha de Expiración
        // Esta es una validación de UX, el Backend también la hace.
        if (formData.expiration_date && formData.expiration_date.includes('/')) {
            const [month, year] = formData.expiration_date.split('/');
            
            // Asume que la fecha es MM/YY
            const currentYear = new Date().getFullYear() % 100; // Ej: 25 para 2025
            const currentMonth = new Date().getMonth() + 1; // 1-12
            
            const expMonth = parseInt(month);
            const expYear = parseInt(year);
            
            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                setMessage({ 
                    type: 'error', 
                    text: '❌ La tarjeta está vencida. Verifica la fecha de expiración.' 
                });
                setLoading(false);
                return;
            }
        } else if (formData.expiration_date.length !== 5) {
             setMessage({ 
                    type: 'error', 
                    text: '❌ La fecha de expiración debe tener formato MM/YY.' 
                });
                setLoading(false);
                return;
        }


        // 3. Preparación de datos (con monto como número)
        const dataToSend = {
            ...formData,
            monto: montoValue
        };
        
        try {
            // El endpoint POST /transactions/ es PÚBLICO (AllowAny) en tu Backend.
            const response = await axios.post(API_URL, dataToSend);
            
            if (response.status === 201) {
                setMessage({ 
                    type: 'success', 
                    text: `✅ ¡Pago simulado exitosamente! ID: ${response.data.id}` 
                });
                setFormData(initialFormData); // Limpiar formulario
            }

        } catch (error) {
            console.error("Error al registrar la transacción:", error);
            // Uso de la función robusta para mostrar el error en español
            const errorMessage = getErrorMessage(error);
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };
    
    // Función de ayuda para aplicar estilos de guía UI/UX
    const getMessageStyle = () => ({
        color: message?.type === 'success' ? 'var(--accent1)' : 'var(--accent2)',
        fontWeight: 'bold',
        fontSize: '14px',
        marginTop: '10px'
    });

    // Interfaz gráfica
    return (
        <div style={{ 
            maxWidth: '500px', 
            margin: '50px auto', 
            padding: '40px', 
            backgroundColor: 'var(--bg-sec)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px var(--shadow)'
        }}>
            <h1 style={{ color: 'var(--titles)', textAlign: 'center' }}>Mini-Pasarela de Pagos</h1>

            {/* Mensaje de estado */}
            {message && <p style={getMessageStyle()}>{message.text}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                
                {/* Monto (Cantidad) */}
                <div>
                    <label style={{ color: 'var(--pg)' }}>Monto (USD):</label>
                    <input 
                        type="number" 
                        name="monto" 
                        value={formData.monto} 
                        onChange={handleChange} 
                        placeholder="Ej: 50.00"
                        min="0.01"
                        step="0.01"
                        required 
                    />
                </div>
                
                {/* Descripción de la transacción */}
                <div>
                    <label style={{ color: 'var(--pg)' }}>Descripción:</label>
                    <input 
                        type="text" 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                {/* Nombre de quien realiza la transacción */}
                <div>
                    <label style={{ color: 'var(--pg)' }}>Nombre Completo:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                {/* Tipo de Documento */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ color: 'var(--pg)' }}>Tipo de Documento:</label>
                        <select name="document_type" value={formData.document_type} onChange={handleChange} required>
                            <option value="CC">Cédula</option>
                            <option value="PP">Pasaporte</option>
                        </select>
                    </div>

                    <div style={{ flex: 2 }}>
                        <label style={{ color: 'var(--pg)' }}>Número de Documento:</label>
                        <input 
                            type="text" 
                            name="document_number"
                            value={formData.document_number} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ingresa el número de identificación"
                        />
                    </div>
                </div>
                
                {/* --- Datos de Tarjeta --- */}
                <h3 style={{ color: 'var(--titles)', fontSize: '18px', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>Datos de Tarjeta (Simulación)</h3>

                {/* Número de Tarjeta */}
                <div>
                    <label style={{ color: 'var(--pg)' }}>Número de Tarjeta (13-19 dígitos):</label>
                    <input 
                        type="text" 
                        name="card_number" 
                        value={formData.card_number} 
                        onChange={handleChange} 
                        maxLength={19} // Permitir hasta 19, según tu Backend
                        required 
                    />
                </div>
                
                {/* Fecha Vencimiento y 7. CVV en la misma línea */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ color: 'var(--pg)' }}>Vencimiento (MM/YY):</label>
                        <input 
                            type="text" 
                            name="expiration_date" 
                            value={formData.expiration_date} 
                            onChange={handleChange} 
                            placeholder="MM/YY" 
                            maxLength={5} 
                            required 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ color: 'var(--pg)' }}>CVV (3 o 4 dígitos):</label>
                        <input 
                            type="text" 
                            name="security_code" 
                            value={formData.security_code} 
                            onChange={handleChange} 
                            maxLength={4} 
                            required 
                        />
                    </div>
                </div>
                
                {/* Botón de Pagar */}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        backgroundColor: 'var(--accent1)', 
                        color: 'white', 
                        padding: '12px', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        marginTop: '10px'
                    }}
                >
                    {loading ? 'Procesando...' : 'Pagar'}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;