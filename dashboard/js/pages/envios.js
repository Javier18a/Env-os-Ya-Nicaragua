/* =========================================================
   ENVÍOS YA
   envios.js
   Gestión y consulta de envíos

   IMPORTANTE:
   Este módulo trabaja inicialmente en modo lectura.

   NO crea, modifica ni elimina registros existentes.
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ENVIOS_STORAGE_KEY = "envios";


/* =========================================================
   ESTADO DEL MÓDULO
========================================================= */

let enviosData = [];
let filteredEnvios = [];

let searchTerm = "";
let statusFilter = "all";


/* =========================================================
   INICIALIZAR MÓDULO
========================================================= */

function initializeEnvios() {

    console.log("Inicializando módulo de Envíos...");

    cargarEnvios();

    inicializarEventosEnvios();

    actualizarInterfazEnvios();

}


/* =========================================================
   CARGAR ENVÍOS
========================================================= */

function cargarEnvios() {

    try {

        const storedData =
            localStorage.getItem(ENVIOS_STORAGE_KEY);


        /*
         * Si no existe la clave:
         *
         * NO creamos nada.
         */

        if (!storedData) {

            enviosData = [];
            filteredEnvios = [];

            return;

        }


        const parsedData =
            JSON.parse(storedData);


        /*
         * Validamos que sea un arreglo.
         */

        if (!Array.isArray(parsedData)) {

            console.warn(
                "El almacenamiento de envíos no contiene un arreglo válido."
            );

            enviosData = [];
            filteredEnvios = [];

            return;

        }


        /*
         * Copia local únicamente para lectura.
         */

        enviosData = parsedData;

        filteredEnvios = [...enviosData];


        console.log(
            `Envíos cargados: ${enviosData.length}`
        );


    } catch (error) {

        console.error(
            "Error leyendo los envíos:",
            error
        );

        enviosData = [];
        filteredEnvios = [];

    }

}


/* =========================================================
   EVENTOS
========================================================= */

function inicializarEventosEnvios() {

    const searchInput =
        document.getElementById("shipmentSearch");


    const statusSelect =
        document.getElementById("shipmentStatusFilter");


    const refreshButton =
        document.getElementById(
            "refreshShipmentsButton"
        );


    const newShipmentButton =
        document.getElementById(
            "newShipmentButton"
        );


    /* =====================================================
       BUSCADOR
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                searchTerm =
                    event.target.value
                        .trim()
                        .toLowerCase();

                aplicarFiltros();

            }
        );

    }


    /* =====================================================
       FILTRO DE ESTADO
    ===================================================== */

    if (statusSelect) {

        statusSelect.addEventListener(
            "change",
            event => {

                statusFilter =
                    event.target.value;

                aplicarFiltros();

            }
        );

    }


    /* =====================================================
       ACTUALIZAR
    ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                cargarEnvios();

                actualizarEstadisticas();

                aplicarFiltros();

            }
        );

    }


    /* =====================================================
       REGISTRAR ENVÍO
    ===================================================== */

    if (newShipmentButton) {

        newShipmentButton.addEventListener(
            "click",
            () => {

                /*
                 * No se crea ningún registro.
                 *
                 * Solamente navegamos al módulo
                 * de registro.
                 */

                loadPage("registrar");

            }
        );

    }


    /* =====================================================
       ACCIONES DE TABLA
    ===================================================== */

    const tableBody =
        document.getElementById(
            "shipmentsTableBody"
        );


    if (tableBody) {

        tableBody.addEventListener(
            "click",
            manejarAccionEnvio
        );

    }

}


/* =========================================================
   APLICAR FILTROS
========================================================= */

