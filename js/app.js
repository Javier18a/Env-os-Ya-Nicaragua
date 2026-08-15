const STORAGE_KEY = "enviosYa_envios";
const CLIENTS_KEY = "enviosYa_clientes";

let envios = [];
let clientes = [];

const estados = {
    pendiente: "Pendiente",
    transito: "En tránsito",
    aduana: "En aduana",
    entregado: "Entregado"
};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    cargarDatos();

    inicializarFecha();

    inicializarNavegacion();

    inicializarFormulario();

    inicializarBusqueda();

    inicializarSeguimiento();

    inicializarModal();

    inicializarClientes();

    inicializarReportes();

    inicializarConfiguracion();

    generarCodigo();

    actualizarTodo();

});


/* =========================================================
   DATOS
========================================================= */

function cargarDatos() {

    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    const clientesGuardados = localStorage.getItem(CLIENTS_KEY);

    if (datosGuardados) {

        try {
            envios = JSON.parse(datosGuardados);
        } catch {
            envios = [];
        }

    } else {

        envios = crearDatosIniciales();

        guardarEnvios();

    }


    if (clientesGuardados) {

        try {
            clientes = JSON.parse(clientesGuardados);
        } catch {
            clientes = [];
        }

    } else {

        reconstruirClientes();

    }

}


function guardarEnvios() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(envios)
    );

}


function guardarClientes() {

    localStorage.setItem(
        CLIENTS_KEY,
        JSON.stringify(clientes)
    );

}


/* =========================================================
   DATOS DEMO
========================================================= */

function crearDatosIniciales() {

    return [

        {
            id: generarId(),

            codigo: "ENV-00128",

            cliente: "Carlos Martínez",

            telefono: "+505 8888 1001",

            origen: "Miami, USA",

            destino: "Managua, Nicaragua",

            tipo: "Importación",

            peso: 8.5,

            estado: "transito",

            fecha: "2026-08-14",

            notas: "Paquete comercial.",

            historial: [

                {
                    estado: "pendiente",
                    fecha: "2026-08-10 09:20",
                    descripcion: "Envío registrado."
                },

                {
                    estado: "transito",
                    fecha: "2026-08-13 14:30",
                    descripcion: "Envío salió de origen."
                }

            ]

        },


        {
            id: generarId(),

            codigo: "ENV-00127",

            cliente: "María López",

            telefono: "+505 8888 1002",

            origen: "Miami, USA",

            destino: "Managua, Nicaragua",

            tipo: "Importación",

            peso: 4.2,

            estado: "entregado",

            fecha: "2026-08-13",

            notas: "Entrega completada.",

            historial: [

                {
                    estado: "pendiente",
                    fecha: "2026-08-08 10:00",
                    descripcion: "Envío registrado."
                },

                {
                    estado: "transito",
                    fecha: "2026-08-09 16:20",
                    descripcion: "En tránsito."
                },

                {
                    estado: "aduana",
                    fecha: "2026-08-11 08:45",
                    descripcion: "Procesando en aduana."
                },

                {
                    estado: "entregado",
                    fecha: "2026-08-13 15:10",
                    descripcion: "Entrega completada."
                }

            ]

        },


        {
            id: generarId(),

            codigo: "ENV-00126",

            cliente: "José Rodríguez",

            telefono: "+505 8888 1003",

            origen: "Panamá",

            destino: "Managua, Nicaragua",

            tipo: "Importación",

            peso: 12.8,

            estado: "aduana",

            fecha: "2026-08-12",

            notas: "Pendiente de revisión.",

            historial: [

                {
                    estado: "pendiente",
                    fecha: "2026-08-08 11:10",
                    descripcion: "Envío registrado."
                },

                {
                    estado: "transito",
                    fecha: "2026-08-09 13:00",
                    descripcion: "Envío en tránsito."
                },

                {
                    estado: "aduana",
                    fecha: "2026-08-12 09:15",
                    descripcion: "Envío recibido en aduana."
                }

            ]

        },


        {
            id: generarId(),

            codigo: "ENV-00125",

            cliente: "Ana González",

            telefono: "+505 8888 1004",

            origen: "Managua, Nicaragua",

            destino: "Miami, USA",

            tipo: "Exportación",

            peso: 6.7,

            estado: "entregado",

            fecha: "2026-08-10",

            notas: "Documentación completa.",

            historial: [

                {
                    estado: "pendiente",
                    fecha: "2026-08-05 09:00",
                    descripcion: "Exportación registrada."
                },

                {
                    estado: "transito",
                    fecha: "2026-08-06 12:00",
                    descripcion: "Envío despachado."
                },

                {
                    estado: "entregado",
                    fecha: "2026-08-10 16:40",
                    descripcion: "Envío entregado en destino."
                }

            ]

        }

    ];

}


