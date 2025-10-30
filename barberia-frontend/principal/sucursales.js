// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Variables globales
let todasLasSucursales = [];
let sucursalAEliminarId = null;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    cargarSucursales();
});

// Cargar todas las sucursales
async function cargarSucursales() {
    try {
        const response = await fetch(`${API_BASE_URL}/sucursales`);
        if (!response.ok) throw new Error('Error al cargar sucursales');
        
        todasLasSucursales = await response.json();
        
        if (todasLasSucursales.length === 0) {
            mostrarSinResultados();
        } else {
            ocultarSinResultados();
            mostrarSucursales();
            calcularEstadisticas();
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar las sucursales');
    }
}

// Mostrar sucursales en la interfaz
function mostrarSucursales() {
    const container = document.getElementById('sucursales-lista');
    
    container.innerHTML = todasLasSucursales.map(sucursal => {
        const activa = sucursal.activa !== false; // Por defecto activa si no está definido
        const estadoClase = activa ? 'status-activa' : 'status-inactiva';
        const estadoTexto = activa ? 'Activa' : 'Inactiva';
        
        return `
            <div class="col-lg-6">
                <div class="sucursal-card">
                    <div class="sucursal-header-card">
                        <div class="sucursal-title-section">
                            <h3>${sucursal.nombre}</h3>
                            <span class="sucursal-status ${estadoClase}">${estadoTexto}</span>
                        </div>
                    </div>
                    
                    <div class="sucursal-body">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="info-content">
                                <label>Dirección</label>
                                <span>${sucursal.direccion}</span>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <div class="info-content">
                                <label>Teléfono</label>
                                <span>${sucursal.telefono}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <div class="info-content">
                            <label>Horario de Atención</label>
                            <span class="horario-content">${sucursal.horario}</span>
                        </div>
                    </div>
                    
                    <div class="sucursal-footer">
                        <button class="btn-action btn-info" onclick="verDetallesSucursal(${sucursal.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                        <button class="btn-action btn-warning" onclick="editarSucursal(${sucursal.id})" title="Editar">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-action btn-danger" onclick="confirmarEliminarSucursal(${sucursal.id})" title="Eliminar">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Calcular estadísticas
function calcularEstadisticas() {
    const totalSucursales = todasLasSucursales.length;
    const sucursalesActivas = todasLasSucursales.filter(s => s.activa !== false).length;
    
    // Extraer ciudades únicas (asumiendo que la dirección contiene la ciudad)
    const ciudades = new Set(todasLasSucursales.map(s => {
        // Intentar extraer la ciudad de la dirección
        const partes = s.direccion.split(',');
        return partes.length > 1 ? partes[partes.length - 1].trim() : 'N/A';
    }));
    const ciudadesCubiertas = ciudades.size;
    
    // Actualizar elementos
    document.getElementById('totalSucursales').textContent = totalSucursales;
    document.getElementById('sucursalesActivas').textContent = sucursalesActivas;
    document.getElementById('ciudadesCubiertas').textContent = ciudadesCubiertas;
}

// Mostrar modal para nueva sucursal
function mostrarModalNuevaSucursal() {
    document.getElementById('sucursalForm').reset();
    document.getElementById('sucursalId').value = '';
    document.getElementById('modalTitleText').textContent = 'Nueva Sucursal';
    document.getElementById('sucursalActiva').checked = true;
    
    const modal = new bootstrap.Modal(document.getElementById('sucursalModal'));
    modal.show();
}

// Editar sucursal existente
async function editarSucursal(sucursalId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sucursales/${sucursalId}`);
        if (!response.ok) throw new Error('Error al cargar sucursal');
        
        const sucursal = await response.json();
        
        // Llenar formulario
        document.getElementById('sucursalId').value = sucursal.id;
        document.getElementById('sucursalNombre').value = sucursal.nombre;
        document.getElementById('sucursalTelefono').value = sucursal.telefono;
        document.getElementById('sucursalDireccion').value = sucursal.direccion;
        document.getElementById('sucursalHorario').value = sucursal.horario;
        document.getElementById('sucursalActiva').checked = sucursal.activa !== false;
        
        document.getElementById('modalTitleText').textContent = 'Editar Sucursal';
        
        const modal = new bootstrap.Modal(document.getElementById('sucursalModal'));
        modal.show();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los datos de la sucursal', 'error');
    }
}

// Guardar sucursal (crear o actualizar)
async function guardarSucursal() {
    const sucursalId = document.getElementById('sucursalId').value;
    const nombre = document.getElementById('sucursalNombre').value.trim();
    const telefono = document.getElementById('sucursalTelefono').value.trim();
    const direccion = document.getElementById('sucursalDireccion').value.trim();
    const horario = document.getElementById('sucursalHorario').value.trim();
    const activa = document.getElementById('sucursalActiva').checked;
    
    // Validar campos
    if (!nombre || !telefono || !direccion || !horario) {
        mostrarNotificacion('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    const sucursalData = {
        nombre,
        telefono,
        direccion,
        horario,
        activa
    };
    
    try {
        let response;
        
        if (sucursalId) {
            // Actualizar sucursal existente
            response = await fetch(`${API_BASE_URL}/sucursales/${sucursalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: parseInt(sucursalId), ...sucursalData })
            });
        } else {
            // Crear nueva sucursal
            response = await fetch(`${API_BASE_URL}/sucursales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sucursalData)
            });
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al guardar sucursal');
        }
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('sucursalModal'));
        modal.hide();
        
        // Recargar sucursales
        await cargarSucursales();
        
        mostrarNotificacion(
            sucursalId ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente',
            'success'
        );
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar la sucursal: ' + error.message, 'error');
    }
}