function aplicarFiltros() {

    filteredEnvios =
        enviosData.filter(envio => {

            const matchesSearch =
                buscarEnEnvio(
                    envio,
                    searchTerm
                );


            const matchesStatus =
                filtrarPorEstado(
                    envio,
                    statusFilter
                );


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderizarTabla();

    actualizarEstadoVacio();

}


/* =========================================================
   BUSCAR EN ENVÍO
========================================================= */

function buscarEnEnvio(envio, term) {

    if (!term) {

        return true;

    }


    try {

        return JSON.stringify(envio)
            .toLowerCase()
            .includes(term);

    } catch (error) {

        return false;

    }

}


/* =========================================================
   FILTRAR POR ESTADO
========================================================= */

function filtrarPorEstado(envio, estado) {

    if (
        !estado ||
        estado === "all"
    ) {

        return true;

    }


    const envioStatus =
        obtenerEstadoEnvio(envio);


    return (
        normalizarEstado(envioStatus) ===
        normalizarEstado(estado)
    );

}


/* =========================================================
   OBTENER ESTADO
========================================================= */

function obtenerEstadoEnvio(envio) {

    return (
        envio?.estado ??
        envio?.status ??
        envio?.situacion ??
        ""
    );

}


/* =========================================================
   NORMALIZAR ESTADO
========================================================= */

function normalizarEstado(estado) {

    return String(estado)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /\s+/g,
            "-"
        );

}


/* =========================================================
   ACTUALIZAR INTERFAZ
========================================================= */

function actualizarInterfazEnvios() {

    actualizarEstadisticas();

    aplicarFiltros();

}


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function actualizarEstadisticas() {

    const total =
        enviosData.length;


    const pendientes =
        enviosData.filter(
            envio =>
                normalizarEstado(
                    obtenerEstadoEnvio(envio)
                ) === "pendiente"
        ).length;


    const transito =
        enviosData.filter(
            envio =>
                normalizarEstado(
                    obtenerEstadoEnvio(envio)
                ) === "transito"
        ).length;


    const entregados =
        enviosData.filter(
            envio =>
                normalizarEstado(
                    obtenerEstadoEnvio(envio)
                ) === "entregado"
        ).length;


    actualizarElemento(
        "totalShipments",
        total
    );


    actualizarElemento(
        "pendingShipments",
        pendientes
    );


    actualizarElemento(
        "transitShipments",
        transito
    );


    actualizarElemento(
        "deliveredShipments",
        entregados
    );

}


/* =========================================================
   ACTUALIZAR ELEMENTO
========================================================= */

function actualizarElemento(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent = value;

}


/* =========================================================
   RENDERIZAR TABLA
========================================================= */

function renderizarTabla() {

    const tableBody =
        document.getElementById(
            "shipmentsTableBody"
        );


    if (!tableBody) {

        return;

    }


    if (!filteredEnvios.length) {

        tableBody.innerHTML = "";

        return;

    }


    tableBody.innerHTML =
        filteredEnvios
            .map(
                (envio, index) =>
                    crearFilaEnvio(
                        envio,
                        index
                    )
            )
            .join("");

}


/* =========================================================
   CREAR FILA
========================================================= */

function crearFilaEnvio(
    envio,
    index
) {

    const referencia =
        obtenerReferencia(
            envio,
            index
        );


    const cliente =
        obtenerCliente(envio);


    const origen =
        obtenerOrigen(envio);


    const destino =
        obtenerDestino(envio);


    const fecha =
        obtenerFecha(envio);


    const estado =
        obtenerEstadoEnvio(envio);


    const estadoNormalizado =
        normalizarEstado(estado);


    return `

        <tr data-index="${index}">

            <td>
                <strong>
                    ${escaparHTML(referencia)}
                </strong>
            </td>


            <td>
                ${escaparHTML(cliente)}
            </td>


            <td>
                ${escaparHTML(origen)}
            </td>


            <td>
                ${escaparHTML(destino)}
            </td>


            <td>
                ${escaparHTML(fecha)}
            </td>


            <td>

                <span
                    class="status status-${
                        escaparHTML(
                            estadoNormalizado ||
                            "pendiente"
                        )
                    }">

                    ${
                        escaparHTML(
                            estado ||
                            "Pendiente"
                        )
                    }

                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="table-action"
                    data-action="view"
                    data-index="${index}"
                    title="Ver envío">

                    <i class="fas fa-eye"></i>

                </button>


                <button
                    type="button"
                    class="table-action"
                    data-action="tracking"
                    data-index="${index}"
                    title="Seguimiento">

                    <i class="fas fa-route"></i>

                </button>

            </td>

        </tr>

    `;

}


/* =========================================================
   OBTENER REFERENCIA
========================================================= */

function obtenerReferencia(
    envio,
    index
) {

    return (
        envio?.referencia ??
        envio?.reference ??
        envio?.codigo ??
        envio?.tracking ??
        envio?.numero ??
        `ENV-${String(index + 1).padStart(4, "0")}`
    );

}


/* =========================================================
   OBTENER CLIENTE
========================================================= */

function obtenerCliente(envio) {

    return (
        envio?.cliente?.nombre ??
        envio?.cliente ??
        envio?.customer?.name ??
        envio?.customer ??
        envio?.nombreCliente ??
        envio?.remitente ??
        "—"
    );

}


/* =========================================================
   OBTENER ORIGEN
========================================================= */

function obtenerOrigen(envio) {

    return (
        envio?.origen?.ciudad ??
        envio?.origen?.nombre ??
        envio?.origen ??
        envio?.origin ??
        "—"
    );

}


/* =========================================================
   OBTENER DESTINO
========================================================= */

function obtenerDestino(envio) {

    return (
        envio?.destino?.ciudad ??
        envio?.destino?.nombre ??
        envio?.destino ??
        envio?.destination ??
        "—"
    );

}


/* =========================================================
   OBTENER FECHA
========================================================= */

function obtenerFecha(envio) {

    const fecha =
        envio?.fecha ??
        envio?.fechaRegistro ??
        envio?.createdAt ??
        envio?.date;


    if (!fecha) {

        return "—";

    }


    try {

        const date =
            new Date(fecha);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(fecha);

        }


        return date.toLocaleDateString(
            "es-NI"
        );


    } catch (error) {

        return String(fecha);

    }

}


/* =========================================================
   MANEJAR ACCIONES
========================================================= */

function manejarAccionEnvio(event) {

    const button =
        event.target.closest(
            "[data-action]"
        );


    if (!button) {

        return;

    }


    const action =
        button.dataset.action;


    const index =
        Number(
            button.dataset.index
        );


    const envio =
        filteredEnvios[index];


    if (!envio) {

        return;

    }


    if (action === "view") {

        verEnvio(envio);

    }


    if (action === "tracking") {

        verSeguimiento(envio);

    }

}


/* =========================================================
   VER ENVÍO
========================================================= */

function verEnvio(envio) {

    console.log(
        "Visualizando envío:",
        envio
    );

}


/* =========================================================
   VER SEGUIMIENTO
========================================================= */

function verSeguimiento(envio) {

    console.log(
        "Consultando seguimiento:",
        envio
    );


    /*
     * No modificamos el envío.
     */

    loadPage("seguimiento");

}


/* =========================================================
   ESTADO VACÍO
========================================================= */

function actualizarEstadoVacio() {

    const emptyState =
        document.getElementById(
            "shipmentsEmptyState"
        );


    if (!emptyState) {

        return;

    }


    emptyState.hidden =
        filteredEnvios.length !== 0;

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   EXPORTAR DATOS DEL MÓDULO
========================================================= */

function getEnviosData() {

    return [
        ...enviosData
    ];

}