/* =========================================================
   ENVÍOS YA
   dashboard.js

   Lógica exclusiva del Dashboard

   IMPORTANTE:
   Este módulo funciona únicamente sobre la vista
   dashboard.html.

   No crea, modifica ni elimina envíos.
========================================================= */


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function initializeDashboard() {

    console.log(
        "Inicializando Dashboard..."
    );


    cargarResumenDashboard();

    cargarUltimosEnvios();

}


/* =========================================================
   CARGAR RESUMEN
========================================================= */

function cargarResumenDashboard() {

    const envios =
        obtenerEnviosDashboard();


    const total =
        envios.length;


    const pendientes =
        envios.filter(
            envio =>
                normalizarEstadoDashboard(
                    obtenerEstadoDashboard(envio)
                ) === "pendiente"
        ).length;


    const transito =
        envios.filter(
            envio =>
                normalizarEstadoDashboard(
                    obtenerEstadoDashboard(envio)
                ) === "transito"
        ).length;


    const entregados =
        envios.filter(
            envio =>
                normalizarEstadoDashboard(
                    obtenerEstadoDashboard(envio)
                ) === "entregado"
        ).length;


    actualizarDashboardElemento(
        "dashboardTotalShipments",
        total
    );


    actualizarDashboardElemento(
        "dashboardPendingShipments",
        pendientes
    );


    actualizarDashboardElemento(
        "dashboardTransitShipments",
        transito
    );


    actualizarDashboardElemento(
        "dashboardDeliveredShipments",
        entregados
    );

}


/* =========================================================
   OBTENER ENVÍOS
========================================================= */

function obtenerEnviosDashboard() {

    const STORAGE_KEY =
        "envios";


    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );


        /*
           Si no existe información,
           simplemente devolvemos un arreglo vacío.

           NO creamos datos.
        */

        if (!data) {

            return [];

        }


        const parsed =
            JSON.parse(data);


        if (!Array.isArray(parsed)) {

            return [];

        }


        return parsed;


    } catch (error) {

        console.error(
            "Error leyendo envíos para Dashboard:",
            error
        );


        return [];

    }

}


/* =========================================================
   OBTENER ESTADO
========================================================= */

function obtenerEstadoDashboard(envio) {

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

function normalizarEstadoDashboard(
    estado
) {

    return String(estado ?? "")
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
   ACTUALIZAR ELEMENTO
========================================================= */

function actualizarDashboardElemento(
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


    element.textContent =
        value;

}


/* =========================================================
   ÚLTIMOS ENVÍOS
========================================================= */

function cargarUltimosEnvios() {

    const tableBody =
        document.getElementById(
            "dashboardRecentShipments"
        );


    if (!tableBody) {

        return;

    }


    const envios =
        obtenerEnviosDashboard();


    /*
       No modificamos el arreglo original.

       Solo obtenemos una copia para ordenar
       los datos mostrados.
    */

    const recientes =
        [...envios]
            .sort(
                compararFechasDashboard
            )
            .slice(
                0,
                5
            );


    if (!recientes.length) {

        tableBody.innerHTML = "";

        actualizarDashboardEmptyState(
            true
        );

        return;

    }


    actualizarDashboardEmptyState(
        false
    );


    tableBody.innerHTML =
        recientes
            .map(
                (envio, index) =>
                    crearFilaDashboard(
                        envio,
                        index
                    )
            )
            .join("");

}


/* =========================================================
   COMPARAR FECHAS
========================================================= */

function compararFechasDashboard(
    a,
    b
) {

    const fechaA =
        obtenerFechaDashboard(a);


    const fechaB =
        obtenerFechaDashboard(b);


    const timestampA =
        fechaA
            ? new Date(fechaA).getTime()
            : 0;


    const timestampB =
        fechaB
            ? new Date(fechaB).getTime()
            : 0;


    return timestampB - timestampA;

}


/* =========================================================
   OBTENER FECHA
========================================================= */

function obtenerFechaDashboard(
    envio
) {

    return (
        envio?.fecha ??
        envio?.fechaRegistro ??
        envio?.createdAt ??
        envio?.date ??
        ""
    );

}


/* =========================================================
   CREAR FILA
========================================================= */

function crearFilaDashboard(
    envio,
    index
) {

    const referencia =
        envio?.referencia ??
        envio?.reference ??
        envio?.codigo ??
        envio?.tracking ??
        envio?.numero ??
        `ENV-${String(index + 1).padStart(4, "0")}`;


    const cliente =
        envio?.cliente?.nombre ??
        envio?.cliente ??
        envio?.customer?.name ??
        envio?.customer ??
        envio?.nombreCliente ??
        envio?.remitente ??
        "—";


    const origen =
        envio?.origen?.ciudad ??
        envio?.origen?.nombre ??
        envio?.origen ??
        envio?.origin ??
        "—";


    const destino =
        envio?.destino?.ciudad ??
        envio?.destino?.nombre ??
        envio?.destino ??
        envio?.destination ??
        "—";


    const estado =
        envio?.estado ??
        envio?.status ??
        envio?.situacion ??
        "Pendiente";


    const estadoNormalizado =
        normalizarEstadoDashboard(
            estado
        );


    const fecha =
        formatearFechaDashboard(
            obtenerFechaDashboard(
                envio
            )
        );


    return `

        <tr>

            <td>

                <strong>
                    ${escaparDashboard(
                        referencia
                    )}
                </strong>

            </td>


            <td>
                ${escaparDashboard(
                    cliente
                )}
            </td>


            <td>
                ${escaparDashboard(
                    origen
                )}
            </td>


            <td>
                ${escaparDashboard(
                    destino
                )}
            </td>


            <td>
                ${escaparDashboard(
                    fecha
                )}
            </td>


            <td>

                <span class="status status-${escaparDashboard(
                    estadoNormalizado
                )}">

                    ${escaparDashboard(
                        estado
                    )}

                </span>

            </td>

        </tr>

    `;

}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFechaDashboard(
    fecha
) {

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
   ESTADO VACÍO
========================================================= */

function actualizarDashboardEmptyState(
    empty
) {

    const emptyState =
        document.getElementById(
            "dashboardRecentEmpty"
        );


    if (!emptyState) {

        return;

    }


    emptyState.hidden =
        !empty;

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparDashboard(
    value
) {

    return String(
        value ?? ""
    )
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
   ACTUALIZAR DASHBOARD
========================================================= */

function refreshDashboard() {

    cargarResumenDashboard();

    cargarUltimosEnvios();

}