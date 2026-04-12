let facultades = [];
let carreras = [];

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("navbar");
  loadFacultades();
  loadCarreras();
});

// ==================== FACULTADES ====================

async function loadFacultades() {
  try {
    const response = await api.get("/facultades");
    facultades = response.data || [];
    renderFacultades();
    populateFacultadSelect();
  } catch (e) {
    console.error("Error cargando facultades:", e);
  }
}

function renderFacultades() {
  const tbody = document.getElementById("facultades-table");
  if (!facultades.length) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay facultades registradas</td></tr>';
    return;
  }
  tbody.innerHTML = facultades
    .map(
      (f) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">${f.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${f.nombre}</td>
            <td class="px-6 py-4 text-right space-x-2">
                <button onclick="editFacultad(${f.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                <button onclick="deleteFacultad(${f.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function populateFacultadSelect() {
  const select = document.getElementById("carrera-facultad");
  select.innerHTML =
    '<option value="">Seleccionar facultad...</option>' +
    facultades
      .map((f) => `<option value="${f.id}">${f.nombre}</option>`)
      .join("");
}

function openFacultadModal(data = null) {
  document.getElementById("modal-facultad-title").textContent = data
    ? "Editar Facultad"
    : "Nueva Facultad";
  document.getElementById("facultad-id").value = data ? data.id : "";
  document.getElementById("facultad-nombre").value = data ? data.nombre : "";
  document.getElementById("modal-facultad").classList.remove("hidden");
}

function closeFacultadModal() {
  document.getElementById("modal-facultad").classList.add("hidden");
}

async function saveFacultad() {
  const id = document.getElementById("facultad-id").value;
  const nombre = document.getElementById("facultad-nombre").value.trim();
  if (!nombre) return alert("El nombre es requerido");

  try {
    if (id) {
      await api.put(`/facultades/${id}`, { nombre });
    } else {
      await api.post("/facultades", { nombre });
    }
    closeFacultadModal();
    loadFacultades();
  } catch (e) {
    alert("Error al guardar facultad");
  }
}

function editFacultad(id) {
  const f = facultades.find((x) => x.id === id);
  if (f) openFacultadModal(f);
}

async function deleteFacultad(id) {
  if (!confirm("¿Seguro que desea eliminar esta facultad?")) return;
  try {
    await api.delete(`/facultades/${id}`);
    loadFacultades();
  } catch (e) {
    alert("Error al eliminar facultad");
  }
}

// ==================== CARRERAS ====================

async function loadCarreras() {
  try {
    const response = await api.get("/carreras");
    carreras = response.data || [];
    renderCarreras();
  } catch (e) {
    console.error("Error cargando carreras:", e);
  }
}

function renderCarreras() {
  const tbody = document.getElementById("carreras-table");
  if (!carreras.length) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No hay carreras registradas</td></tr>';
    return;
  }
  tbody.innerHTML = carreras
    .map((c) => {
      // El controlador devuelve id_facultad y facultad_nombre del JOIN
      const facultadId = c.id_facultad || c.facultad_id;
      const facultadNombre =
        c.facultad_nombre ||
        (facultades.find((f) => f.id === facultadId) || {}).nombre ||
        "-";
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
    })
    .join("");
}

function openCarreraModal(data = null) {
  document.getElementById("modal-carrera-title").textContent = data
    ? "Editar Carrera"
    : "Nueva Carrera";
  document.getElementById("carrera-id").value = data ? data.id : "";
  document.getElementById("carrera-nombre").value = data ? data.nombre : "";
  document.getElementById("carrera-facultad").value = data
    ? data.id_facultad || data.facultad_id
    : "";
  document.getElementById("modal-carrera").classList.remove("hidden");
}

function closeCarreraModal() {
  document.getElementById("modal-carrera").classList.add("hidden");
}

async function saveCarrera() {
  const id = document.getElementById("carrera-id").value;
  const nombre = document.getElementById("carrera-nombre").value.trim();
  const facultad_id = parseInt(
    document.getElementById("carrera-facultad").value,
  );
  if (!nombre) return alert("El nombre es requerido");
  if (!facultad_id) return alert("Seleccione una facultad");

  try {
    if (id) {
      await api.put(`/carreras/${id}`, { nombre, facultad_id });
    } else {
      await api.post("/carreras", { nombre, facultad_id });
    }
    closeCarreraModal();
    loadCarreras();
  } catch (e) {
    alert("Error al guardar carrera");
  }
}

function editCarrera(id) {
  const c = carreras.find((x) => x.id === id);
  if (c) openCarreraModal(c);
}

async function deleteCarrera(id) {
  if (!confirm("¿Seguro que desea eliminar esta carrera?")) return;
  try {
    await api.delete(`/carreras/${id}`);
    loadCarreras();
  } catch (e) {
    alert("Error al eliminar carrera");
  }
}