/* =========================================================
   UTILIDADES
========================================================= */

function generarId() {

    return Date.now() + Math.floor(Math.random() * 10000);

}


function generarCodigo() {

    const input = document.getElementById("shipmentCode");

    if (!input) return;

    const numeros = envios.map(envio => {

        const numero = parseInt(
            envio.codigo.replace("ENV-", ""),
            10
        );

        return isNaN(numero) ? 0 : numero;

    });

    const mayor = numeros.length
        ? Math.max(...numeros)
        : 0;

    input.value =
        "ENV-" +
        String(mayor + 1).padStart(5, "0");

}


function obtenerFechaActual() {

    const fecha = new Date();

    const año = fecha.getFullYear();

    const mes = String(
        fecha.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        fecha.getDate()
    ).padStart(2, "0");

    return `${año}-${mes}-${dia}`;

}


function formatearFecha(fecha) {

    if (!fecha) return "—";

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   FECHA
========================================================= */

function inicializarFecha() {

    const elemento =
        document.getElementById("currentDate");

    if (!elemento) return;

    const fecha = new Date();

    elemento.textContent =
        fecha.toLocaleDateString(
            "es-NI",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function inicializarNavegacion() {

    const botones =
        document.querySelectorAll(
            "[data-section]"
        );

    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const seccion =
                    boton.dataset.section;

                cambiarSeccion(seccion);

            }
        );

    });


    const menuToggle =
        document.getElementById("menuToggle");

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            () => {

                const sidebar =
                    document.querySelector(".sidebar");

                sidebar.classList.toggle("open");

            }
        );

    }

}


function cambiarSeccion(nombre) {

    const secciones =
        document.querySelectorAll(
            ".content-section"
        );

    secciones.forEach(seccion => {

        seccion.classList.remove("active");

    });


    const destino =
        document.getElementById(nombre);

    if (destino) {

        destino.classList.add("active");

    }


    const botones =
        document.querySelectorAll(
            ".nav-item"
        );

    botones.forEach(boton => {

        boton.classList.remove("active");

        if (
            boton.dataset.section === nombre
        ) {

            boton.classList.add("active");

        }

    });


    const titulos = {

        dashboard: "Dashboard",

        envios: "Envíos",

        registrar: "Registrar envío",

        clientes: "Clientes",

        seguimiento: "Seguimiento",

        reportes: "Reportes",

        usuarios: "Usuarios",

        configuracion: "Configuración"

    };


    const titulo =
        document.getElementById("pageTitle");

    if (titulo) {

        titulo.textContent =
            titulos[nombre] || "Sistema";

    }


    const sidebar =
        document.querySelector(".sidebar");

    if (sidebar) {

        sidebar.classList.remove("open");

    }


    if (nombre === "reportes") {
        actualizarReportes();
    }

    if (nombre === "clientes") {
        renderizarClientes();
    }

}


/* =========================================================
   FORMULARIO
========================================================= */

function inicializarFormulario() {

    const formulario =
        document.getElementById("shipmentForm");

    if (!formulario) return;


    const fecha =
        document.getElementById("shipmentDate");

    if (fecha) {

        fecha.value =
            obtenerFechaActual();

    }


    formulario.addEventListener(
        "submit",
        registrarEnvio
    );


    formulario.addEventListener(
        "reset",
        () => {

            setTimeout(() => {

                generarCodigo();

                if (fecha) {
                    fecha.value =
                        obtenerFechaActual();
                }

            }, 0);

        }
    );

}


