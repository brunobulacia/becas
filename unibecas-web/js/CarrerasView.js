class CarrerasView {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.facultades = [];
        this.carreras = [];
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

    // ==================== FACULTADES ====================

    async loadFacultades() {
        try {
            const response = await this.get('/facultades');
            this.facultades = response.data || [];
            this.renderFacultades();
            this.populateFacultadSelect();
        } catch (e) { console.error('Error cargando facultades:', e); }
    }

    renderFacultades() {
        const tbody = document.getElementById('facultades-table');
        if (!this.facultades.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay facultades registradas</td></tr>';
            return;
        }
        tbody.innerHTML = this.facultades.map(f => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${f.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">${f.nombre}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="editFacultad(${f.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                    <button onclick="deleteFacultad(${f.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
                </td>
            </tr>`).join('');
    }

    populateFacultadSelect() {
        const select = document.getElementById('carrera-facultad');
        select.innerHTML = '<option value="">Seleccionar facultad...</option>' +
            this.facultades.map(f => `<option value="${f.id}">${f.nombre}</option>`).join('');
    }

    openFacultadModal(data = null) {
        document.getElementById('modal-facultad-title').textContent = data ? 'Editar Facultad' : 'Nueva Facultad';
        document.getElementById('facultad-id').value = data ? data.id : '';
        document.getElementById('facultad-nombre').value = data ? data.nombre : '';
        document.getElementById('modal-facultad').classList.remove('hidden');
    }

    closeFacultadModal() {
        document.getElementById('modal-facultad').classList.add('hidden');
    }

    async saveFacultad() {
        const id = document.getElementById('facultad-id').value;
        const nombre = document.getElementById('facultad-nombre').value.trim();
        if (!nombre) return alert('El nombre es requerido');
        try {
            if (id) await this.put(`/facultades/${id}`, { nombre });
            else    await this.post('/facultades', { nombre });
            this.closeFacultadModal();
            this.loadFacultades();
        } catch (e) { alert('Error al guardar facultad'); }
    }

    editFacultad(id) {
        const f = this.facultades.find(x => x.id === id);
        if (f) this.openFacultadModal(f);
    }

    async deleteFacultad(id) {
        if (!confirm('¿Seguro que desea eliminar esta facultad?')) return;
        try {
            await this.delete(`/facultades/${id}`);
            this.loadFacultades();
        } catch (e) { alert('Error al eliminar facultad'); }
    }

    // ==================== CARRERAS ====================

    async loadCarreras() {
        try {
            const response = await this.get('/carreras');
            this.carreras = response.data || [];
            this.renderCarreras();
        } catch (e) { console.error('Error cargando carreras:', e); }
    }

    renderCarreras() {
        const tbody = document.getElementById('carreras-table');
        if (!this.carreras.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No hay carreras registradas</td></tr>';
            return;
        }
        tbody.innerHTML = this.carreras.map(c => {
            const facultadId = c.id_facultad || c.facultad_id;
            const facultadNombre = c.facultad_nombre || (this.facultades.find(f => f.id === facultadId) || {}).nombre || '-';
            return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${c.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">${c.nombre}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${facultadNombre}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="editCarrera(${c.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                    <button onclick="deleteCarrera(${c.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
                </td>
            </tr>`;
        }).join('');
    }

    openCarreraModal(data = null) {
        document.getElementById('modal-carrera-title').textContent = data ? 'Editar Carrera' : 'Nueva Carrera';
        document.getElementById('carrera-id').value = data ? data.id : '';
        document.getElementById('carrera-nombre').value = data ? data.nombre : '';
        document.getElementById('carrera-facultad').value = data ? (data.id_facultad || data.facultad_id) : '';
        document.getElementById('modal-carrera').classList.remove('hidden');
    }

    closeCarreraModal() {
        document.getElementById('modal-carrera').classList.add('hidden');
    }

    async saveCarrera() {
        const id = document.getElementById('carrera-id').value;
        const nombre = document.getElementById('carrera-nombre').value.trim();
        const id_facultad = parseInt(document.getElementById('carrera-facultad').value);
        if (!nombre) return alert('El nombre es requerido');
        if (!id_facultad) return alert('Seleccione una facultad');
        try {
            if (id) await this.put(`/carreras/${id}`, { nombre, id_facultad });
            else    await this.post('/carreras', { nombre, id_facultad });
            this.closeCarreraModal();
            this.loadCarreras();
        } catch (e) { alert('Error al guardar carrera'); }
    }

    editCarrera(id) {
        const c = this.carreras.find(x => x.id === id);
        if (c) this.openCarreraModal(c);
    }

    async deleteCarrera(id) {
        if (!confirm('¿Seguro que desea eliminar esta carrera?')) return;
        try {
            await this.delete(`/carreras/${id}`);
            this.loadCarreras();
        } catch (e) { alert('Error al eliminar carrera'); }
    }
}

const ctrl = new CarrerasView();

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('navbar');
    ctrl.loadFacultades();
    ctrl.loadCarreras();
});

function openFacultadModal(data)  { ctrl.openFacultadModal(data); }
function closeFacultadModal()     { ctrl.closeFacultadModal(); }
function saveFacultad()           { ctrl.saveFacultad(); }
function editFacultad(id)         { ctrl.editFacultad(id); }
function deleteFacultad(id)       { ctrl.deleteFacultad(id); }
function openCarreraModal(data)   { ctrl.openCarreraModal(data); }
function closeCarreraModal()      { ctrl.closeCarreraModal(); }
function saveCarrera()            { ctrl.saveCarrera(); }
function editCarrera(id)          { ctrl.editCarrera(id); }
function deleteCarrera(id)        { ctrl.deleteCarrera(id); }