// Ver detalles de sucursal
async function verDetallesSucursal(sucursalId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sucursales/${sucursalId}`);
        if (!response.ok) throw new Error('Error al cargar detalles');
        
        const sucursal = await response.json();
        mostrarModalDetalles(sucursal);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los detalles de la sucursal', 'error');
    }
}

// Mostrar modal con detalles
function mostrarModalDetalles(sucursal) {
    const activa = sucursal.activa !== false;
    const estadoClase = activa ? 'status-activa' : 'status-inactiva';
    const estadoTexto = activa ? 'Activa' : 'Inactiva';
    
    const contenido = `
        <div class="detalle-sucursal">
            <div class="detalle-item">
                <label>Nombre</label>
                <span>${sucursal.nombre}</span>
            </div>
            <div class="detalle-item">
                <label>Estado</label>
                <span class="sucursal-status ${estadoClase}">${estadoTexto}</span>
            </div>
            <div class="detalle-item full-width">
                <label>Dirección</label>
                <span>${sucursal.direccion}</span>
            </div>
            <div class="detalle-item">
                <label>Teléfono</label>
                <span>${sucursal.telefono}</span>
            </div>
            <div class="detalle-item full-width">
                <label>Horario de Atención</label>
                <span style="white-space: pre-line;">${sucursal.horario}</span>
            </div>
        </div>
    `;
    
    document.getElementById('detallesSucursalContent').innerHTML = contenido;
    
    const modal = new bootstrap.Modal(document.getElementById('detallesSucursalModal'));
    modal.show();
}

// Confirmar eliminación de sucursal
function confirmarEliminarSucursal(sucursalId) {
    const sucursal = todasLasSucursales.find(s => s.id === sucursalId);
    if (!sucursal) return;
    
    sucursalAEliminarId = sucursalId;
    
    document.getElementById('sucursalAEliminar').innerHTML = `
        <div class="alert alert-info">
            <strong>Sucursal:</strong> ${sucursal.nombre}<br>
            <strong>Dirección:</strong> ${sucursal.direccion}
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('confirmarEliminacionModal'));
    modal.show();
}

// Eliminar sucursal
async function confirmarEliminacion() {
    if (!sucursalAEliminarId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/sucursales/${sucursalAEliminarId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar sucursal');
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminacionModal'));
        modal.hide();
        
        // Recargar sucursales
        await cargarSucursales();
        
        mostrarNotificacion('Sucursal eliminada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar la sucursal', 'error');
    } finally {
        sucursalAEliminarId = null;
    }
}

// Actualizar sucursales
async function actualizarSucursales() {
    const btnActualizar = document.querySelector('.btn-secondary');
    const originalText = btnActualizar.innerHTML;
    
    btnActualizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    btnActualizar.disabled = true;
    
    try {
        await cargarSucursales();
        mostrarNotificacion('Datos actualizados exitosamente', 'success');
    } catch (error) {
        mostrarNotificacion('Error al actualizar los datos', 'error');
    } finally {
        btnActualizar.innerHTML = originalText;
        btnActualizar.disabled = false;
    }
}

// Mostrar/ocultar sin resultados
function mostrarSinResultados() {
    document.getElementById('sin-resultados').style.display = 'block';
    document.querySelector('.sucursales-container').style.display = 'none';
    document.querySelector('.estadisticas-container').style.display = 'none';
}

function ocultarSinResultados() {
    document.getElementById('sin-resultados').style.display = 'none';
    document.querySelector('.sucursales-container').style.display = 'block';
    document.querySelector('.estadisticas-container').style.display = 'block';
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} notification`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Mostrar errores
function mostrarError(mensaje) {
    const container = document.getElementById('sucursales-lista');
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${mensaje}
                </div>
                <button class="btn btn-primary" onclick="cargarSucursales()">
                    <i class="fas fa-sync-alt"></i> Reintentar
                </button>
            </div>
        `;
    }
}

// Función para ir a citas registradas
function verCitasRegistradas() {
    window.location.href = 'citas-registradas.html';
}

// Validaciones del formulario en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sucursalForm');
    if (form) {
        // Validar teléfono
        const telefonoInput = document.getElementById('sucursalTelefono');
        if (telefonoInput) {
            telefonoInput.addEventListener('input', function() {
                // Permitir solo números, espacios, guiones, paréntesis y el signo +
                this.value = this.value.replace(/[^0-9\s\-\+\(\)]/g, '');
            });
        }
        
        // Prevenir envío del formulario con Enter
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                guardarSucursal();
            }
        });
    }
});