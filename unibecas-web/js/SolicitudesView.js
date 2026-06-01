class SolicitudesView {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.solicitudes = [];
        this.estudiantes = [];
        this.convocatorias = [];
        this.becas = [];
        this.solicitudActual = null;
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

    async loadEstudiantes() {
        try {
            const response = await this.get('/estudiantes');
            this.estudiantes = response.data || [];
            this.populateEstudianteSelect();
        } catch (e) { console.error('Error cargando estudiantes:', e); }
    }

    async loadConvocatorias() {
        try {
            const response = await this.get('/convocatorias');
            this.convocatorias = response.data || [];
            this.populateConvocatoriaSelect();
        } catch (e) { console.error('Error cargando convocatorias:', e); }
    }

    async loadBecas() {
        try {
            const response = await this.get('/becas');
            this.becas = response.data || [];
        } catch (e) { console.error('Error cargando becas:', e); }
    }

    populateEstudianteSelect() {
        const select = document.getElementById('solicitud-estudiante');
        select.innerHTML = '<option value="">Seleccionar estudiante...</option>' +
            this.estudiantes.filter(e => e.activo)
                .map(e => `<option value="${e.id}">${e.codigop} - ${e.nombre} ${e.apellido}</option>`).join('');
    }

    populateConvocatoriaSelect() {
        const select = document.getElementById('solicitud-convocatoria');
        const hoy = new Date().toISOString().split('T')[0];
        const vigentes = this.convocatorias.filter(c => c.fecha_fin >= hoy);
        if (!vigentes.length) {
            select.innerHTML = '<option value="">No hay convocatorias vigentes</option>';
        } else {
            select.innerHTML = '<option value="">Seleccionar convocatoria...</option>' +
                vigentes.map(c => `<option value="${c.id}">${c.descripcion} (${c.periodo}) - Cupos: ${c.cupos_disponibles || c.cupos}</option>`).join('');
        }
    }

    async loadSolicitudes() {
        try {
            const response = await this.get('/solicitudes');
            this.solicitudes = response.data || [];
            this.renderSolicitudes();
        } catch (e) { console.error('Error cargando solicitudes:', e); }
    }

    formatDate(dateStr) {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    getEstadoBadge(estado) {
        const badges = {
            'PENDIENTE': '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">⏳ Pendiente</span>',
            'APROBADA':  '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">✅ Aprobada</span>',
            'RECHAZADA': '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">❌ Rechazada</span>',
        };
        return badges[estado] || `<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">${estado}</span>`;
    }

    renderSolicitudes() {
        const tbody = document.getElementById('solicitudes-table');
        if (!this.solicitudes.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No hay solicitudes registradas</td></tr>';
            return;
        }
        tbody.innerHTML = this.solicitudes.map(s => {
            const convocatoria = `${s.convocatoria_nombre || ''} (${s.convocatoria_periodo || ''})`;
            const canEvaluate = s.estado === 'PENDIENTE';
            return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${s.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                    <div>${s.estudiante_nombre || 'Cargando...'}</div>
                    <div class="text-xs text-gray-500">${s.estudiante_codigo || ''}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">${convocatoria}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${this.formatDate(s.fecha_solicitud)}</td>
                <td class="px-6 py-4">${this.getEstadoBadge(s.estado)}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${s.observaciones || '-'}</td>
                <td class="px-6 py-4 text-right space-x-1">
                    ${canEvaluate ? `<button onclick="openEstadoModal(${s.id})" class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs transition-colors">📋 Evaluar</button>` : ''}
                    <button onclick="deleteSolicitud(${s.id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors">Eliminar</button>
                </td>
            </tr>`;
        }).join('');
    }

    openSolicitudModal() {
        document.getElementById('solicitud-id').value = '';
        document.getElementById('solicitud-estudiante').value = '';
        document.getElementById('solicitud-convocatoria').value = '';
        document.getElementById('solicitud-fecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('solicitud-observaciones').value = '';
        document.getElementById('modal-solicitud').classList.remove('hidden');
    }

    closeSolicitudModal() { document.getElementById('modal-solicitud').classList.add('hidden'); }

    async saveSolicitud() {
        const id_estudiante   = parseInt(document.getElementById('solicitud-estudiante').value);
        const id_convocatoria = parseInt(document.getElementById('solicitud-convocatoria').value);
        const fecha_solicitud = document.getElementById('solicitud-fecha').value;
        const observaciones   = document.getElementById('solicitud-observaciones').value.trim();

        if (!id_estudiante)   return alert('⚠️ Seleccione un estudiante');
        if (!id_convocatoria) return alert('⚠️ Seleccione una convocatoria');
        if (!fecha_solicitud) return alert('⚠️ La fecha es requerida');

        const estudiante = this.estudiantes.find(e => e.id === id_estudiante);
        if (!estudiante || !estudiante.activo) return alert('❌ El estudiante no está activo en el sistema');

        const convocatoria = this.convocatorias.find(c => c.id === id_convocatoria);
        const hoy = new Date().toISOString().split('T')[0];
        if (!convocatoria) return alert('❌ Convocatoria no encontrada');
        if (convocatoria.fecha_fin < hoy) return alert('❌ La convocatoria ya no está vigente');
        if (convocatoria.fecha_inicio > hoy) return alert('❌ La convocatoria aún no ha iniciado');

        const cuposDisponibles = convocatoria.cupos_disponibles ?? convocatoria.cupos;
        if (cuposDisponibles <= 0) return alert('❌ La convocatoria no tiene cupos disponibles');

        const existe = this.solicitudes.find(s => s.id_estudiante === id_estudiante && s.id_convocatoria === id_convocatoria);
        if (existe) return alert('❌ El estudiante ya tiene una solicitud para esta convocatoria');

        try {
            await this.post('/solicitudes', { id_estudiante, id_convocatoria, fecha_solicitud, estado: 'PENDIENTE', observaciones });
            this.closeSolicitudModal();
            await this.loadSolicitudes();
            await this.loadConvocatorias();
            alert('✅ Solicitud registrada correctamente');
        } catch (e) { alert('❌ Error al guardar solicitud'); console.error(e); }
    }

    async openEstadoModal(id) {
        const s = this.solicitudes.find(x => x.id === id);
        if (!s) return;
        this.solicitudActual = s;

        const convocatoria = this.convocatorias.find(c => c.id === s.id_convocatoria);
        const beca = convocatoria ? this.becas.find(b => b.id === convocatoria.id_beca) : null;

        document.getElementById('estado-solicitud-id').value = id;
        document.getElementById('eval-estudiante').textContent = `${s.estudiante_nombre || 'N/A'} (${s.estudiante_codigo || ''})`;
        document.getElementById('eval-convocatoria').textContent = convocatoria ? `${convocatoria.descripcion} (${convocatoria.periodo})` : 'N/A';
        document.getElementById('eval-beca').textContent = beca ? `${beca.nombre} - ${beca.porcentaje}%` : 'N/A';
        document.getElementById('estado-valor').value = 'PENDIENTE';
        document.getElementById('estado-observaciones').value = '';

        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        document.getElementById('asig-fecha-inicio').value = fechaInicio.toISOString().split('T')[0];
        document.getElementById('asig-fecha-fin').value = fechaFin.toISOString().split('T')[0];
        document.getElementById('campos-asignacion').classList.add('hidden');
        document.getElementById('modal-estado').classList.remove('hidden');
    }

    closeEstadoModal() {
        document.getElementById('modal-estado').classList.add('hidden');
        this.solicitudActual = null;
    }

    toggleAsignacionFields() {
        const estado = document.getElementById('estado-valor').value;
        const campos = document.getElementById('campos-asignacion');
        if (estado === 'APROBADA') {
            campos.classList.remove('hidden');
            document.getElementById('asig-fecha-inicio').required = true;
            document.getElementById('asig-fecha-fin').required = true;
        } else {
            campos.classList.add('hidden');
            document.getElementById('asig-fecha-inicio').required = false;
            document.getElementById('asig-fecha-fin').required = false;
        }
    }

    async saveEstado() {
        const id           = document.getElementById('estado-solicitud-id').value;
        const estado       = document.getElementById('estado-valor').value;
        const observaciones = document.getElementById('estado-observaciones').value.trim();

        if (estado === 'PENDIENTE') return alert('⚠️ Debe seleccionar Aprobar o Rechazar');

        try {
            if (estado === 'APROBADA') {
                const fechaInicio = document.getElementById('asig-fecha-inicio').value;
                const fechaFin    = document.getElementById('asig-fecha-fin').value;
                if (!fechaInicio || !fechaFin) return alert('⚠️ Las fechas de vigencia son requeridas');
                if (fechaFin <= fechaInicio) return alert('⚠️ La fecha fin debe ser posterior a la fecha inicio');

                const convocatoria = this.convocatorias.find(c => c.id === this.solicitudActual.id_convocatoria);
                const beca = convocatoria ? this.becas.find(b => b.id === convocatoria.id_beca) : null;

                await this.put(`/solicitudes/${id}`, { estado: 'APROBADA', observaciones: observaciones || 'Solicitud aprobada' });

                try {
                    await this.post('/asignaciones', {
                        id_solicitud: parseInt(id),
                        descripcion: `Asignación de beca: ${beca ? beca.nombre : 'Beca'}`,
                        periodo: convocatoria ? convocatoria.periodo : 'N/A',
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin,
                    });
                    alert('✅ Solicitud APROBADA y Asignación creada exitosamente');
                } catch (e) {
                    alert('⚠️ Solicitud aprobada pero hubo un error al crear la asignación.');
                }
            } else {
                if (!observaciones) return alert('⚠️ Debe indicar el motivo del rechazo');
                await this.put(`/solicitudes/${id}`, { estado: 'RECHAZADA', observaciones });
                alert('❌ Solicitud RECHAZADA');
            }

            this.closeEstadoModal();
            await this.loadSolicitudes();
            await this.loadConvocatorias();
        } catch (e) { alert('❌ Error al procesar la decisión'); console.error(e); }
    }

    async deleteSolicitud(id) {
        const s = this.solicitudes.find(x => x.id === id);
        if (s && s.estado === 'APROBADA') {
            if (!confirm('⚠️ Esta solicitud está APROBADA. ¿Continuar?')) return;
        } else {
            if (!confirm('¿Seguro que desea eliminar esta solicitud?')) return;
        }
        try {
            await this.delete(`/solicitudes/${id}`);
            await this.loadSolicitudes();
            alert('✅ Solicitud eliminada');
        } catch (e) { alert('❌ Error al eliminar solicitud'); }
    }
}

const ctrl = new SolicitudesView();

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('navbar');
    ctrl.loadEstudiantes();
    ctrl.loadConvocatorias();
    ctrl.loadBecas();
    ctrl.loadSolicitudes();
});

function openSolicitudModal()       { ctrl.openSolicitudModal(); }
function closeSolicitudModal()      { ctrl.closeSolicitudModal(); }
function saveSolicitud()            { ctrl.saveSolicitud(); }
function deleteSolicitud(id)        { ctrl.deleteSolicitud(id); }
function openEstadoModal(id)        { ctrl.openEstadoModal(id); }
function closeEstadoModal()         { ctrl.closeEstadoModal(); }
function toggleAsignacionFields()   { ctrl.toggleAsignacionFields(); }
function saveEstado()               { ctrl.saveEstado(); }
