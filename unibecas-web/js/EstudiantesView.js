class EstudiantesView {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.estudiantes = [];
        this.carreras = [];
        this.currentEstudianteId = null;
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

    // ==================== CARRERAS (para select) ====================

    async loadCarreras() {
        try {
            const response = await this.get('/carreras');
            this.carreras = response.data || [];
            this.populateCarreraSelect();
        } catch (e) { console.error('Error cargando carreras:', e); }
    }

    populateCarreraSelect() {
        const select = document.getElementById('inscribir-carrera');
        select.innerHTML = '<option value="">Seleccionar carrera...</option>' +
            this.carreras.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    }

    // ==================== ESTUDIANTES ====================

    async loadEstudiantes() {
        try {
            const response = await this.get('/estudiantes');
            this.estudiantes = response.data || [];
            this.renderEstudiantes();
        } catch (e) { console.error('Error cargando estudiantes:', e); }
    }

    renderEstudiantes() {
        const tbody = document.getElementById('estudiantes-table');
        if (!this.estudiantes.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">No hay estudiantes registrados</td></tr>';
            return;
        }
        tbody.innerHTML = this.estudiantes.map(e => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">${e.id}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-mono">${e.codigop}</td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">${e.nombre} ${e.apellido}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${e.email}</td>
                <td class="px-6 py-4 text-sm text-gray-800">${parseFloat(e.ppa).toFixed(2)}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${e.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${e.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                    ${e.carreras || '<span class="text-gray-400 italic">Sin carreras</span>'}
                </td>
                <td class="px-6 py-4 text-right space-x-1">
                    <button onclick="verCarreras(${e.id})" class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs transition-colors" title="Ver carreras">📚</button>
                    <button onclick="openInscribirModal(${e.id})" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors" title="Inscribir">+📚</button>
                    <button onclick="editEstudiante(${e.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">Editar</button>
                    <button onclick="deleteEstudiante(${e.id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors">Eliminar</button>
                </td>
            </tr>`).join('');
    }

    openEstudianteModal(data = null) {
        document.getElementById('modal-estudiante-title').textContent = data ? 'Editar Estudiante' : 'Nuevo Estudiante';
        document.getElementById('estudiante-id').value = data ? data.id : '';
        document.getElementById('estudiante-codigo').value = data ? data.codigop : '';
        document.getElementById('estudiante-nombre').value = data ? data.nombre : '';
        document.getElementById('estudiante-apellido').value = data ? data.apellido : '';
        document.getElementById('estudiante-email').value = data ? data.email : '';
        document.getElementById('estudiante-ppa').value = data ? data.ppa : '';
        document.getElementById('estudiante-activo').value = data ? String(data.activo) : 'true';
        document.getElementById('modal-estudiante').classList.remove('hidden');
    }

    closeEstudianteModal() { document.getElementById('modal-estudiante').classList.add('hidden'); }

    async saveEstudiante() {
        const id       = document.getElementById('estudiante-id').value;
        const codigop  = document.getElementById('estudiante-codigo').value.trim();
        const nombre   = document.getElementById('estudiante-nombre').value.trim();
        const apellido = document.getElementById('estudiante-apellido').value.trim();
        const email    = document.getElementById('estudiante-email').value.trim();
        const ppa      = parseFloat(document.getElementById('estudiante-ppa').value);
        const activo   = document.getElementById('estudiante-activo').value === 'true';

        if (!codigop || !nombre || !apellido || !email) return alert('Todos los campos son requeridos');

        try {
            const data = { codigop, nombre, apellido, email, ppa, activo };
            if (id) await this.put(`/estudiantes/${id}`, data);
            else    await this.post('/estudiantes', data);
            this.closeEstudianteModal();
            this.loadEstudiantes();
        } catch (e) { alert('Error al guardar estudiante'); console.error(e); }
    }

    editEstudiante(id) {
        const e = this.estudiantes.find(x => x.id === id);
        if (e) this.openEstudianteModal(e);
    }

    async deleteEstudiante(id) {
        if (!confirm('¿Seguro que desea eliminar este estudiante?')) return;
        try {
            await this.delete(`/estudiantes/${id}`);
            this.loadEstudiantes();
        } catch (e) { alert('Error al eliminar estudiante'); }
    }

    // ==================== INSCRIPCIÓN A CARRERAS ====================

    openInscribirModal(estudianteId) {
        const estudiante = this.estudiantes.find(e => e.id === estudianteId);
        document.getElementById('modal-inscribir-title').textContent = `Inscribir a ${estudiante.nombre} ${estudiante.apellido}`;
        document.getElementById('inscribir-estudiante-id').value = estudianteId;
        document.getElementById('inscribir-carrera').value = '';
        document.getElementById('inscribir-fecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('modal-inscribir').classList.remove('hidden');
    }

    closeInscribirModal() { document.getElementById('modal-inscribir').classList.add('hidden'); }

    async inscribirCarrera() {
        const estudianteId = document.getElementById('inscribir-estudiante-id').value;
        const carreraId    = document.getElementById('inscribir-carrera').value;
        const fecha        = document.getElementById('inscribir-fecha').value;
        if (!carreraId || !fecha) return alert('Seleccione una carrera y fecha');
        try {
            await this.post(`/estudiantes/${estudianteId}/carreras`, { id_carrera: parseInt(carreraId), fecha_inscripcion: fecha });
            this.closeInscribirModal();
            this.loadEstudiantes();
            alert('Estudiante inscrito correctamente');
        } catch (e) { alert('Error al inscribir estudiante'); console.error(e); }
    }

    // ==================== VER CARRERAS DEL ESTUDIANTE ====================

    async verCarreras(estudianteId) {
        this.currentEstudianteId = estudianteId;
        const estudiante = this.estudiantes.find(e => e.id === estudianteId);
        document.getElementById('modal-carreras-title').textContent = `Carreras de ${estudiante.nombre} ${estudiante.apellido}`;
        try {
            const response = await this.get(`/estudiantes/${estudianteId}/carreras`);
            const lista = response.data || [];
            const list = document.getElementById('carreras-estudiante-list');
            if (!lista.length) {
                list.innerHTML = '<p class="text-gray-500 text-center py-4">Este estudiante no está inscrito en ninguna carrera</p>';
            } else {
                list.innerHTML = lista.map(c => `
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-gray-800">${c.carrera_nombre}</p>
                            <p class="text-sm text-gray-500">Inscrito: ${new Date(c.fecha_inscripcion).toLocaleDateString()}</p>
                        </div>
                        <button onclick="desinscribirCarrera(${estudianteId}, ${c.id_carrera})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Desinscribir</button>
                    </div>`).join('');
            }
            document.getElementById('modal-carreras').classList.remove('hidden');
        } catch (e) { alert('Error al cargar carreras del estudiante'); console.error(e); }
    }

    closeCarrerasModal() {
        document.getElementById('modal-carreras').classList.add('hidden');
        this.currentEstudianteId = null;
    }

    async desinscribirCarrera(estudianteId, carreraId) {
        if (!confirm('¿Seguro que desea desinscribir de esta carrera?')) return;
        try {
            await this.delete(`/estudiantes/${estudianteId}/carreras/${carreraId}`);
            this.verCarreras(estudianteId);
            this.loadEstudiantes();
        } catch (e) { alert('Error al desinscribir estudiante'); }
    }
}

const ctrl = new EstudiantesView();

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('navbar');
    ctrl.loadEstudiantes();
    ctrl.loadCarreras();
});

function openEstudianteModal(data)          { ctrl.openEstudianteModal(data); }
function closeEstudianteModal()             { ctrl.closeEstudianteModal(); }
function saveEstudiante()                   { ctrl.saveEstudiante(); }
function editEstudiante(id)                 { ctrl.editEstudiante(id); }
function deleteEstudiante(id)               { ctrl.deleteEstudiante(id); }
function openInscribirModal(id)             { ctrl.openInscribirModal(id); }
function closeInscribirModal()              { ctrl.closeInscribirModal(); }
function inscribirCarrera()                 { ctrl.inscribirCarrera(); }
function verCarreras(id)                    { ctrl.verCarreras(id); }
function closeCarrerasModal()               { ctrl.closeCarrerasModal(); }
function desinscribirCarrera(estId, carId)  { ctrl.desinscribirCarrera(estId, carId); }
