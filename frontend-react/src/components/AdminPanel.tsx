
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';
import { useAuth } from '../context/AuthContext';
import listado from '../styles/Listado.module.css';

const API_URL = 'http://localhost:8000/api/transactions/';

interface Transaction {
    id: number;
    currency: string;
    monto: number;
    descripcion: string;
    name: string;
    document_type: string;
    document_number: string;
    card_number: string;
    expiration_date: string;
    security_code: string;
    transaction_date: string;
}

const customStyles: TableStyles = {
    tableWrapper: {
        style: {
            boxShadow: '0 2px 8px var(--shadow)', 
            backgroundColor: 'var(--bg-sec)',
            borderRadius: '4px',
            overflow: 'hidden',
        },
    },
    headRow: {
        style: {
            backgroundColor: 'var(--line)',
        },
    },
    headCells: {
        style: {
            color: 'var(--titles)',
            fontWeight: 'bold',
            fontSize: '14px',
            paddingLeft: '10px',
            paddingRight: '10px',
        },
    },
    rows: {
        style: {
            '&:not(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: 'var(--line)',
            },
        },
    },
    cells: {
        style: {
            color: 'var(--pg)',
            paddingLeft: '10px',
            paddingRight: '10px',
        },
    },
    pagination: {
        style: {
            backgroundColor: 'var(--bg-sec)',
            borderTop: '1px solid var(--line)',
            color: 'var(--pg)',
            fontSize: '13px',
            padding: '10px 0',
        },
        pageButtonsStyle: {
            height: '28px',
            width: '28px',
            padding: '0',
            margin: '0 2px',
            backgroundColor: 'transparent',
            color: 'var(--pg)',
            fill: 'var(--bg-ppal)',
            borderRadius: '2px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '12px',
            
            '&:disabled': {
                cursor: 'not-allowed',
                opacity: 0.3,
            },
            '&:hover:not(:disabled)': {
                backgroundColor: 'var(--line)',
            },
            '&:focus': {
                outline: 'none',
                backgroundColor: 'var(--line)',
            },
        },
    },
};

const AdminPanel: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { logout } = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            setError('');
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setError('No hay sesión activa. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(API_URL, { 
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setTransactions(response.data); 
                console.log("Transacciones obtenidas con éxito:", response.data);
            } catch (err: any) {
                console.error("Error al obtener transacciones:", err);
                
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('Tu sesión ha expirado o es inválida. Por favor, vuelve a iniciar sesión.');
                    logout();
                } else {
                    setError('Error al cargar las transacciones. Revisa la consola para más detalles.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [logout]);

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: currency }).format(amount);
    };
    
    // FORMATO DE FECHA CORTO para transacción
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        }).replace(/ de /g, ' ');
    };

    // COLUMNAS CON DESCRIPCIÓN ANCHA Y FECHA DE VENCIMIENTO
    const columns: TableColumn<Transaction>[] = useMemo(() => [
        {
            name: 'Divisa',
            selector: row => row.currency,
            sortable: true,
            width: '100px',
            center: true,
        },
        {
            name: 'Monto',
            selector: row => row.monto,
            sortable: true,
            width: '150px',
            cell: row => (
                <div style={{ color: 'var(--titles)', fontWeight: 'bold' }}>
                    {formatAmount(row.monto, row.currency)}
                </div>
            ),
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            sortable: true,
            width: '200px',
            wrap: true,
            grow: 1, // Permite que crezca si hay espacio disponible
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true,
            width: '180px',
            wrap: true,
        },
        {
            name: 'Doc.',
            selector: row => row.document_number,
            format: row => `${row.document_type}-${row.document_number}`,
            width: '120px',
            wrap: true,
        },
        {
            name: 'Fecha de Trans.',
            selector: row => row.transaction_date,
            cell: row => (
                <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {formatDate(row.transaction_date)}
                </div>
            ),
            sortable: true,
            width: '150px',
            center: true,
        },
        {
            name: 'Vence',
            selector: row => row.expiration_date,
            // AGREGAR FECHA DE VENCIMIENTO DE LA TARJETA
            cell: row => (
                <div style={{ fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {row.expiration_date}
                </div>
            ),
            sortable: true,
            width: '130px',
            center: true,
        },
        {
            name: 'Tarjeta',
            selector: row => row.card_number,
            format: row => `****${row.card_number.slice(-4)}`,
            width: '100px',
            center: true,
        },
    ], []);

    if (loading) return <h1 className={listado.loadingMessage}>Cargando transacciones...</h1>;
    if (error) return <h1 className={listado.errorMessage}>{error}</h1>;

    return (
        <div className={listado.adminPanelContainer}>
            <div className={listado.header}>
                <h1 className={listado.title}>Listado de Transacciones</h1>
                <button 
                    onClick={logout}
                    className={listado.logoutButton}
                >
                    Cerrar Sesión
                </button>
            </div>

            {transactions.length === 0 ? (
                <p className={listado.emptyMessage}>Aún no hay transacciones registradas.</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={transactions}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50]}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    fixedHeader
                    noDataComponent={<p className={listado.emptyMessage}>No hay resultados para tu búsqueda.</p>}
                />
            )}
        </div>
    );
};

export default AdminPanel;