function registrarEnvio(evento) {

    evento.preventDefault();


    const codigo =
        document.getElementById(
            "shipmentCode"
        ).value.trim();

    const cliente =
        document.getElementById(
            "clientName"
        ).value.trim();

    const telefono =
        document.getElementById(
            "clientPhone"
        ).value.trim();

    const origen =
        document.getElementById(
            "origin"
        ).value.trim();

    const destino =
        document.getElementById(
            "destination"
        ).value.trim();

    const tipo =
        document.getElementById(
            "operationType"
        ).value;

    const peso =
        parseFloat(
            document.getElementById(
                "weight"
            ).value
        );

    const fecha =
        document.getElementById(
            "shipmentDate"
        ).value;

    const notas =
        document.getElementById(
            "notes"
        ).value.trim();


    if (!codigo || !cliente || !origen || !destino) {

        mostrarNotificacion(
            "Completa los campos obligatorios.",
            "error"
        );

        return;

    }


    if (
        envios.some(
            envio =>
                envio.codigo.toLowerCase() ===
                codigo.toLowerCase()
        )
    ) {

        mostrarNotificacion(
            "Ya existe un envío con ese código.",
            "error"
        );

        return;

    }


    const nuevoEnvio = {

        id: generarId(),

        codigo,

        cliente,

        telefono,

        origen,

        destino,

        tipo,

        peso: peso || 0,

        estado: "pendiente",

        fecha,

        notas,

        historial: [

            {
                estado: "pendiente",

                fecha:
                    obtenerFechaHora(),

                descripcion:
                    "Envío registrado en el sistema."

            }

        ]

    };


    envios.unshift(nuevoEnvio);


    guardarEnvios();

    reconstruirClientes();

    actualizarTodo();


    mostrarNotificacion(
        `Envío ${codigo} registrado correctamente.`,
        "success"
    );


    event.target.reset();


    setTimeout(() => {

        generarCodigo();

        document.getElementById(
            "shipmentDate"
        ).value =
            obtenerFechaActual();

    }, 0);


    cambiarSeccion("envios");

}


/* =========================================================
   FECHA Y HORA
========================================================= */

function obtenerFechaHora() {

    const fecha = new Date();

    const año =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    const horas =
        String(
            fecha.getHours()
        ).padStart(2, "0");

    const minutos =
        String(
            fecha.getMinutes()
        ).padStart(2, "0");

    return `${año}-${mes}-${dia} ${horas}:${minutos}`;

}


/* =========================================================
   DASHBOARD
========================================================= */

function actualizarDashboard() {

    const total =
        envios.length;

    const transito =
        envios.filter(
            envio =>
                envio.estado === "transito"
        ).length;

    const aduana =
        envios.filter(
            envio =>
                envio.estado === "aduana"
        ).length;

    const entregados =
        envios.filter(
            envio =>
                envio.estado === "entregado"
        ).length;


    asignarTexto(
        "totalEnvios",
        total
    );

    asignarTexto(
        "enviosTransito",
        transito
    );

    asignarTexto(
        "enviosAduana",
        aduana
    );

    asignarTexto(
        "enviosEntregados",
        entregados
    );


    renderizarUltimosEnvios();

}


function asignarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor;

    }

}


/* =========================================================
   ÚLTIMOS ENVÍOS
========================================================= */

function renderizarUltimosEnvios() {

    const tabla =
        document.getElementById(
            "recentShipments"
        );

    if (!tabla) return;


    const recientes =
        envios.slice(0, 5);


    if (!recientes.length) {

        tabla.innerHTML = `
            <tr>
                <td colspan="8">
                    No hay envíos registrados.
                </td>
            </tr>
        `;

        return;

    }


    tabla.innerHTML =
        recientes.map(
            crearFilaEnvioDashboard
        ).join("");

}


