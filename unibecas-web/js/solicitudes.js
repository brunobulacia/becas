let solicitudes = [];
let estudiantes = [];
let convocatorias = [];
let becas = [];

// Solicitud actual para evaluación
let solicitudActual = null;

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("navbar");
  loadEstudiantes();
  loadConvocatorias();
  loadBecas();
  loadSolicitudes();
});

// ==================== CARGAR DATOS AUXILIARES ====================

async function loadEstudiantes() {
  try {
    const response = await api.get("/estudiantes");
    estudiantes = response.data || [];
    populateEstudianteSelect();
  } catch (e) {
    console.error("Error cargando estudiantes:", e);
  }
}

async function loadConvocatorias() {
  try {
    const response = await api.get("/convocatorias");
    convocatorias = response.data || [];
    populateConvocatoriaSelect();
  } catch (e) {
    console.error("Error cargando convocatorias:", e);
  }
}

async function loadBecas() {
  try {
    const response = await api.get("/becas");
    becas = response.data || [];
  } catch (e) {
    console.error("Error cargando becas:", e);
  }
}

function populateEstudianteSelect() {
  const select = document.getElementById("solicitud-estudiante");
  select.innerHTML =
    '<option value="">Seleccionar estudiante...</option>' +
    estudiantes
      .filter((e) => e.activo) // Solo estudiantes activos (CU5 validación)
      .map(
        (e) =>
          `<option value="${e.id}">${e.codigop} - ${e.nombre} ${e.apellido}</option>`,
      )
      .join("");
}

function populateConvocatoriaSelect() {
  const select = document.getElementById("solicitud-convocatoria");
  // CU5: Mostrar solo convocatorias vigentes (fecha_fin >= hoy)
  const hoy = new Date().toISOString().split("T")[0];
  const vigentes = convocatorias.filter((c) => c.fecha_fin >= hoy);

  if (vigentes.length === 0) {
    select.innerHTML =
      '<option value="">No hay convocatorias vigentes</option>';
  } else {
    select.innerHTML =
      '<option value="">Seleccionar convocatoria...</option>' +
      vigentes
        .map(
          (c) =>
            `<option value="${c.id}">${c.descripcion} (${c.periodo}) - Cupos: ${c.cupos_disponibles || c.cupos}</option>`,
        )
        .join("");
  }
}

// ==================== SOLICITUDES ====================

