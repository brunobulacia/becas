class AsignacionesView {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.asignaciones = [];
        this.solicitudes = [];
    }

    async get(endpoint) {
        const res = await fetch(`${this.API_BASE}${endpoint}`);
        return res.json();
    }
    async post(endpoint, data) {
        const res = await fetch(`${this.API_BASE}${endpoint}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        return res.json();
    }
    async put(endpoint, data) {
        const res = await fetch(`${this.API_BASE}${endpoint}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        return res.json();
    }
    async delete(endpoint) {
        const res = await fetch(`${this.API_BASE}${endpoint}`, { method: 'DELETE' });
        return res.json();
    }

    async loadSolicitudesAprobadas() {
        try {
            const response = await this.get('/solicitudes');
            this.solicitudes = (response.data || []).filter(s => s.estado === 'APROBADA');
            this.populateSolicitudSelect();
        } catch (e) { console.error('Error cargando solicitudes:', e); }
    }

    populateSolicitudSelect() {
        const select = document.getElementById('asignacion-solicitud');
        select.innerHTML = '<option value="">Seleccionar solicitud aprobada...</option>' +
            this.solicitudes.map(s => `<option value="${s.id}">#${s.id} - ${s.estudiante_nombre} - ${s.convocatoria_nombre}</option>`).join('');
    }

    async loadAsignaciones() {
        try {
            const response = await this.get('/asignaciones');
            this.asignaciones = response.data || [];
            this.renderAsignaciones();
        } catch (e) { console.error('Error cargando asignaciones:', e); }
    }

    formatDate(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    getEstadoVigencia(fechaInicio, fechaFin) {
        const hoy   = new Date();
        const inicio = new Date(fechaInicio);
        const fin    = new Date(fechaFin);
        if (hoy < inicio) return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">⏳ Pendiente</span>';
        if (hoy <= fin)   return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">✅ Vigente</span>';
        return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">⌛ Finalizada</span>';
    }

    renderAsignaciones() {
        const tbody = document.getElementById('asignaciones-table');
        if (!this.asignaciones.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No hay asignaciones registradas</td></tr>';
            return;
        }
        tbody.innerHTML = this.asignaciones.map(a => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${a.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">${a.estudiante_nombre || 'Cargando...'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${a.beca_nombre || '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${a.periodo || '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    <div>${this.formatDate(a.fecha_inicio)}</div>
                    <div class="text-xs text-gray-400">al ${this.formatDate(a.fecha_fin)}</div>
                </td>
                <td class="px-6 py-4">${this.getEstadoVigencia(a.fecha_inicio, a.fecha_fin)}</td>
                <td class="px-6 py-4 text-right space-x-1">
                    <button onclick="openEditAsignacionModal(${a.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">Editar</button>
                    <button onclick="deleteAsignacion(${a.id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors">Eliminar</button>
                </td>
            </tr>`).join('');
    }

    openAsignacionModal() {
        document.getElementById('modal-asignacion-title').textContent = 'Nueva Asignación';
        document.getElementById('asignacion-id').value = '';
        document.getElementById('asignacion-solicitud').value = '';
        document.getElementById('asignacion-descripcion').value = '';
        document.getElementById('asignacion-periodo').value = '';
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        document.getElementById('asignacion-fecha-inicio').value = fechaInicio.toISOString().split('T')[0];
        document.getElementById('asignacion-fecha-fin').value = fechaFin.toISOString().split('T')[0];
        document.getElementById('modal-asignacion').classList.remove('hidden');
    }

    closeAsignacionModal() { document.getElementById('modal-asignacion').classList.add('hidden'); }

    async saveAsignacion() {
        const id          = document.getElementById('asignacion-id').value;
        const id_solicitud = parseInt(document.getElementById('asignacion-solicitud').value);
        const descripcion  = document.getElementById('asignacion-descripcion').value.trim();
        const periodo      = document.getElementById('asignacion-periodo').value.trim();
        const fecha_inicio = document.getElementById('asignacion-fecha-inicio').value;
        const fecha_fin    = document.getElementById('asignacion-fecha-fin').value;

        if (!id_solicitud) return alert('⚠️ Seleccione una solicitud');
        if (!periodo) return alert('⚠️ El periodo es requerido');
        if (!fecha_inicio || !fecha_fin) return alert('⚠️ Las fechas son requeridas');
        if (fecha_fin <= fecha_inicio) return alert('⚠️ La fecha fin debe ser posterior a la fecha inicio');

        const data = { id_solicitud, descripcion, periodo, fecha_inicio, fecha_fin };
        try {
            if (id) { await this.put(`/asignaciones/${id}`, data); alert('✅ Asignación actualizada correctamente'); }
            else    { await this.post('/asignaciones', data);       alert('✅ Asignación creada correctamente'); }
            this.closeAsignacionModal();
            this.loadAsignaciones();
            this.loadSolicitudesAprobadas();
        } catch (e) { alert('❌ Error al guardar asignación'); console.error(e); }
    }

    openEditAsignacionModal(id) {
        const a = this.asignaciones.find(x => x.id === id);
        if (!a) return;
        document.getElementById('modal-asignacion-title').textContent = 'Editar Asignación';
        document.getElementById('asignacion-id').value = id;
        document.getElementById('asignacion-solicitud').value = a.id_solicitud;
        document.getElementById('asignacion-descripcion').value = a.descripcion || '';
        document.getElementById('asignacion-periodo').value = a.periodo || '';
        document.getElementById('asignacion-fecha-inicio').value = a.fecha_inicio ? a.fecha_inicio.split('T')[0] : '';
        document.getElementById('asignacion-fecha-fin').value = a.fecha_fin ? a.fecha_fin.split('T')[0] : '';
        document.getElementById('modal-asignacion').classList.remove('hidden');
    }

    async deleteAsignacion(id) {
        if (!confirm('¿Seguro que desea eliminar esta asignación?')) return;
        try {
            await this.delete(`/asignaciones/${id}`);
            this.loadAsignaciones();
            this.loadSolicitudesAprobadas();
        } catch (e) { alert('Error al eliminar asignación'); }
    }
}

const ctrl = new AsignacionesView();

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('navbar');
    ctrl.loadSolicitudesAprobadas();
    ctrl.loadAsignaciones();
});

function openAsignacionModal()        { ctrl.openAsignacionModal(); }
function closeAsignacionModal()       { ctrl.closeAsignacionModal(); }
function saveAsignacion()             { ctrl.saveAsignacion(); }
function openEditAsignacionModal(id)  { ctrl.openEditAsignacionModal(id); }
function deleteAsignacion(id)         { ctrl.deleteAsignacion(id); }
