let convocatorias = [];
let becas = [];

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("navbar");
  loadBecas();
  loadConvocatorias();
});

// ==================== BECAS (para select) ====================

async function loadBecas() {
  try {
    const response = await api.get("/becas");
    becas = response.data || [];
    populateBecaSelect();
  } catch (e) {
    console.error("Error cargando becas:", e);
  }
}

function populateBecaSelect() {
  const select = document.getElementById("convocatoria-beca");
  select.innerHTML =
    '<option value="">Seleccionar beca...</option>' +
    becas
      .filter((b) => b.activo)
      .map(
        (b) =>
          `<option value="${b.id}">${b.nombre} (${b.porcentaje}%)</option>`,
      )
      .join("");
}

// ==================== CONVOCATORIAS ====================

async function loadConvocatorias() {
  try {
    const response = await api.get("/convocatorias");
    convocatorias = response.data || [];
    renderConvocatorias();
  } catch (e) {
    console.error("Error cargando convocatorias:", e);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function renderConvocatorias() {
  const tbody = document.getElementById("convocatorias-table");
  if (!convocatorias.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">No hay convocatorias registradas</td></tr>';
    return;
  }
  tbody.innerHTML = convocatorias
    .map((c) => {
      const becaNombre =
        c.beca_nombre ||
        (becas.find((b) => b.id === c.id_beca) || {}).nombre ||
        "-";
      return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">${c.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${c.descripcion}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${c.periodo}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(c.fecha_inicio)}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(c.fecha_fin)}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${c.cupos}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${becaNombre}</td>
            <td class="px-6 py-4 text-right space-x-2">
                <button onclick="editConvocatoria(${c.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">Editar</button>
                <button onclick="deleteConvocatoria(${c.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">Eliminar</button>
            </td>
        </tr>`;
    })
    .join("");
}

function openConvocatoriaModal(data = null) {
  document.getElementById("modal-convocatoria-title").textContent = data
    ? "Editar Convocatoria"
    : "Nueva Convocatoria";
  document.getElementById("convocatoria-id").value = data ? data.id : "";
  document.getElementById("convocatoria-descripcion").value = data
    ? data.descripcion
    : "";
  document.getElementById("convocatoria-periodo").value = data
    ? data.periodo
    : "";
  document.getElementById("convocatoria-fecha-inicio").value = data
    ? data.fecha_inicio?.split("T")[0]
    : "";
  document.getElementById("convocatoria-fecha-fin").value = data
    ? data.fecha_fin?.split("T")[0]
    : "";
  document.getElementById("convocatoria-cupos").value = data ? data.cupos : "";
  document.getElementById("convocatoria-beca").value = data ? data.id_beca : "";
  document.getElementById("modal-convocatoria").classList.remove("hidden");
}

function closeConvocatoriaModal() {
  document.getElementById("modal-convocatoria").classList.add("hidden");
}

async function saveConvocatoria() {
  const id = document.getElementById("convocatoria-id").value;
  const descripcion = document
    .getElementById("convocatoria-descripcion")
    .value.trim();
  const periodo = document.getElementById("convocatoria-periodo").value.trim();
  const fecha_inicio = document.getElementById(
    "convocatoria-fecha-inicio",
  ).value;
  const fecha_fin = document.getElementById("convocatoria-fecha-fin").value;
  const cupos = parseInt(document.getElementById("convocatoria-cupos").value);
  const id_beca = parseInt(document.getElementById("convocatoria-beca").value);

  if (!descripcion) return alert("La descripción es requerida");
  if (!periodo) return alert("El periodo es requerido");
  if (!fecha_inicio || !fecha_fin) return alert("Las fechas son requeridas");
  if (isNaN(cupos) || cupos < 1) return alert("Los cupos deben ser al menos 1");
  if (!id_beca) return alert("Seleccione una beca");

  const data = {
    descripcion,
    periodo,
    fecha_inicio,
    fecha_fin,
    cupos,
    id_beca,
  };

  try {
    if (id) {
      await api.put(`/convocatorias/${id}`, data);
    } else {
      await api.post("/convocatorias", data);
    }
    closeConvocatoriaModal();
    loadConvocatorias();
  } catch (e) {
    alert("Error al guardar convocatoria");
    console.error(e);
  }
}

function editConvocatoria(id) {
  const c = convocatorias.find((x) => x.id === id);
  if (c) openConvocatoriaModal(c);
}

async function deleteConvocatoria(id) {
  if (!confirm("¿Seguro que desea eliminar esta convocatoria?")) return;
  try {
    await api.delete(`/convocatorias/${id}`);
    loadConvocatorias();
  } catch (e) {
    alert("Error al eliminar convocatoria");
  }
}
