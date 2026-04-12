let tiposBeca = [];
let becas = [];

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("navbar");
  loadTipos();
  loadBecas();
});

// ==================== TIPOS DE BECA ====================

async function loadTipos() {
  try {
    const response = await api.get("/tipos-beca");
    tiposBeca = response.data || [];
    renderTipos();
    populateTipoSelect();
  } catch (e) {
    console.error("Error cargando tipos de beca:", e);
  }
}

function renderTipos() {
  const tbody = document.getElementById("tipos-table");
  if (!tiposBeca.length) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No hay tipos de beca registrados</td></tr>';
    return;
  }
  tbody.innerHTML = tiposBeca
    .map(
      (t) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">${t.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${t.nombre}</td>
            <td class="px-6 py-4 text-right space-x-2">
                <button onclick="editTipo(${t.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                <button onclick="deleteTipo(${t.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function populateTipoSelect() {
  const select = document.getElementById("beca-tipo");
  select.innerHTML =
    '<option value="">Seleccionar tipo...</option>' +
    tiposBeca
      .map((t) => `<option value="${t.id}">${t.nombre}</option>`)
      .join("");
}

function openTipoModal(data = null) {
  document.getElementById("modal-tipo-title").textContent = data
    ? "Editar Tipo de Beca"
    : "Nuevo Tipo de Beca";
  document.getElementById("tipo-id").value = data ? data.id : "";
  document.getElementById("tipo-nombre").value = data ? data.nombre : "";
  document.getElementById("modal-tipo").classList.remove("hidden");
}

function closeTipoModal() {
  document.getElementById("modal-tipo").classList.add("hidden");
}

async function saveTipo() {
  const id = document.getElementById("tipo-id").value;
  const nombre = document.getElementById("tipo-nombre").value.trim();
  if (!nombre) return alert("El nombre es requerido");

  try {
    if (id) {
      await api.put(`/tipos-beca/${id}`, { nombre });
    } else {
      await api.post("/tipos-beca", { nombre });
    }
    closeTipoModal();
    loadTipos();
  } catch (e) {
    alert("Error al guardar tipo de beca");
  }
}

function editTipo(id) {
  const t = tiposBeca.find((x) => x.id === id);
  if (t) openTipoModal(t);
}

async function deleteTipo(id) {
  if (!confirm("¿Seguro que desea eliminar este tipo de beca?")) return;
  try {
    await api.delete(`/tipos-beca/${id}`);
    loadTipos();
  } catch (e) {
    alert("Error al eliminar tipo de beca");
  }
}

// ==================== BECAS ====================

async function loadBecas() {
  try {
    const response = await api.get("/becas");
    becas = response.data || [];
    renderBecas();
  } catch (e) {
    console.error("Error cargando becas:", e);
  }
}

function renderBecas() {
  const tbody = document.getElementById("becas-table");
  if (!becas.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No hay becas registradas</td></tr>';
    return;
  }
  tbody.innerHTML = becas
    .map((b) => {
      // El controlador devuelve id_tipob y tipo_nombre del JOIN
      const tipoNombre =
        b.tipo_nombre ||
        (tiposBeca.find((t) => t.id === b.id_tipob) || {}).nombre ||
        "-";
      const activo = b.activo;
      const badge = activo
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
    })
    .join("");
}

function openBecaModal(data = null) {
  document.getElementById("modal-beca-title").textContent = data
    ? "Editar Beca"
    : "Nueva Beca";
  document.getElementById("beca-id").value = data ? data.id : "";
  document.getElementById("beca-nombre").value = data ? data.nombre : "";
  document.getElementById("beca-descripcion").value = data
    ? data.descripcion || ""
    : "";
  document.getElementById("beca-porcentaje").value = data
    ? data.porcentaje
    : "";
  document.getElementById("beca-tipo").value = data ? data.id_tipob : "";
  document.getElementById("beca-activo").checked = data ? data.activo : true;
  document.getElementById("modal-beca").classList.remove("hidden");
}

function closeBecaModal() {
  document.getElementById("modal-beca").classList.add("hidden");
}

async function saveBeca() {
  const id = document.getElementById("beca-id").value;
  const nombre = document.getElementById("beca-nombre").value.trim();
  const descripcion = document.getElementById("beca-descripcion").value.trim();
  const porcentaje = parseFloat(
    document.getElementById("beca-porcentaje").value,
  );
  const id_tipob = parseInt(document.getElementById("beca-tipo").value);
  const activo = document.getElementById("beca-activo").checked;

  if (!nombre) return alert("El nombre es requerido");
  if (isNaN(porcentaje)) return alert("El porcentaje es requerido");
  if (!id_tipob) return alert("Seleccione un tipo de beca");

  const data = { nombre, descripcion, porcentaje, id_tipob, activo };

  try {
    if (id) {
      await api.put(`/becas/${id}`, data);
    } else {
      await api.post("/becas", data);
    }
    closeBecaModal();
    loadBecas();
  } catch (e) {
    alert("Error al guardar beca");
  }
}

function editBeca(id) {
  const b = becas.find((x) => x.id === id);
  if (b) openBecaModal(b);
}

async function deleteBeca(id) {
  if (!confirm("¿Seguro que desea eliminar esta beca?")) return;
  try {
    await api.delete(`/becas/${id}`);
    loadBecas();
  } catch (e) {
    alert("Error al eliminar beca");
  }
}
