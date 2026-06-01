class BecasView {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.tiposBeca = [];
        this.becas = [];
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

    // ==================== TIPOS DE BECA ====================

    async loadTipos() {
        try {
            const response = await this.get('/tipos-beca');
            this.tiposBeca = response.data || [];
            this.renderTipos();
            this.populateTipoSelect();
        } catch (e) { console.error('Error cargando tipos de beca:', e); }
    }

    renderTipos() {
        const tbody = document.getElementById('tipos-table');
        if (!this.tiposBeca.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay tipos de beca registrados</td></tr>';
            return;
        }
        tbody.innerHTML = this.tiposBeca.map(t => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${t.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">${t.nombre}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="editTipo(${t.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                    <button onclick="deleteTipo(${t.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
                </td>
            </tr>`).join('');
    }

    populateTipoSelect() {
        const select = document.getElementById('beca-tipo');
        select.innerHTML = '<option value="">Seleccionar tipo...</option>' +
            this.tiposBeca.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');
    }

    openTipoModal(data = null) {
        document.getElementById('modal-tipo-title').textContent = data ? 'Editar Tipo de Beca' : 'Nuevo Tipo de Beca';
        document.getElementById('tipo-id').value = data ? data.id : '';
        document.getElementById('tipo-nombre').value = data ? data.nombre : '';
        document.getElementById('modal-tipo').classList.remove('hidden');
    }

    closeTipoModal() { document.getElementById('modal-tipo').classList.add('hidden'); }

    async saveTipo() {
        const id = document.getElementById('tipo-id').value;
        const nombre = document.getElementById('tipo-nombre').value.trim();
        if (!nombre) return alert('El nombre es requerido');
        try {
            if (id) await this.put(`/tipos-beca/${id}`, { nombre });
            else    await this.post('/tipos-beca', { nombre });
            this.closeTipoModal();
            this.loadTipos();
        } catch (e) { alert('Error al guardar tipo de beca'); }
    }

    editTipo(id) {
        const t = this.tiposBeca.find(x => x.id === id);
        if (t) this.openTipoModal(t);
    }

    async deleteTipo(id) {
        if (!confirm('¿Seguro que desea eliminar este tipo de beca?')) return;
        try {
            await this.delete(`/tipos-beca/${id}`);
            this.loadTipos();
        } catch (e) { alert('Error al eliminar tipo de beca'); }
    }

    // ==================== BECAS ====================

    async loadBecas() {
        try {
            const response = await this.get('/becas');
            this.becas = response.data || [];
            this.renderBecas();
        } catch (e) { console.error('Error cargando becas:', e); }
    }

    renderBecas() {
        const tbody = document.getElementById('becas-table');
        if (!this.becas.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay becas registradas</td></tr>';
            return;
        }
        tbody.innerHTML = this.becas.map(b => {
            const tipoNombre = b.tipo_nombre || (this.tiposBeca.find(t => t.id === b.id_tipob) || {}).nombre || '-';
            const badge = b.activo
                ? '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>'
                : '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inactivo</span>';
            return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${b.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">${b.nombre}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${tipoNombre}</td>
                <td class="px-6 py-4 text-sm text-gray-800">${b.porcentaje}%</td>
                <td class="px-6 py-4">${badge}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="editBeca(${b.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                    <button onclick="deleteBeca(${b.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
                </td>
            </tr>`;
        }).join('');
    }

    openBecaModal(data = null) {
        document.getElementById('modal-beca-title').textContent = data ? 'Editar Beca' : 'Nueva Beca';
        document.getElementById('beca-id').value = data ? data.id : '';
        document.getElementById('beca-nombre').value = data ? data.nombre : '';
        document.getElementById('beca-descripcion').value = data ? (data.descripcion || '') : '';
        document.getElementById('beca-porcentaje').value = data ? data.porcentaje : '';
        document.getElementById('beca-tipo').value = data ? data.id_tipob : '';
        document.getElementById('beca-activo').checked = data ? data.activo : true;
        document.getElementById('modal-beca').classList.remove('hidden');
    }

    closeBecaModal() { document.getElementById('modal-beca').classList.add('hidden'); }

    async saveBeca() {
        const id          = document.getElementById('beca-id').value;
        const nombre      = document.getElementById('beca-nombre').value.trim();
        const descripcion = document.getElementById('beca-descripcion').value.trim();
        const porcentaje  = parseFloat(document.getElementById('beca-porcentaje').value);
        const id_tipob    = parseInt(document.getElementById('beca-tipo').value);
        const activo      = document.getElementById('beca-activo').checked;

        if (!nombre) return alert('El nombre es requerido');
        if (isNaN(porcentaje)) return alert('El porcentaje es requerido');
        if (!id_tipob) return alert('Seleccione un tipo de beca');

        const data = { nombre, descripcion, porcentaje, id_tipob, activo };
        try {
            if (id) await this.put(`/becas/${id}`, data);
            else    await this.post('/becas', data);
            this.closeBecaModal();
            this.loadBecas();
        } catch (e) { alert('Error al guardar beca'); }
    }

    editBeca(id) {
        const b = this.becas.find(x => x.id === id);
        if (b) this.openBecaModal(b);
    }

    async deleteBeca(id) {
        if (!confirm('¿Seguro que desea eliminar esta beca?')) return;
        try {
            await this.delete(`/becas/${id}`);
            this.loadBecas();
        } catch (e) { alert('Error al eliminar beca'); }
    }
}

const ctrl = new BecasView();

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('navbar');
    ctrl.loadTipos();
    ctrl.loadBecas();
});

function openTipoModal(data)  { ctrl.openTipoModal(data); }
function closeTipoModal()     { ctrl.closeTipoModal(); }
function saveTipo()           { ctrl.saveTipo(); }
function editTipo(id)         { ctrl.editTipo(id); }
function deleteTipo(id)       { ctrl.deleteTipo(id); }
function openBecaModal(data)  { ctrl.openBecaModal(data); }
function closeBecaModal()     { ctrl.closeBecaModal(); }
function saveBeca()           { ctrl.saveBeca(); }
function editBeca(id)         { ctrl.editBeca(id); }
function deleteBeca(id)       { ctrl.deleteBeca(id); }
