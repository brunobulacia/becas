let asignaciones = [];
let solicitudes = [];

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("navbar");
  loadSolicitudesAprobadas();
  loadAsignaciones();
});

// ==================== CARGAR DATOS AUXILIARES ====================

async function loadSolicitudesAprobadas() {
  try {
    const response = await api.get("/solicitudes");
    // Filtrar solo las solicitudes aprobadas
    solicitudes = (response.data || []).filter((s) => s.estado === "APROBADA");
    populateSolicitudSelect();
  } catch (e) {
    console.error("Error cargando solicitudes:", e);
  }
}

function populateSolicitudSelect() {
  const select = document.getElementById("asignacion-solicitud");
  select.innerHTML =
    '<option value="">Seleccionar solicitud aprobada...</option>' +
    solicitudes
      .map(
        (s) =>
          `<option value="${s.id}">#${s.id} - ${s.estudiante_nombre} - ${s.convocatoria_nombre}</option>`,
      )
      .join("");
}

// ==================== ASIGNACIONES ====================

async function loadAsignaciones() {
  try {
    const response = await api.get("/asignaciones");
    asignaciones = response.data || [];
    renderAsignaciones();
  } catch (e) {
    console.error("Error cargando asignaciones:", e);
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

function getEstadoVigencia(fechaInicio, fechaFin) {
  const hoy = new Date();
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (hoy < inicio) {
    return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">⏳ Pendiente</span>';
  } else if (hoy >= inicio && hoy <= fin) {
    return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">✅ Vigente</span>';
  } else {
    return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">⌛ Finalizada</span>';
  }
}

function renderAsignaciones() {
  const tbody = document.getElementById("asignaciones-table");
  if (!asignaciones.length) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No hay asignaciones registradas</td></tr>';
    return;
  }
  tbody.innerHTML = asignaciones
    .map((a) => {
      return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">${a.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${a.estudiante_nombre || "Cargando..."}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${a.beca_nombre || "-"}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${a.periodo || "-"}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
                <div>${formatDate(a.fecha_inicio)}</div>
                <div class="text-xs text-gray-400">al ${formatDate(a.fecha_fin)}</div>
            </td>
            <td class="px-6 py-4">${getEstadoVigencia(a.fecha_inicio, a.fecha_fin)}</td>
            <td class="px-6 py-4 text-right space-x-1">
                <button onclick="openEditAsignacionModal(${a.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">Editar</button>
                <button onclick="deleteAsignacion(${a.id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors">Eliminar</button>
            </td>
        </tr>`;
    })
    .join("");
}

// ==================== MODAL NUEVA ASIGNACIÓN ====================

function openAsignacionModal() {
  document.getElementById("modal-asignacion-title").textContent =
    "Nueva Asignación";
  document.getElementById("asignacion-id").value = "";
  document.getElementById("asignacion-solicitud").value = "";
  document.getElementById("asignacion-descripcion").value = "";
  document.getElementById("asignacion-periodo").value = "";

  // Fechas por defecto (1 año)
  const fechaInicio = new Date();
  const fechaFin = new Date();
  fechaFin.setFullYear(fechaFin.getFullYear() + 1);

  document.getElementById("asignacion-fecha-inicio").value = fechaInicio
    .toISOString()
    .split("T")[0];
  document.getElementById("asignacion-fecha-fin").value = fechaFin
    .toISOString()
    .split("T")[0];
  document.getElementById("modal-asignacion").classList.remove("hidden");
}

function closeAsignacionModal() {
  document.getElementById("modal-asignacion").classList.add("hidden");
}

async function saveAsignacion() {
  const id = document.getElementById("asignacion-id").value;
  const id_solicitud = parseInt(
    document.getElementById("asignacion-solicitud").value,
  );
  const descripcion = document
    .getElementById("asignacion-descripcion")
    .value.trim();
  const periodo = document.getElementById("asignacion-periodo").value.trim();
  const fecha_inicio = document.getElementById("asignacion-fecha-inicio").value;
  const fecha_fin = document.getElementById("asignacion-fecha-fin").value;

  if (!id_solicitud) return alert("⚠️ Seleccione una solicitud");
  if (!periodo) return alert("⚠️ El periodo es requerido");
  if (!fecha_inicio || !fecha_fin) return alert("⚠️ Las fechas son requeridas");
  if (fecha_fin <= fecha_inicio)
    return alert("⚠️ La fecha fin debe ser posterior a la fecha inicio");

  const data = { id_solicitud, descripcion, periodo, fecha_inicio, fecha_fin };

  try {
    if (id) {
      await api.put(`/asignaciones/${id}`, data);
      alert("✅ Asignación actualizada correctamente");
    } else {
      await api.post("/asignaciones", data);
      alert("✅ Asignación creada correctamente");
    }
    closeAsignacionModal();
    loadAsignaciones();
    loadSolicitudesAprobadas();
  } catch (e) {
    alert("❌ Error al guardar asignación");
    console.error(e);
  }
}

// ==================== MODAL EDITAR ASIGNACIÓN ====================

function openEditAsignacionModal(id) {
  const a = asignaciones.find((x) => x.id === id);
  if (!a) return;

  document.getElementById("modal-asignacion-title").textContent =
    "Editar Asignación";
  document.getElementById("asignacion-id").value = id;
  document.getElementById("asignacion-solicitud").value = a.id_solicitud;
  document.getElementById("asignacion-descripcion").value = a.descripcion || "";
  document.getElementById("asignacion-periodo").value = a.periodo || "";
  document.getElementById("asignacion-fecha-inicio").value = a.fecha_inicio
    ? a.fecha_inicio.split("T")[0]
    : "";
  document.getElementById("asignacion-fecha-fin").value = a.fecha_fin
    ? a.fecha_fin.split("T")[0]
    : "";

  document.getElementById("modal-asignacion").classList.remove("hidden");
}

// ==================== ELIMINAR ====================

async function deleteAsignacion(id) {
  if (!confirm("¿Seguro que desea eliminar esta asignación?")) return;
  try {
    await api.delete(`/asignaciones/${id}`);
    loadAsignaciones();
    loadSolicitudesAprobadas(); // Recargar solicitudes disponibles
  } catch (e) {
    alert("Error al eliminar asignación");
  }
}