function crearFilaEnvioDashboard(envio) {

    return `

        <tr>

            <td>
                <strong>
                    ${escaparHTML(envio.codigo)}
                </strong>
            </td>

            <td>
                ${escaparHTML(envio.cliente)}
            </td>

            <td>
                ${escaparHTML(envio.origen)}
            </td>

            <td>
                ${escaparHTML(envio.destino)}
            </td>

            <td>
                ${escaparHTML(envio.tipo)}
            </td>

            <td>
                ${crearEstado(envio.estado)}
            </td>

            <td>
                ${formatearFecha(envio.fecha)}
            </td>

            <td>

                <button
                    class="table-action"
                    onclick="verEnvio('${envio.id}')"
                    title="Ver detalle">

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        </tr>

    `;

}


/* =========================================================
   ENVÍOS
========================================================= */

function renderizarEnvios() {

    const tabla =
        document.getElementById(
            "shipmentsTable"
        );

    if (!tabla) return;


    const busqueda =
        document.getElementById(
            "shipmentSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const filtro =
        document.getElementById(
            "statusFilter"
        )?.value || "todos";


    let resultados =
        [...envios];


    if (busqueda) {

        resultados =
            resultados.filter(envio => {

                return (

                    envio.codigo
                        .toLowerCase()
                        .includes(busqueda)

                    ||

                    envio.cliente
                        .toLowerCase()
                        .includes(busqueda)

                    ||

                    envio.origen
                        .toLowerCase()
                        .includes(busqueda)

                    ||

                    envio.destino
                        .toLowerCase()
                        .includes(busqueda)

                );

            });

    }


    if (filtro !== "todos") {

        resultados =
            resultados.filter(
                envio =>
                    envio.estado === filtro
            );

    }


    if (!resultados.length) {

        tabla.innerHTML = `

            <tr>

                <td colspan="8">

                    <div class="empty-state">

                        <div class="empty-icon">

                            <i class="fa-solid fa-box-open"></i>

                        </div>

                        <h3>
                            No se encontraron envíos
                        </h3>

                        <p>
                            Intenta realizar otra búsqueda.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tabla.innerHTML =
        resultados.map(
            crearFilaEnvio
        ).join("");

}


function crearFilaEnvio(envio) {

    return `

        <tr>

            <td>
                <strong>
                    ${escaparHTML(envio.codigo)}
                </strong>
            </td>

            <td>
                ${escaparHTML(envio.cliente)}
            </td>

            <td>
                ${escaparHTML(envio.origen)}
            </td>

            <td>
                ${escaparHTML(envio.destino)}
            </td>

            <td>
                ${envio.peso} kg
            </td>

            <td>

                <select
                    class="shipment-status-select"
                    data-id="${envio.id}">

                    <option
                        value="pendiente"
                        ${envio.estado === "pendiente" ? "selected" : ""}>
                        Pendiente
                    </option>

                    <option
                        value="transito"
                        ${envio.estado === "transito" ? "selected" : ""}>
                        En tránsito
                    </option>

                    <option
                        value="aduana"
                        ${envio.estado === "aduana" ? "selected" : ""}>
                        En aduana
                    </option>

                    <option
                        value="entregado"
                        ${envio.estado === "entregado" ? "selected" : ""}>
                        Entregado
                    </option>

                </select>

            </td>

            <td>
                ${formatearFecha(envio.fecha)}
            </td>

            <td>

                <button
                    class="table-action"
                    onclick="verEnvio('${envio.id}')"
                    title="Ver">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button
                    class="table-action delete"
                    onclick="eliminarEnvio('${envio.id}')"
                    title="Eliminar">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

    `;

}


/* =========================================================
   ESTADO
========================================================= */

function crearEstado(estado) {

    const clase = {

        pendiente: "status-pendiente",

        transito: "status-transito",

        aduana: "status-aduana",

        entregado: "status-entregado"

    }[estado] || "status-pendiente";


    return `

        <span class="status ${clase}">

            ${estados[estado] || "Desconocido"}

        </span>

    `;

}


/* =========================================================
   CAMBIO DE ESTADO
========================================================= */

document.addEventListener(
    "change",
    evento => {

        if (
            !evento.target.classList.contains(
                "shipment-status-select"
            )
        ) {
            return;
        }


        const id =
            evento.target.dataset.id;

        const nuevoEstado =
            evento.target.value;


        cambiarEstado(
            id,
            nuevoEstado
        );

    }
);


function cambiarEstado(id, nuevoEstado) {

    const envio =
        envios.find(
            item =>
                String(item.id) === String(id)
        );


    if (!envio) return;


    if (
        envio.estado === nuevoEstado
    ) {
        return;
    }


    envio.estado =
        nuevoEstado;


    if (!envio.historial) {
        envio.historial = [];
    }


    envio.historial.push({

        estado: nuevoEstado,

        fecha:
            obtenerFechaHora(),

        descripcion:
            obtenerDescripcionEstado(
                nuevoEstado
            )

    });


    guardarEnvios();

    reconstruirClientes();

    actualizarTodo();


    mostrarNotificacion(
        `${envio.codigo} actualizado a "${estados[nuevoEstado]}".`,
        "success"
    );

}


function obtenerDescripcionEstado(estado) {

    const descripciones = {

        pendiente:
            "El envío se encuentra pendiente de procesamiento.",

        transito:
            "El envío se encuentra en tránsito.",

        aduana:
            "El envío se encuentra en proceso de aduana.",

        entregado:
            "El envío ha sido entregado correctamente."

    };


    return (
        descripciones[estado] ||
        "Estado actualizado."
    );

}


/* =========================================================
   BÚSQUEDA
========================================================= */

function inicializarBusqueda() {

    const busqueda =
        document.getElementById(
            "shipmentSearch"
        );

    const filtro =
        document.getElementById(
            "statusFilter"
        );


    if (busqueda) {

        busqueda.addEventListener(
            "input",
            renderizarEnvios
        );

    }


    if (filtro) {

        filtro.addEventListener(
            "change",
            renderizarEnvios
        );

    }


    const clientSearch =
        document.getElementById(
            "clientSearch"
        );


    if (clientSearch) {

        clientSearch.addEventListener(
            "input",
            renderizarClientes
        );

    }

}


/* =========================================================
   DETALLE DEL ENVÍO
========================================================= */

function verEnvio(id) {

    const envio =
        envios.find(
            item =>
                String(item.id) === String(id)
        );


    if (!envio) return;


    const modal =
        document.getElementById(
            "shipmentModal"
        );


    if (!modal) return;


    asignarTexto(
        "modalShipmentTitle",
        envio.codigo
    );

    asignarTexto(
        "modalClient",
        envio.cliente
    );

    asignarTexto(
        "modalStatus",
        estados[envio.estado]
    );

    asignarTexto(
        "modalOrigin",
        envio.origen
    );

    asignarTexto(
        "modalDestination",
        envio.destino
    );


    const timeline =
        modal.querySelector(
            ".tracking-timeline"
        );


    if (timeline) {

        timeline.innerHTML =
            crearTimeline(envio);

    }


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function crearTimeline(envio) {

    if (
        !envio.historial ||
        !envio.historial.length
    ) {

        return `

            <div class="empty-state">

                <p>
                    No existe historial.
                </p>

            </div>

        `;

    }


    return envio.historial
        .map((evento, indice) => {

            const esUltimo =
                indice ===
                envio.historial.length - 1;


            return `

                <div class="
                    timeline-item
                    ${esUltimo ? "active" : "completed"}
                ">

                    <div class="timeline-dot"></div>

                    <strong>
                        ${escaparHTML(
                            estados[evento.estado]
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(evento.fecha)}
                    </span>

                    <p>
                        ${escaparHTML(
                            evento.descripcion
                        )}
                    </p>

                </div>

            `;

        })
        .join("");

}


/* =========================================================
   MODAL
========================================================= */

function inicializarModal() {

    const modal =
        document.getElementById(
            "shipmentModal"
        );

    const cerrar =
        document.getElementById(
            "closeModal"
        );

    const cerrarButton =
        document.getElementById(
            "closeModalButton"
        );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarModal
        );

    }


    if (cerrarButton) {

        cerrarButton.addEventListener(
            "click",
            cerrarModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target === modal
                ) {

                    cerrarModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape"
            ) {

                cerrarModal();

            }

        }
    );

}


function cerrarModal() {

    const modal =
        document.getElementById(
            "shipmentModal"
        );


    if (!modal) return;


    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   ELIMINAR ENVÍO
========================================================= */

function eliminarEnvio(id) {

    const envio =
        envios.find(
            item =>
                String(item.id) === String(id)
        );


    if (!envio) return;


    const confirmar =
        confirm(
            `¿Deseas eliminar el envío ${envio.codigo}?`
        );


    if (!confirmar) return;


    envios =
        envios.filter(
            item =>
                String(item.id) !== String(id)
        );


    guardarEnvios();

    reconstruirClientes();

    actualizarTodo();


    mostrarNotificacion(
        `El envío ${envio.codigo} fue eliminado.`,
        "success"
    );

}


/* =========================================================
   CLIENTES
========================================================= */

function reconstruirClientes() {

    const mapa =
        {};


    envios.forEach(envio => {

        const clave =
            envio.cliente
                .trim()
                .toLowerCase();


        if (!mapa[clave]) {

            mapa[clave] = {

                id: generarId(),

                nombre: envio.cliente,

                telefono:
                    envio.telefono || "",

                total: 0,

                transito: 0,

                entregados: 0

            };

        }


        mapa[clave].total++;


        if (
            envio.estado === "transito"
        ) {

            mapa[clave].transito++;

        }


        if (
            envio.estado === "entregado"
        ) {

            mapa[clave].entregados++;

        }

    });


    clientes =
        Object.values(mapa);


    guardarClientes();

}


function inicializarClientes() {

    const boton =
        document.getElementById(
            "newClientButton"
        );


    if (boton) {

        boton.addEventListener(
            "click",
            () => {

                const nombre =
                    prompt(
                        "Nombre del nuevo cliente:"
                    );


                if (!nombre) return;


                const telefono =
                    prompt(
                        "Teléfono del cliente:"
                    ) || "";


                clientes.push({

                    id: generarId(),

                    nombre,

                    telefono,

                    total: 0,

                    transito: 0,

                    entregados: 0

                });


                guardarClientes();

                renderizarClientes();


                mostrarNotificacion(
                    "Cliente agregado correctamente.",
                    "success"
                );

            }
        );

    }

}


function renderizarClientes() {

    const tabla =
        document.getElementById(
            "clientsTable"
        );


    if (!tabla) return;


    const busqueda =
        document.getElementById(
            "clientSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    let resultados =
        [...clientes];


    if (busqueda) {

        resultados =
            resultados.filter(
                cliente => {

                    return (

                        cliente.nombre
                            .toLowerCase()
                            .includes(busqueda)

                        ||

                        cliente.telefono
                            .toLowerCase()
                            .includes(busqueda)

                    );

                }
            );

    }


    if (!resultados.length) {

        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-state">

                        <h3>
                            No hay clientes
                        </h3>

                        <p>
                            Los clientes aparecerán al registrar envíos.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tabla.innerHTML =
        resultados.map(
            cliente => `

                <tr>

                    <td>

                        <strong>
                            ${escaparHTML(
                                cliente.nombre
                            )}
                        </strong>

                    </td>

                    <td>
                        ${escaparHTML(
                            cliente.telefono || "—"
                        )}
                    </td>

                    <td>
                        ${cliente.total}
                    </td>

                    <td>
                        ${cliente.transito}
                    </td>

                    <td>
                        ${cliente.entregados}
                    </td>

                    <td>

                        <button
                            class="table-action"
                            onclick="verCliente('${cliente.nombre.replace(/'/g, "\\'")}')">

                            <i class="fa-solid fa-eye"></i>

                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


function verCliente(nombre) {

    const cliente =
        clientes.find(
            item =>
                item.nombre === nombre
        );


    if (!cliente) return;


    const enviosCliente =
        envios.filter(
            envio =>
                envio.cliente === nombre
        );


    alert(
        `Cliente: ${cliente.nombre}\n\n` +

        `Teléfono: ${
            cliente.telefono || "No registrado"
        }\n\n` +

        `Total de envíos: ${
            enviosCliente.length
        }\n\n` +

        `Entregados: ${
            enviosCliente.filter(
                e =>
                    e.estado === "entregado"
            ).length
        }\n\n` +

        `En tránsito: ${
            enviosCliente.filter(
                e =>
                    e.estado === "transito"
            ).length
        }`
    );

}


/* =========================================================
   SEGUIMIENTO
========================================================= */

function inicializarSeguimiento() {

    const boton =
        document.getElementById(
            "trackingButton"
        );

    const input =
        document.getElementById(
            "trackingCode"
        );


    if (boton) {

        boton.addEventListener(
            "click",
            consultarSeguimiento
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Enter"
                ) {

                    consultarSeguimiento();

                }

            }
        );

    }

}


function consultarSeguimiento() {

    const input =
        document.getElementById(
            "trackingCode"
        );


    if (!input) return;


    const codigo =
        input.value
            .trim()
            .toLowerCase();


    const envio =
        envios.find(
            item =>
                item.codigo
                    .toLowerCase() === codigo
        );


    const resultado =
        document.getElementById(
            "trackingResult"
        );

    const vacio =
        document.getElementById(
            "trackingEmpty"
        );


    if (!envio) {

        if (resultado) {
            resultado.style.display = "none";
        }

        if (vacio) {
            vacio.style.display = "block";
        }


        mostrarNotificacion(
            "No se encontró ningún envío con ese código.",
            "error"
        );

        return;

    }


    if (resultado) {

        resultado.style.display = "block";

    }

    if (vacio) {

        vacio.style.display = "none";

    }


    asignarTexto(
        "trackingResultTitle",
        envio.codigo
    );

    asignarTexto(
        "trackingResultClient",
        envio.cliente
    );

    asignarTexto(
        "trackingOrigin",
        envio.origen
    );

    asignarTexto(
        "trackingDestination",
        envio.destino
    );

    asignarTexto(
        "trackingType",
        envio.tipo
    );

    asignarTexto(
        "trackingWeight",
        `${envio.peso} kg`
    );


    const estado =
        document.getElementById(
            "trackingResultStatus"
        );


    if (estado) {

        estado.className =
            `status status-${envio.estado}`;

        estado.textContent =
            estados[envio.estado];

    }


    const timeline =
        document.getElementById(
            "trackingTimeline"
        );


    if (timeline) {

        timeline.innerHTML =
            crearTimeline(envio);

    }

}


/* =========================================================
   REPORTES
========================================================= */

function inicializarReportes() {

    const boton =
        document.getElementById(
            "exportReportButton"
        );


    if (boton) {

        boton.addEventListener(
            "click",
            exportarReporte
        );

    }

}


function actualizarReportes() {

    const total =
        envios.length;


    const importaciones =
        envios.filter(
            envio =>
                envio.tipo === "Importación"
        ).length;


    const exportaciones =
        envios.filter(
            envio =>
                envio.tipo === "Exportación"
        ).length;


    const peso =
        envios.reduce(
            (total, envio) =>
                total +
                Number(envio.peso || 0),
            0
        );


    asignarTexto(
        "reportTotal",
        total
    );

    asignarTexto(
        "reportImports",
        importaciones
    );

    asignarTexto(
        "reportExports",
        exportaciones
    );

    asignarTexto(
        "reportWeight",
        `${peso.toFixed(1)} kg`
    );


    const tabla =
        document.getElementById(
            "reportTable"
        );


    if (!tabla) return;


    const porcentaje =
        total > 0
            ? Math.round(
                (importaciones / total) * 100
            )
            : 0;


    const porcentajeExport =
        total > 0
            ? Math.round(
                (exportaciones / total) * 100
            )
            : 0;


    tabla.innerHTML = `

        <tr>

            <td>
                Importaciones
            </td>

            <td>
                ${importaciones}
            </td>

            <td>
                ${porcentaje}%
            </td>

        </tr>


        <tr>

            <td>
                Exportaciones
            </td>

            <td>
                ${exportaciones}
            </td>

            <td>
                ${porcentajeExport}%
            </td>

        </tr>


        <tr>

            <td>
                Pendientes
            </td>

            <td>
                ${
                    envios.filter(
                        e =>
                            e.estado === "pendiente"
                    ).length
                }
            </td>

            <td>
                ${
                    total
                        ? Math.round(
                            (
                                envios.filter(
                                    e =>
                                        e.estado === "pendiente"
                                ).length /
                                total
                            ) * 100
                        )
                        : 0
                }%
            </td>

        </tr>


        <tr>

            <td>
                En tránsito
            </td>

            <td>
                ${
                    envios.filter(
                        e =>
                            e.estado === "transito"
                    ).length
                }
            </td>

            <td>
                ${
                    total
                        ? Math.round(
                            (
                                envios.filter(
                                    e =>
                                        e.estado === "transito"
                                ).length /
                                total
                            ) * 100
                        )
                        : 0
                }%
            </td>

        </tr>


        <tr>

            <td>
                En aduana
            </td>

            <td>
                ${
                    envios.filter(
                        e =>
                            e.estado === "aduana"
                    ).length
                }
            </td>

            <td>
                ${
                    total
                        ? Math.round(
                            (
                                envios.filter(
                                    e =>
                                        e.estado === "aduana"
                                ).length /
                                total
                            ) * 100
                        )
                        : 0
                }%
            </td>

        </tr>


        <tr>

            <td>
                Entregados
            </td>

            <td>
                ${
                    envios.filter(
                        e =>
                            e.estado === "entregado"
                    ).length
                }
            </td>

            <td>
                ${
                    total
                        ? Math.round(
                            (
                                envios.filter(
                                    e =>
                                        e.estado === "entregado"
                                ).length /
                                total
                            ) * 100
                        )
                        : 0
                }%
            </td>

        </tr>

    `;

}


/* =========================================================
   EXPORTAR REPORTE
========================================================= */

function exportarReporte() {

    if (!envios.length) {

        mostrarNotificacion(
            "No existen datos para exportar.",
            "error"
        );

        return;

    }


    let csv =
        "Código,Cliente,Origen,Destino,Tipo,Peso,Estado,Fecha\n";


    envios.forEach(envio => {

        csv += [

            envio.codigo,

            envio.cliente,

            envio.origen,

            envio.destino,

            envio.tipo,

            envio.peso,

            estados[envio.estado],

            envio.fecha

        ]
        .map(valor =>
            `"${String(valor).replace(/"/g, '""')}"`
        )
        .join(",");


        csv += "\n";

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const enlace =
        document.createElement("a");


    enlace.href = url;

    enlace.download =
        `reporte-envios-ya-${obtenerFechaActual()}.csv`;


    document.body.appendChild(
        enlace
    );


    enlace.click();


    enlace.remove();

    URL.revokeObjectURL(url);


    mostrarNotificacion(
        "Reporte exportado correctamente.",
        "success"
    );

}


/* =========================================================
   CONFIGURACIÓN
========================================================= */

function inicializarConfiguracion() {

    const boton =
        document.getElementById(
            "saveSettingsButton"
        );


    if (!boton) return;


    boton.addEventListener(
        "click",
        () => {

            mostrarNotificacion(
                "Configuración guardada correctamente.",
                "success"
            );

        }
    );

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacion(
    mensaje,
    tipo = "success"
) {

    const anterior =
        document.querySelector(
            ".notification-toast"
        );


    if (anterior) {
        anterior.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `notification-toast ${tipo}`;


    toast.textContent =
        mensaje;


    document.body.appendChild(
        toast
    );


    setTimeout(() => {

        toast.remove();

    }, 3500);

}


/* =========================================================
   ACTUALIZACIÓN GENERAL
========================================================= */

function actualizarTodo() {

    actualizarDashboard();

    renderizarEnvios();

    reconstruirClientes();

    renderizarClientes();

    actualizarReportes();

}


/* =========================================================
   EXPOSICIÓN DE FUNCIONES
========================================================= */

window.verEnvio =
    verEnvio;

window.eliminarEnvio =
    eliminarEnvio;

window.verCliente =
    verCliente;