async function loadSolicitudes() {
  try {
    const response = await api.get("/solicitudes");
    solicitudes = response.data || [];
    renderSolicitudes();
  } catch (e) {
    console.error("Error cargando solicitudes:", e);
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

function getEstadoBadge(estado) {
  switch (estado) {
    case "PENDIENTE":
      return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">⏳ Pendiente</span>';
    case "APROBADA":
      return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">✅ Aprobada</span>';
    case "RECHAZADA":
      return '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">❌ Rechazada</span>';
    default:
      return (
        '<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">' +
        estado +
        "</span>"
      );
  }
}

function renderSolicitudes() {
  const tbody = document.getElementById("solicitudes-table");
  if (!solicitudes.length) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No hay solicitudes registradas</td></tr>';
    return;
  }
  tbody.innerHTML = solicitudes
    .map((s) => {
      const convocatoria = `${s.convocatoria_nombre || ""} (${s.convocatoria_periodo || ""})`;
      const canEvaluate = s.estado === "PENDIENTE";
      return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">${s.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                <div>${s.estudiante_nombre || "Cargando..."}</div>
                <div class="text-xs text-gray-500">${s.estudiante_codigo || ""}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">${convocatoria}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(s.fecha_solicitud)}</td>
            <td class="px-6 py-4">${getEstadoBadge(s.estado)}</td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">${s.observaciones || "-"}</td>
            <td class="px-6 py-4 text-right space-x-1">
                ${canEvaluate ? `<button onclick="openEstadoModal(${s.id})" class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs transition-colors" title="Evaluar solicitud">📋 Evaluar</button>` : ""}
                <button onclick="deleteSolicitud(${s.id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors">Eliminar</button>
            </td>
        </tr>`;
    })
    .join("");
}

// ==================== MODAL NUEVA SOLICITUD (CU5) ====================

function openSolicitudModal() {
  document.getElementById("modal-solicitud-title").textContent =
    "Nueva Solicitud de Beca";
  document.getElementById("solicitud-id").value = "";
  document.getElementById("solicitud-estudiante").value = "";
  document.getElementById("solicitud-convocatoria").value = "";
  document.getElementById("solicitud-fecha").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("solicitud-observaciones").value = "";
  document.getElementById("modal-solicitud").classList.remove("hidden");
}

function closeSolicitudModal() {
  document.getElementById("modal-solicitud").classList.add("hidden");
}

/**
 * CU5: Registrar Solicitud de Beca
 * Validaciones:
 * 1. El estudiante debe estar activo
 * 2. La convocatoria debe estar vigente
 * 3. La convocatoria debe tener cupos disponibles
 * 4. El estudiante no debe tener solicitud previa en esa convocatoria
 */
async function saveSolicitud() {
  const id_estudiante = parseInt(
    document.getElementById("solicitud-estudiante").value,
  );
  const id_convocatoria = parseInt(
    document.getElementById("solicitud-convocatoria").value,
  );
  const fecha_solicitud = document.getElementById("solicitud-fecha").value;
  const observaciones = document
    .getElementById("solicitud-observaciones")
    .value.trim();

  if (!id_estudiante) return alert("⚠️ Seleccione un estudiante");
  if (!id_convocatoria) return alert("⚠️ Seleccione una convocatoria");
  if (!fecha_solicitud) return alert("⚠️ La fecha es requerida");

  // ========== VALIDACIONES CU5 ==========

  // 1. Verificar que el estudiante esté activo
  const estudiante = estudiantes.find((e) => e.id === id_estudiante);
  if (!estudiante) {
    return alert("❌ Estudiante no encontrado");
  }
  if (!estudiante.activo) {
    return alert("❌ El estudiante no está activo en el sistema");
  }

  // 2. Verificar que la convocatoria esté vigente
  const convocatoria = convocatorias.find((c) => c.id === id_convocatoria);
  if (!convocatoria) {
    return alert("❌ Convocatoria no encontrada");
  }
  const hoy = new Date().toISOString().split("T")[0];
  if (convocatoria.fecha_fin < hoy) {
    return alert(
      "❌ La convocatoria ya no está vigente (fecha límite vencida)",
    );
  }
  if (convocatoria.fecha_inicio > hoy) {
    return alert("❌ La convocatoria aún no ha iniciado");
  }

  // 3. Verificar cupos disponibles
  const cuposDisponibles = convocatoria.cupos_disponibles ?? convocatoria.cupos;
  if (cuposDisponibles <= 0) {
    return alert("❌ La convocatoria no tiene cupos disponibles");
  }

  // 4. Verificar que no exista solicitud previa del estudiante en esta convocatoria
  const solicitudExistente = solicitudes.find(
    (s) =>
      s.id_estudiante === id_estudiante &&
      s.id_convocatoria === id_convocatoria,
  );
  if (solicitudExistente) {
    return alert(
      "❌ El estudiante ya tiene una solicitud registrada para esta convocatoria",
    );
  }

  // ========== CREAR SOLICITUD ==========
  const data = {
    id_estudiante,
    id_convocatoria,
    fecha_solicitud,
    estado: "PENDIENTE",
    observaciones,
  };

  try {
    await api.post("/solicitudes", data);
    closeSolicitudModal();
    await loadSolicitudes();
    await loadConvocatorias(); // Recargar para actualizar cupos
    alert("✅ Solicitud registrada correctamente");
  } catch (e) {
    alert("❌ Error al guardar solicitud");
    console.error(e);
  }
}

// ==================== MODAL EVALUAR SOLICITUD (CU6) ====================

async function openEstadoModal(id) {
  const s = solicitudes.find((x) => x.id === id);
  if (!s) return;

  solicitudActual = s;

  // Buscar la convocatoria y beca asociada
  const convocatoria = convocatorias.find((c) => c.id === s.id_convocatoria);
  const beca = convocatoria
    ? becas.find((b) => b.id === convocatoria.id_beca)
    : null;

  // Llenar información de la solicitud
  document.getElementById("estado-solicitud-id").value = id;
  document.getElementById("eval-estudiante").textContent =
    `${s.estudiante_nombre || "N/A"} (${s.estudiante_codigo || ""})`;
  document.getElementById("eval-convocatoria").textContent = convocatoria
    ? `${convocatoria.descripcion} (${convocatoria.periodo})`
    : "N/A";
  document.getElementById("eval-beca").textContent = beca
    ? `${beca.nombre} - $${beca.monto}`
    : "N/A";

  document.getElementById("estado-valor").value = "PENDIENTE";
  document.getElementById("estado-observaciones").value = "";

  // Establecer fechas por defecto para asignación (1 año)
  const fechaInicio = new Date();
  const fechaFin = new Date();
  fechaFin.setFullYear(fechaFin.getFullYear() + 1);

  document.getElementById("asig-fecha-inicio").value = fechaInicio
    .toISOString()
    .split("T")[0];
  document.getElementById("asig-fecha-fin").value = fechaFin
    .toISOString()
    .split("T")[0];

  // Ocultar campos de asignación inicialmente
  document.getElementById("campos-asignacion").classList.add("hidden");

  document.getElementById("modal-estado").classList.remove("hidden");
}

function closeEstadoModal() {
  document.getElementById("modal-estado").classList.add("hidden");
  solicitudActual = null;
}

// Mostrar/ocultar campos de asignación según el estado seleccionado
function toggleAsignacionFields() {
  const estado = document.getElementById("estado-valor").value;
  const camposAsignacion = document.getElementById("campos-asignacion");

  if (estado === "APROBADA") {
    camposAsignacion.classList.remove("hidden");
    document.getElementById("asig-fecha-inicio").required = true;
    document.getElementById("asig-fecha-fin").required = true;
  } else {
    camposAsignacion.classList.add("hidden");
    document.getElementById("asig-fecha-inicio").required = false;
    document.getElementById("asig-fecha-fin").required = false;
  }
}

/**
 * CU6: Aprobar/Rechazar Solicitud
 * Si se aprueba:
 * - Actualizar estado de la solicitud a "APROBADA"
 * - Crear automáticamente una asignación de beca con estado "ACTIVA"
 * Si se rechaza:
 * - Actualizar estado de la solicitud a "RECHAZADA"
 */
async function saveEstado() {
  const id = document.getElementById("estado-solicitud-id").value;
  const estado = document.getElementById("estado-valor").value;
  const observaciones = document
    .getElementById("estado-observaciones")
    .value.trim();

  if (estado === "PENDIENTE") {
    return alert("⚠️ Debe seleccionar Aprobar o Rechazar");
  }

  try {
    // ========== CU6: APROBAR SOLICITUD ==========
    if (estado === "APROBADA") {
      const fechaInicio = document.getElementById("asig-fecha-inicio").value;
      const fechaFin = document.getElementById("asig-fecha-fin").value;

      if (!fechaInicio || !fechaFin) {
        return alert("⚠️ Las fechas de vigencia son requeridas para aprobar");
      }
      if (fechaFin <= fechaInicio) {
        return alert("⚠️ La fecha fin debe ser posterior a la fecha inicio");
      }

      // Obtener datos de la convocatoria para la descripción y periodo
      const convocatoria = convocatorias.find(
        (c) => c.id === solicitudActual.id_convocatoria,
      );
      const beca = convocatoria
        ? becas.find((b) => b.id === convocatoria.id_beca)
        : null;

      // 1. Actualizar estado de la solicitud
      await api.put(`/solicitudes/${id}`, {
        estado: "APROBADA",
        observaciones: observaciones || "Solicitud aprobada",
      });

      // 2. Crear asignación de beca automáticamente (CU6 paso 3b.3)
      const asignacionData = {
        id_solicitud: parseInt(id),
        descripcion: `Asignación de beca: ${beca ? beca.nombre : "Beca"}`,
        periodo: convocatoria ? convocatoria.periodo : "N/A",
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };

      try {
        await api.post("/asignaciones", asignacionData);
        alert("✅ Solicitud APROBADA y Asignación de Beca creada exitosamente");
      } catch (asigError) {
        console.error("Error creando asignación:", asigError);
        alert(
          "⚠️ Solicitud aprobada pero hubo un error al crear la asignación. Créela manualmente.",
        );
      }
    }
    // ========== CU6: RECHAZAR SOLICITUD ==========
    else if (estado === "RECHAZADA") {
      if (!observaciones) {
        return alert("⚠️ Debe indicar el motivo del rechazo en observaciones");
      }

      await api.put(`/solicitudes/${id}`, {
        estado: "RECHAZADA",
        observaciones,
      });

      alert("❌ Solicitud RECHAZADA");
    }

    closeEstadoModal();
    await loadSolicitudes();
    await loadConvocatorias(); // Actualizar cupos disponibles
  } catch (e) {
    alert("❌ Error al procesar la decisión");
    console.error(e);
  }
}

// ==================== ELIMINAR ====================

async function deleteSolicitud(id) {
  const solicitud = solicitudes.find((s) => s.id === id);
  if (solicitud && solicitud.estado === "APROBADA") {
    if (
      !confirm(
        "⚠️ Esta solicitud está APROBADA. Eliminarla no eliminará la asignación asociada. ¿Continuar?",
      )
    )
      return;
  } else {
    if (!confirm("¿Seguro que desea eliminar esta solicitud?")) return;
  }

  try {
    await api.delete(`/solicitudes/${id}`);
    await loadSolicitudes();
    alert("✅ Solicitud eliminada");
  } catch (e) {
    alert("❌ Error al eliminar solicitud");
  }
}
