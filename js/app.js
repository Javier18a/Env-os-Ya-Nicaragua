/* =========================================================
   ENVÍOS YA
   SISTEMA DE GESTIÓN DE ENVÍOS
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const STORAGE_KEY = "enviosYa_envios";
const CLIENTS_KEY = "enviosYa_clientes";
const SETTINGS_KEY = "enviosYa_configuracion";


const estados = {
    pendiente: "Pendiente",
    transito: "En tránsito",
    aduana: "En aduana",
    entregado: "Entregado"
};


/* =========================================================
   VARIABLES GLOBALES
========================================================= */

let envios = [];
let clientes = [];

let currentShipment = null;


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    cargarDatos();

    inicializarNavegacion();
    inicializarFormulario();
    inicializarBusquedas();
    inicializarSeguimiento();
    inicializarModal();
    inicializarClientes();
    inicializarConfiguracion();
    inicializarMenuMovil();

    establecerFechaActual();
    prepararFormulario();

    renderizarTodo();

});


/* =========================================================
   CARGAR DATOS
========================================================= */

function cargarDatos() {

    try {

        const enviosGuardados =
            localStorage.getItem(STORAGE_KEY);

        const clientesGuardados =
            localStorage.getItem(CLIENTS_KEY);


        envios = enviosGuardados
            ? JSON.parse(enviosGuardados)
            : [];


        clientes = clientesGuardados
            ? JSON.parse(clientesGuardados)
            : [];


        if (!Array.isArray(envios)) {
            envios = [];
        }


        if (!Array.isArray(clientes)) {
            clientes = [];
        }


        envios = envios.map(normalizarEnvio);

        actualizarClientes();

    } catch (error) {

        console.error(
            "Error al cargar datos:",
            error
        );

        envios = [];
        clientes = [];

    }

}


/* =========================================================
   NORMALIZAR ENVÍO
========================================================= */

function normalizarEnvio(envio) {

    if (
        !envio ||
        typeof envio !== "object"
    ) {

        return {};

    }


    const estadoActual =
        estados[envio.estado]
            ? envio.estado
            : "pendiente";


    return {

        ...envio,

        id:
            envio.id ??
            Date.now(),


        codigo:
            envio.codigo ||
            `ENV-${String(
                Date.now()
            ).slice(-5)}`,


        fecha:
            envio.fecha || "",


        operationType:
            envio.operationType || "",


        transportMode:
            envio.transportMode || "",


        packageQuantity:
            Number(
                envio.packageQuantity
            ) || 0,


        packageType:
            envio.packageType || "",


        packageCategory:
            envio.packageCategory || "",


        description:
            envio.description || "",


        weight:
            Number(
                envio.weight
            ) || 0,


        declaredValue:
            Number(
                envio.declaredValue
            ) || 0,


        currency:
            envio.currency || "",


        dimensions: {

            unit:
                envio.dimensions?.unit || "",

            length:
                Number(
                    envio.dimensions?.length
                ) || 0,

            width:
                Number(
                    envio.dimensions?.width
                ) || 0,

            height:
                Number(
                    envio.dimensions?.height
                ) || 0,

            cubicFeet:
                Number(
                    envio.dimensions?.cubicFeet
                ) || 0

        },


        cliente: {

            nombre:
                envio.cliente?.nombre || "",

            telefono:
                envio.cliente?.telefono || "",

            email:
                envio.cliente?.email || "",

            documento:
                envio.cliente?.documento || "",

            direccion:
                envio.cliente?.direccion || ""

        },


        ruta: {

            origen:
                envio.ruta?.origen || "",

            destino:
                envio.ruta?.destino || "",

            remitente:
                envio.ruta?.remitente || "",

            destinatario:
                envio.ruta?.destinatario || "",

            direccionEntrega:
                envio.ruta?.direccionEntrega || ""

        },


        specialHandling:
            envio.specialHandling || "",


        insurance:
            envio.insurance || "",


        notes:
            envio.notes || "",


        estado:
            estadoActual,


        estadoLabel:
            estados[estadoActual],


        history:
            Array.isArray(envio.history)
                ? envio.history
                : []

    };

}


/* =========================================================
   GUARDAR DATOS
========================================================= */

function guardarDatos() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(envios)
        );


        localStorage.setItem(
            CLIENTS_KEY,
            JSON.stringify(clientes)
        );

    } catch (error) {

        console.error(
            "Error al guardar datos:",
            error
        );

    }

}


/* =========================================================
   NAVEGACIÓN
========================================================= */


function inicializarNavegacion() {

    document.querySelectorAll("[data-section]")
        .forEach(elemento => {

            elemento.addEventListener("click", event => {

                /*
                    Evita que un <a href="#"> o <a href="#...">
                    haga su propia navegación.
                */
                event.preventDefault();

                const seccion =
                    elemento.dataset.section;

                if (!seccion) return;

                cambiarSeccion(seccion);

            });

        });

}


function cambiarSeccion(nombreSeccion) {

    if (!nombreSeccion) return;


    const section =
        document.getElementById(nombreSeccion);


    if (!section) {

        console.warn(
            `No existe la sección: ${nombreSeccion}`
        );

        return;

    }


    document.querySelectorAll(".content-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    section.classList.add("active");


    document.querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

            if (
                item.dataset.section ===
                nombreSeccion
            ) {

                item.classList.add("active");

            }

        });


    actualizarTitulo(nombreSeccion);


    /*
        Solo renderizamos cuando cambiamos
        de sección.
    */
    renderizarTodo();

}


function manejarNavegacion(event) {

    /*
        Evita que un <a href=""> recargue
        la página.
    */

    if (
        event.currentTarget.tagName ===
        "A"
    ) {

        event.preventDefault();

    }


    const elemento =
        event.currentTarget;


    const seccion =
        elemento.dataset.section;


    if (!seccion) {

        console.warn(
            "Elemento de navegación sin data-section:",
            elemento
        );

        return;

    }


    cambiarSeccion(
        seccion
    );

}


function cambiarSeccion(
    nombreSeccion
) {

    if (!nombreSeccion) {
        return;
    }


    const section =
        document.getElementById(
            nombreSeccion
        );


    if (!section) {

        console.warn(
            `No existe la sección #${nombreSeccion}`
        );

        return;

    }


    /*
        Ocultar todas las secciones
    */

    document.querySelectorAll(
        ".content-section"
    )
        .forEach(sectionElemento => {

            sectionElemento.classList.remove(
                "active"
            );

        });


    /*
        Mostrar sección seleccionada
    */

    section.classList.add(
        "active"
    );


    /*
        Actualizar navegación
    */

    document.querySelectorAll(
        ".nav-item"
    )
        .forEach(item => {

            item.classList.remove(
                "active"
            );


            /*
                Comparamos tanto data-section
                como href
            */

            const dataSection =
                item.dataset.section;


            const href =
                item.getAttribute(
                    "href"
                );


            if (
                dataSection ===
                nombreSeccion
            ) {

                item.classList.add(
                    "active"
                );

            }
            else if (
                href ===
                `#${nombreSeccion}`
            ) {

                item.classList.add(
                    "active"
                );

            }

        });


    actualizarTitulo(
        nombreSeccion
    );


    /*
        Cerrar menú móvil
    */

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    /*
        Volver al inicio de la sección
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
        Actualizar contenido
    */

    renderizarTodo();

}


function actualizarTitulo(
    seccion
) {

    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (!pageTitle) {
        return;
    }


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


    pageTitle.textContent =
        titulos[seccion] ||
        "Sistema";

}


/* =========================================================
   FECHA ACTUAL
========================================================= */

function establecerFechaActual() {

    const elemento =
        document.getElementById(
            "currentDate"
        );


    if (!elemento) {
        return;
    }


    const fecha =
        new Date();


    elemento.textContent =
        fecha.toLocaleDateString(
            "es-NI",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


/* =========================================================
   GENERAR CÓDIGO
========================================================= */

function generarCodigoEnvio() {

    let numero =
        envios.length + 1;


    let codigo =
        `ENV-${String(numero).padStart(5, "0")}`;


    while (
        envios.some(
            envio =>
                envio.codigo === codigo
        )
    ) {

        numero++;


        codigo =
            `ENV-${String(numero).padStart(5, "0")}`;

    }


    return codigo;

}


/* =========================================================
   PREPARAR FORMULARIO
========================================================= */

function prepararFormulario() {

    const codigo =
        document.getElementById(
            "shipmentCode"
        );


    const fecha =
        document.getElementById(
            "shipmentDate"
        );


    if (codigo) {

        codigo.value =
            generarCodigoEnvio();

    }


    if (fecha) {

        const hoy =
            new Date()
                .toISOString()
                .split("T")[0];


        fecha.value =
            hoy;

    }

}


/* =========================================================
   FORMULARIO
========================================================= */

function inicializarFormulario() {

    const form =
        document.getElementById(
            "shipmentForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        registrarEnvio
    );


    const packageType =
        document.getElementById(
            "packageType"
        );


    if (packageType) {

        packageType.addEventListener(
            "change",
            controlarTipoPaquete
        );

    }


    const packageCategory =
        document.getElementById(
            "packageCategory"
        );


    if (packageCategory) {

        packageCategory.addEventListener(
            "change",
            controlarCategoria
        );

    }


    const length =
        document.getElementById(
            "packageLength"
        );


    const width =
        document.getElementById(
            "packageWidth"
        );


    const height =
        document.getElementById(
            "packageHeight"
        );


    const unit =
        document.getElementById(
            "dimensionUnit"
        );


    [
        length,
        width,
        height,
        unit
    ]
        .forEach(elemento => {

            if (!elemento) {
                return;
            }


            elemento.addEventListener(
                "input",
                calcularVolumen
            );


            elemento.addEventListener(
                "change",
                calcularVolumen
            );

        });


    form.addEventListener(
        "reset",
        () => {

            setTimeout(
                () => {

                    prepararFormulario();

                    controlarTipoPaquete();

                    controlarCategoria();

                    calcularVolumen();

                },
                50
            );

        }
    );

}


/* =========================================================
   TIPO DE PAQUETE
========================================================= */

function controlarTipoPaquete() {

    const select =
        document.getElementById(
            "packageType"
        );


    const group =
        document.getElementById(
            "otherPackageTypeGroup"
        );


    const input =
        document.getElementById(
            "otherPackageType"
        );


    if (!select || !group) {
        return;
    }


    if (
        select.value === "Otro"
    ) {

        group.style.display =
            "block";


        if (input) {

            input.required =
                true;

        }

    }
    else {

        group.style.display =
            "none";


        if (input) {

            input.required =
                false;

            input.value =
                "";

        }

    }

}


/* =========================================================
   CATEGORÍA
========================================================= */

function controlarCategoria() {

    const select =
        document.getElementById(
            "packageCategory"
        );


    const group =
        document.getElementById(
            "otherCategoryGroup"
        );


    const input =
        document.getElementById(
            "otherCategory"
        );


    if (!select || !group) {
        return;
    }


    if (
        select.value === "Otro"
    ) {

        group.style.display =
            "block";


        if (input) {

            input.required =
                true;

        }

    }
    else {

        group.style.display =
            "none";


        if (input) {

            input.required =
                false;

            input.value =
                "";

        }

    }

}


/* =========================================================
   CALCULAR VOLUMEN
========================================================= */

function calcularVolumen() {

    const length =
        parseFloat(
            document.getElementById(
                "packageLength"
            )?.value
        ) || 0;


    const width =
        parseFloat(
            document.getElementById(
                "packageWidth"
            )?.value
        ) || 0;


    const height =
        parseFloat(
            document.getElementById(
                "packageHeight"
            )?.value
        ) || 0;


    const unit =
        document.getElementById(
            "dimensionUnit"
        )?.value;


    const cubicFeet =
        document.getElementById(
            "cubicFeet"
        );


    if (!cubicFeet) {
        return;
    }


    if (
        length <= 0 ||
        width <= 0 ||
        height <= 0
    ) {

        cubicFeet.value =
            "";

        return;

    }


    let largo =
        length;

    let ancho =
        width;

    let alto =
        height;


    if (
        unit === "centimetros"
    ) {

        largo /= 30.48;
        ancho /= 30.48;
        alto /= 30.48;

    }
    else if (
        unit === "pulgadas"
    ) {

        largo /= 12;
        ancho /= 12;
        alto /= 12;

    }


    const volumen =
        largo *
        ancho *
        alto;


    cubicFeet.value =
        volumen.toFixed(2);

}


/* =========================================================
   REGISTRAR ENVÍO
========================================================= */

function registrarEnvio(
    event
) {

    event.preventDefault();


    const obtenerValor =
        id =>
            document.getElementById(
                id
            )?.value || "";


    const codigo =
        obtenerValor(
            "shipmentCode"
        );


    const fecha =
        obtenerValor(
            "shipmentDate"
        );


    const operationType =
        obtenerValor(
            "operationType"
        );


    const transportMode =
        obtenerValor(
            "transportMode"
        );


    const packageQuantity =
        Number(
            obtenerValor(
                "packageQuantity"
            )
        ) || 0;


    let packageType =
        obtenerValor(
            "packageType"
        );


    if (
        packageType === "Otro"
    ) {

        packageType =
            obtenerValor(
                "otherPackageType"
            ).trim();

    }


    let packageCategory =
        obtenerValor(
            "packageCategory"
        );


    if (
        packageCategory === "Otro"
    ) {

        packageCategory =
            obtenerValor(
                "otherCategory"
            ).trim();

    }


    const description =
        obtenerValor(
            "packageDescription"
        ).trim();


    const weight =
        Number(
            obtenerValor(
                "weight"
            )
        ) || 0;


    const declaredValue =
        Number(
            obtenerValor(
                "declaredValue"
            )
        ) || 0;


    const currency =
        obtenerValor(
            "currency"
        );


    const dimensionUnit =
        obtenerValor(
            "dimensionUnit"
        );


    const length =
        Number(
            obtenerValor(
                "packageLength"
            )
        ) || 0;


    const width =
        Number(
            obtenerValor(
                "packageWidth"
            )
        ) || 0;


    const height =
        Number(
            obtenerValor(
                "packageHeight"
            )
        ) || 0;


    const cubicFeet =
        Number(
            obtenerValor(
                "cubicFeet"
            )
        ) || 0;


    const clientName =
        obtenerValor(
            "clientName"
        ).trim();


    const clientPhone =
        obtenerValor(
            "clientPhone"
        ).trim();


    const clientEmail =
        obtenerValor(
            "clientEmail"
        ).trim();


    const clientDocument =
        obtenerValor(
            "clientDocument"
        ).trim();


    const clientAddress =
        obtenerValor(
            "clientAddress"
        ).trim();


    const origin =
        obtenerValor(
            "origin"
        ).trim();


    const destination =
        obtenerValor(
            "destination"
        ).trim();


    const senderName =
        obtenerValor(
            "senderName"
        ).trim();


    const recipientName =
        obtenerValor(
            "recipientName"
        ).trim();


    const deliveryAddress =
        obtenerValor(
            "deliveryAddress"
        ).trim();


    const specialHandling =
        obtenerValor(
            "specialHandling"
        );


    const insurance =
        obtenerValor(
            "insurance"
        );


    const notes =
        obtenerValor(
            "notes"
        ).trim();


    const nuevoEnvio = {

        id:
            Date.now(),


        codigo,

        fecha,

        operationType,

        transportMode,

        packageQuantity,

        packageType,

        packageCategory,

        description,

        weight,

        declaredValue,

        currency,


        dimensions: {

            unit:
                dimensionUnit,

            length,

            width,

            height,

            cubicFeet

        },


        cliente: {

            nombre:
                clientName,

            telefono:
                clientPhone,

            email:
                clientEmail,

            documento:
                clientDocument,

            direccion:
                clientAddress

        },


        ruta: {

            origen:
                origin,

            destino:
                destination,

            remitente:
                senderName,

            destinatario:
                recipientName,

            direccionEntrega:
                deliveryAddress

        },


        specialHandling,

        insurance,

        notes,


        estado:
            "pendiente",


        estadoLabel:
            estados.pendiente,


        history: [

            {

                estado:
                    "pendiente",

                label:
                    estados.pendiente,

                fecha:
                    new Date()
                        .toISOString(),

                descripcion:
                    "Envío registrado correctamente."

            }

        ]

    };


    envios.push(
        nuevoEnvio
    );


    actualizarClientes();

    guardarDatos();


    mostrarNotificacion(
        "Envío registrado correctamente."
    );


    formatearFormularioDespuesDeRegistro();


    renderizarTodo();


    cambiarSeccion(
        "envios"
    );

}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function formatearFormularioDespuesDeRegistro() {

    const form =
        document.getElementById(
            "shipmentForm"
        );


    if (!form) {
        return;
    }


    form.reset();


    setTimeout(
        () => {

            prepararFormulario();

            controlarTipoPaquete();

            controlarCategoria();

            calcularVolumen();

        },
        50
    );

}


/* =========================================================
   CLIENTES
========================================================= */

function actualizarClientes() {

    const mapaClientes = {};


    envios.forEach(
        envio => {

            if (!envio.cliente) {
                return;
            }


            const nombre =
                envio.cliente.nombre;


            if (!nombre) {
                return;
            }


            const key = (
                envio.cliente.telefono ||
                nombre
            )
                .toLowerCase()
                .trim();


            if (
                !mapaClientes[key]
            ) {

                mapaClientes[key] = {

                    nombre,

                    telefono:
                        envio.cliente.telefono ||
                        "",

                    email:
                        envio.cliente.email ||
                        "",

                    documento:
                        envio.cliente.documento ||
                        "",

                    direccion:
                        envio.cliente.direccion ||
                        "",

                    total:
                        0,

                    transito:
                        0,

                    entregados:
                        0

                };

            }


            mapaClientes[key].total++;


            if (
                envio.estado ===
                    "transito" ||

                envio.estado ===
                    "aduana"
            ) {

                mapaClientes[key].transito++;

            }


            if (
                envio.estado ===
                "entregado"
            ) {

                mapaClientes[key].entregados++;

            }

        }
    );


    clientes =
        Object.values(
            mapaClientes
        );

}


/* =========================================================
   RENDERIZAR TODO
========================================================= */

function renderizarTodo() {

    actualizarClientes();

    renderizarDashboard();

    renderizarEnvios();

    renderizarUltimosEnvios();

    renderizarClientes();

    renderizarReportes();

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderizarDashboard() {

    const total =
        envios.length;


    const transito =
        envios.filter(
            e =>
                e.estado ===
                "transito"
        ).length;


    const aduana =
        envios.filter(
            e =>
                e.estado ===
                "aduana"
        ).length;


    const entregados =
        envios.filter(
            e =>
                e.estado ===
                "entregado"
        ).length;


    establecerTexto(
        "totalEnvios",
        total
    );


    establecerTexto(
        "enviosTransito",
        transito
    );


    establecerTexto(
        "enviosAduana",
        aduana
    );


    establecerTexto(
        "enviosEntregados",
        entregados
    );

}


/* =========================================================
   TABLA DE ENVÍOS
========================================================= */

function renderizarEnvios() {

    const tbody =
        document.getElementById(
            "shipmentsTable"
        );


    if (!tbody) {
        return;
    }


    const search = (
        document.getElementById(
            "shipmentSearch"
        )?.value || ""
    )
        .toLowerCase()
        .trim();


    const filtroEstado =
        document.getElementById(
            "statusFilter"
        )?.value ||
        "todos";


    let lista =
        [...envios];


    if (search) {

        lista =
            lista.filter(
                envio => {

                    const valores = [

                        envio.codigo,

                        envio.cliente?.nombre,

                        envio.cliente?.telefono,

                        envio.operationType,

                        envio.transportMode,

                        envio.packageType,

                        envio.packageCategory,

                        envio.ruta?.origen,

                        envio.ruta?.destino

                    ];


                    return valores.some(
                        valor =>
                            String(
                                valor || ""
                            )
                                .toLowerCase()
                                .includes(
                                    search
                                )
                    );

                }
            );

    }


    if (
        filtroEstado !==
        "todos"
    ) {

        lista =
            lista.filter(
                envio =>
                    envio.estado ===
                    filtroEstado
            );

    }


    tbody.innerHTML =
        "";


    if (!lista.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="10">

                    <div class="empty-state">

                        <div class="empty-icon">
                            <i class="fa-solid fa-box-open"></i>
                        </div>

                        <h3>
                            No hay envíos
                        </h3>

                        <p>
                            No se encontraron registros.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        envio => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>

                    <strong>
                        ${escaparHTML(
                            envio.codigo
                        )}
                    </strong>

                </td>


                <td>

                    ${escaparHTML(
                        envio.cliente?.nombre ||
                        "—"
                    )}

                </td>


                <td>

                    <strong>

                        ${escaparHTML(
                            envio.operationType ||
                            "—"
                        )}

                    </strong>


                    <small class="table-subtext">

                        ${escaparHTML(
                            envio.ruta?.origen ||
                            "—"
                        )}

                        →

                        ${escaparHTML(
                            envio.ruta?.destino ||
                            "—"
                        )}

                    </small>

                </td>


                <td>

                    ${escaparHTML(
                        envio.transportMode ||
                        "—"
                    )}

                </td>


                <td>

                    <strong>
                        ${envio.packageQuantity || 0}
                    </strong>


                    <small class="table-subtext">

                        ${escaparHTML(
                            envio.packageType ||
                            "—"
                        )}

                    </small>

                </td>


                <td>

                    ${formatearPeso(
                        envio.weight
                    )}

                </td>


                <td>

                    ${
                        envio.dimensions?.cubicFeet
                            ? `${envio.dimensions.cubicFeet} pie³`
                            : "—"
                    }

                </td>


                <td>

                    <span
                        class="status status-${escaparHTML(
                            envio.estado
                        )}">

                        ${escaparHTML(
                            envio.estadoLabel ||
                            estados[envio.estado] ||
                            envio.estado
                        )}

                    </span>

                </td>


                <td>

                    ${formatearFecha(
                        envio.fecha
                    )}

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="table-action"
                            title="Ver detalle"
                            onclick="verDetalleEnvio(${Number(
                                envio.id
                            )})">

                            <i class="fa-solid fa-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="table-action"
                            title="Cambiar estado"
                            onclick="cambiarEstadoEnvio(${Number(
                                envio.id
                            )})">

                            <i class="fa-solid fa-rotate"></i>

                        </button>


                        <button
                            type="button"
                            class="table-action danger"
                            title="Eliminar"
                            onclick="eliminarEnvio(${Number(
                                envio.id
                            )})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }
    );

}


/* =========================================================
   ÚLTIMOS ENVÍOS
========================================================= */

function renderizarUltimosEnvios() {

    const tbody =
        document.getElementById(
            "recentShipments"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML =
        "";


    const recientes =
        [...envios]
            .sort(
                (a, b) =>
                    new Date(
                        b.fecha
                    ) -
                    new Date(
                        a.fecha
                    )
            )
            .slice(
                0,
                5
            );


    if (!recientes.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    <div class="empty-state">

                        <div class="empty-icon">
                            <i class="fa-solid fa-box-open"></i>
                        </div>

                        <h3>
                            No hay envíos registrados
                        </h3>

                        <p>
                            Los nuevos envíos aparecerán aquí.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    recientes.forEach(
        envio => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>

                    <strong>
                        ${escaparHTML(
                            envio.codigo
                        )}
                    </strong>

                </td>


                <td>

                    ${escaparHTML(
                        envio.cliente?.nombre ||
                        "—"
                    )}

                </td>


                <td>

                    ${escaparHTML(
                        envio.ruta?.origen ||
                        "—"
                    )}

                </td>


                <td>

                    ${escaparHTML(
                        envio.ruta?.destino ||
                        "—"
                    )}

                </td>


                <td>

                    ${escaparHTML(
                        envio.operationType ||
                        "—"
                    )}

                </td>


                <td>

                    <span
                        class="status status-${escaparHTML(
                            envio.estado
                        )}">

                        ${escaparHTML(
                            envio.estadoLabel ||
                            estados[envio.estado] ||
                            envio.estado
                        )}

                    </span>

                </td>


                <td>

                    ${formatearFecha(
                        envio.fecha
                    )}

                </td>


                <td>

                    <button
                        type="button"
                        class="table-action"
                        onclick="verDetalleEnvio(${Number(
                            envio.id
                        )})"
                        title="Ver detalle">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }
    );

}


/* =========================================================
   CLIENTES
========================================================= */

function renderizarClientes() {

    const tbody =
        document.getElementById(
            "clientsTable"
        );


    if (!tbody) {
        return;
    }


    const search = (
        document.getElementById(
            "clientSearch"
        )?.value || ""
    )
        .toLowerCase()
        .trim();


    let lista =
        [...clientes];


    if (search) {

        lista =
            lista.filter(
                cliente => {

                    return (

                        cliente.nombre
                            ?.toLowerCase()
                            .includes(
                                search
                            )

                        ||

                        cliente.telefono
                            ?.toLowerCase()
                            .includes(
                                search
                            )

                    );

                }
            );

    }


    tbody.innerHTML =
        "";


    if (!lista.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-state">

                        <div class="empty-icon">

                            <i class="fa-solid fa-users"></i>

                        </div>

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


    lista.forEach(
        cliente => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>

                    <strong>
                        ${escaparHTML(
                            cliente.nombre
                        )}
                    </strong>

                </td>


                <td>

                    ${escaparHTML(
                        cliente.telefono ||
                        "—"
                    )}

                </td>


                <td>
                    ${cliente.total || 0}
                </td>


                <td>
                    ${cliente.transito || 0}
                </td>


                <td>
                    ${cliente.entregados || 0}
                </td>


                <td>

                    <button
                        type="button"
                        class="table-action"
                        title="Ver cliente"
                        onclick="verCliente('${escaparAtributo(
                            cliente.nombre
                        )}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }
    );

}


/* =========================================================
   BÚSQUEDAS
========================================================= */

function inicializarBusquedas() {

    const shipmentSearch =
        document.getElementById(
            "shipmentSearch"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const clientSearch =
        document.getElementById(
            "clientSearch"
        );


    if (shipmentSearch) {

        shipmentSearch.addEventListener(
            "input",
            renderizarEnvios
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderizarEnvios
        );

    }


    if (clientSearch) {

        clientSearch.addEventListener(
            "input",
            renderizarClientes
        );

    }

}


/* =========================================================
   SEGUIMIENTO
========================================================= */

function inicializarSeguimiento() {

    const button =
        document.getElementById(
            "trackingButton"
        );


    const input =
        document.getElementById(
            "trackingCode"
        );


    if (button) {

        button.addEventListener(
            "click",
            consultarSeguimiento
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    consultarSeguimiento();

                }

            }
        );

    }

}


/* =========================================================
   CONSULTAR SEGUIMIENTO
========================================================= */

function consultarSeguimiento() {

    const input =
        document.getElementById(
            "trackingCode"
        );


    const codigo =
        input?.value
            .trim()
            .toUpperCase();


    const resultado =
        document.getElementById(
            "trackingResult"
        );


    const empty =
        document.getElementById(
            "trackingEmpty"
        );


    if (!codigo) {

        mostrarNotificacion(
            "Ingresa un código de seguimiento."
        );

        return;

    }


    const envio =
        envios.find(
            e =>
                e.codigo
                    ?.toUpperCase() ===
                codigo
        );


    if (!envio) {

        if (resultado) {

            resultado.style.display =
                "none";

        }


        if (empty) {

            empty.style.display =
                "block";


            empty.innerHTML = `

                <div class="empty-icon">

                    <i class="fa-solid fa-circle-exclamation"></i>

                </div>

                <h3>
                    Envío no encontrado
                </h3>

                <p>
                    No existe un envío registrado con ese código.
                </p>

            `;

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    if (resultado) {

        resultado.style.display =
            "block";

    }


    establecerTexto(
        "trackingResultTitle",
        envio.codigo
    );


    establecerTexto(
        "trackingResultClient",
        envio.cliente?.nombre ||
        "—"
    );


    const status =
        document.getElementById(
            "trackingResultStatus"
        );


    if (status) {

        status.textContent =
            envio.estadoLabel ||
            estados[envio.estado] ||
            envio.estado;


        status.className =
            `status status-${envio.estado}`;

    }


    establecerTexto(
        "trackingType",
        envio.operationType ||
        "—"
    );


    establecerTexto(
        "trackingOrigin",
        envio.ruta?.origen ||
        "—"
    );


    establecerTexto(
        "trackingDestination",
        envio.ruta?.destino ||
        "—"
    );


    establecerTexto(
        "trackingWeight",
        formatearPeso(
            envio.weight
        )
    );


    renderizarTimeline(
        envio,
        "trackingTimeline"
    );

}


/* =========================================================
   TIMELINE
========================================================= */

function renderizarTimeline(
    envio,
    elementoId
) {

    const timeline =
        document.getElementById(
            elementoId
        );


    if (!timeline) {
        return;
    }


    timeline.innerHTML =
        "";


    const history =
        Array.isArray(
            envio.history
        )
            ? envio.history
            : [];


    if (!history.length) {

        timeline.innerHTML = `

            <div class="empty-state">

                <p>
                    No hay historial disponible.
                </p>

            </div>

        `;

        return;

    }


    history.forEach(
        (item, index) => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "timeline-item";


            if (
                index ===
                history.length - 1
            ) {

                elemento.classList.add(
                    "active"
                );

            }


            elemento.innerHTML = `

                <div class="timeline-dot"></div>

                <div class="timeline-content">

                    <strong>

                        ${escaparHTML(
                            item.label ||
                            estados[item.estado] ||
                            item.estado ||
                            "—"
                        )}

                    </strong>

                    <span>

                        ${formatearFechaHora(
                            item.fecha
                        )}

                    </span>

                    <p>

                        ${escaparHTML(
                            item.descripcion ||
                            ""
                        )}

                    </p>

                </div>

            `;


            timeline.appendChild(
                elemento
            );

        }
    );

}


/* =========================================================
   CAMBIAR ESTADO
========================================================= */

function cambiarEstadoEnvio(
    id
) {

    const envio =
        envios.find(
            e =>
                String(e.id) ===
                String(id)
        );


    if (!envio) {
        return;
    }


    const nuevoEstado =
        prompt(

            "Estado nuevo:\n\n" +

            "pendiente\n" +

            "transito\n" +

            "aduana\n" +

            "entregado",

            envio.estado

        );


    if (!nuevoEstado) {
        return;
    }


    const estado =
        nuevoEstado
            .toLowerCase()
            .trim();


    if (!estados[estado]) {

        mostrarNotificacion(
            "Estado no válido."
        );

        return;

    }


    if (
        estado ===
        envio.estado
    ) {

        mostrarNotificacion(
            "El envío ya tiene ese estado."
        );

        return;

    }


    envio.estado =
        estado;


    envio.estadoLabel =
        estados[estado];


    if (
        !Array.isArray(
            envio.history
        )
    ) {

        envio.history =
            [];

    }


    envio.history.push({

        estado,

        label:
            estados[estado],

        fecha:
            new Date()
                .toISOString(),

        descripcion:
            `El estado cambió a ${estados[estado]}.`

    });


    actualizarClientes();

    guardarDatos();

    renderizarTodo();


    if (
        currentShipment &&
        String(
            currentShipment.id
        ) ===
        String(id)
    ) {

        verDetalleEnvio(
            id
        );

    }


    mostrarNotificacion(
        "Estado actualizado."
    );

}


/* =========================================================
   MODAL
========================================================= */

function inicializarModal() {

    const close =
        document.getElementById(
            "closeModal"
        );


    const closeButton =
        document.getElementById(
            "closeModalButton"
        );


    const modal =
        document.getElementById(
            "shipmentModal"
        );


    if (close) {

        close.addEventListener(
            "click",
            cerrarModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            cerrarModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    cerrarModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                cerrarModal();

            }

        }
    );

}


/* =========================================================
   VER DETALLE
========================================================= */

function verDetalleEnvio(id) {

    const envio =
        envios.find(
            e => String(e.id) === String(id)
        );


    if (!envio) {

        console.warn(
            "No se encontró el envío:",
            id
        );

        return;

    }


    currentShipment = envio;


    /* =====================================================
       INFORMACIÓN GENERAL
    ===================================================== */

    establecerTexto(
        "modalShipmentTitle",
        envio.codigo || "—"
    );


    establecerTexto(
        "modalClient",
        envio.cliente?.nombre || "—"
    );


    establecerTexto(
        "modalOrigin",
        envio.ruta?.origen || "—"
    );


    establecerTexto(
        "modalDestination",
        envio.ruta?.destino || "—"
    );


    establecerTexto(
        "modalOperation",
        envio.operationType || "—"
    );


    establecerTexto(
        "modalTransport",
        envio.transportMode || "—"
    );


    /* =====================================================
       PAQUETES
    ===================================================== */

    establecerTexto(
        "modalPackageQuantity",
        envio.packageQuantity || "0"
    );


    establecerTexto(
        "modalPackageType",
        envio.packageType || "—"
    );


    establecerTexto(
        "modalPackageCategory",
        envio.packageCategory || "—"
    );


    establecerTexto(
        "modalCategory",
        envio.packageCategory || "—"
    );


    establecerTexto(
        "modalDescription",
        envio.description || "—"
    );


    /* =====================================================
       PESO
    ===================================================== */

    establecerTexto(
        "modalWeight",
        formatearPeso(envio.weight)
    );


    /* =====================================================
       VOLUMEN / DIMENSIONES
    ===================================================== */

    const dimensiones =
        envio.dimensions || {};


    const unidad =
        dimensiones.unit || "—";


    const largo =
        dimensiones.length || 0;


    const ancho =
        dimensiones.width || 0;


    const alto =
        dimensiones.height || 0;


    const volumen =
        Number(dimensiones.cubicFeet) || 0;


    establecerTexto(
        "modalVolume",
        volumen > 0
            ? `${volumen.toFixed(2)} pie³`
            : "—"
    );


    establecerTexto(
        "modalCubicFeet",
        volumen > 0
            ? `${volumen.toFixed(2)} pie³`
            : "—"
    );


    establecerTexto(
        "modalDimensions",
        largo > 0 &&
        ancho > 0 &&
        alto > 0
            ? `${largo} × ${ancho} × ${alto} ${unidad}`
            : "—"
    );


    establecerTexto(
        "modalLength",
        largo > 0
            ? `${largo} ${unidad}`
            : "—"
    );


    establecerTexto(
        "modalWidth",
        ancho > 0
            ? `${ancho} ${unidad}`
            : "—"
    );


    establecerTexto(
        "modalHeight",
        alto > 0
            ? `${alto} ${unidad}`
            : "—"
    );


    /* =====================================================
       VALOR DECLARADO
    ===================================================== */

    establecerTexto(
        "modalDeclaredValue",
        envio.declaredValue > 0
            ? `${Number(envio.declaredValue).toFixed(2)} ${envio.currency || ""}`
            : "—"
    );


    /* =====================================================
       RUTA / PERSONAS
    ===================================================== */

    establecerTexto(
        "modalSender",
        envio.ruta?.remitente || "—"
    );


    establecerTexto(
        "modalRecipient",
        envio.ruta?.destinatario || "—"
    );


    establecerTexto(
        "modalDeliveryAddress",
        envio.ruta?.direccionEntrega || "—"
    );


    /* =====================================================
       CLIENTE
    ===================================================== */

    establecerTexto(
        "modalClientPhone",
        envio.cliente?.telefono || "—"
    );


    establecerTexto(
        "modalClientEmail",
        envio.cliente?.email || "—"
    );


    establecerTexto(
        "modalClientDocument",
        envio.cliente?.documento || "—"
    );


    establecerTexto(
        "modalClientAddress",
        envio.cliente?.direccion || "—"
    );


    /* =====================================================
       MANEJO / SEGURO / OBSERVACIONES
    ===================================================== */

    establecerTexto(
        "modalSpecialHandling",
        envio.specialHandling || "—"
    );


    establecerTexto(
        "modalInsurance",
        envio.insurance || "—"
    );


    establecerTexto(
        "modalNotes",
        envio.notes || "—"
    );


    /* =====================================================
       FECHA
    ===================================================== */

    establecerTexto(
        "modalDate",
        formatearFecha(envio.fecha)
    );


    /* =====================================================
       ESTADO
    ===================================================== */

    const modalStatus =
        document.getElementById(
            "modalStatus"
        );


    if (modalStatus) {

        modalStatus.textContent =
            envio.estadoLabel ||
            estados[envio.estado] ||
            "—";


        modalStatus.className =
            `status status-${envio.estado}`;

    }


    /* =====================================================
       MODAL
    ===================================================== */

    const modal =
        document.getElementById(
            "shipmentModal"
        );


    if (!modal) {

        console.warn(
            "No existe #shipmentModal en el HTML."
        );

        return;

    }


    modal.classList.add("active");


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /* =====================================================
       TIMELINE
    ===================================================== */

    const timeline =
        modal.querySelector(
            ".tracking-timeline"
        );


    if (timeline) {

        renderizarTimelineElemento(
            envio,
            timeline
        );

    }

}


/* =========================================================
   TIMELINE DEL MODAL
========================================================= */

function renderizarTimelineElemento(
    envio,
    timeline
) {

    if (!timeline) {
        return;
    }


    timeline.innerHTML =
        "";


    const history =
        Array.isArray(
            envio.history
        )
            ? envio.history
            : [];


    if (!history.length) {

        timeline.innerHTML = `

            <div class="empty-state">

                <p>
                    No hay historial disponible.
                </p>

            </div>

        `;

        return;

    }


    history.forEach(
        (item, index) => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "timeline-item";


            if (
                index ===
                history.length - 1
            ) {

                elemento.classList.add(
                    "active"
                );

            }


            elemento.innerHTML = `

                <div class="timeline-dot"></div>

                <div class="timeline-content">

                    <strong>

                        ${escaparHTML(
                            item.label ||
                            estados[item.estado] ||
                            item.estado ||
                            "—"
                        )}

                    </strong>


                    <span>

                        ${formatearFechaHora(
                            item.fecha
                        )}

                    </span>


                    <p>

                        ${escaparHTML(
                            item.descripcion ||
                            ""
                        )}

                    </p>

                </div>

            `;


            timeline.appendChild(
                elemento
            );

        }
    );

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModal() {

    const modal =
        document.getElementById(
            "shipmentModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    currentShipment =
        null;

}


/* =========================================================
   ELIMINAR ENVÍO
========================================================= */

function eliminarEnvio(
    id
) {

    const envio =
        envios.find(
            e =>
                String(e.id) ===
                String(id)
        );


    if (!envio) {
        return;
    }


    const confirmar =
        confirm(
            `¿Deseas eliminar el envío ${envio.codigo}?`
        );


    if (!confirmar) {
        return;
    }


    envios =
        envios.filter(
            e =>
                String(e.id) !==
                String(id)
        );


    actualizarClientes();

    guardarDatos();

    renderizarTodo();


    if (
        currentShipment &&
        String(
            currentShipment.id
        ) ===
        String(id)
    ) {

        cerrarModal();

    }


    mostrarNotificacion(
        "Envío eliminado."
    );

}


/* =========================================================
   VER CLIENTE
========================================================= */

function verCliente(
    nombre
) {

    const cliente =
        clientes.find(
            c =>
                c.nombre ===
                nombre
        );


    if (!cliente) {
        return;
    }


    alert(

        `CLIENTE\n\n` +

        `Nombre: ${
            cliente.nombre
        }\n` +

        `Teléfono: ${
            cliente.telefono ||
            "—"
        }\n` +

        `Correo: ${
            cliente.email ||
            "—"
        }\n` +

        `Documento: ${
            cliente.documento ||
            "—"
        }\n` +

        `Dirección: ${
            cliente.direccion ||
            "—"
        }\n\n` +

        `Total de envíos: ${
            cliente.total ||
            0
        }\n` +

        `En tránsito: ${
            cliente.transito ||
            0
        }\n` +

        `Entregados: ${
            cliente.entregados ||
            0
        }`

    );

}


/* =========================================================
   REPORTES
========================================================= */

function renderizarReportes() {

    const total =
        envios.length;


    const imports =
        envios.filter(
            e =>
                e.operationType ===
                "Importación"
        ).length;


    const exports =
        envios.filter(
            e =>
                e.operationType ===
                "Exportación"
        ).length;


    const pesoTotal =
        envios.reduce(
            (totalActual, envio) =>
                totalActual +
                (
                    Number(
                        envio.weight
                    ) || 0
                ),
            0
        );


    establecerTexto(
        "reportTotal",
        total
    );


    establecerTexto(
        "reportImports",
        imports
    );


    establecerTexto(
        "reportExports",
        exports
    );


    establecerTexto(
        "reportWeight",
        `${pesoTotal.toFixed(2)} lb`
    );


    const tbody =
        document.getElementById(
            "reportTable"
        );


    if (!tbody) {
        return;
    }


    const categorias = {};


    envios.forEach(
        envio => {

            const categoria =
                envio.packageCategory ||
                "Sin categoría";


            categorias[categoria] =
                (
                    categorias[categoria] ||
                    0
                ) + 1;

        }
    );


    tbody.innerHTML =
        "";


    if (!total) {

        tbody.innerHTML = `

            <tr>

                <td colspan="3">

                    No hay información disponible.

                </td>

            </tr>

        `;

        return;

    }


    Object.entries(
        categorias
    )
        .forEach(
            ([categoria, cantidad]) => {

                const porcentaje =
                    (
                        cantidad /
                        total *
                        100
                    ).toFixed(1);


                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${escaparHTML(
                            categoria
                        )}
                    </td>

                    <td>
                        ${cantidad}
                    </td>

                    <td>
                        ${porcentaje}%
                    </td>

                `;


                tbody.appendChild(
                    tr
                );

            }
        );

}


/* =========================================================
   EXPORTAR CSV
========================================================= */

document.addEventListener(
    "click",
    event => {

        const boton =
            event.target.closest(
                "#exportReportButton"
            );


        if (boton) {

            exportarCSV();

        }

    }
);


function exportarCSV() {

    if (!envios.length) {

        mostrarNotificacion(
            "No hay envíos para exportar."
        );

        return;

    }


    const encabezados = [

        "Código",
        "Fecha",
        "Operación",
        "Transporte",
        "Cliente",
        "Teléfono",
        "Correo",
        "Documento",
        "Dirección cliente",
        "Origen",
        "Destino",
        "Remitente",
        "Destinatario",
        "Dirección de entrega",
        "Paquetes",
        "Tipo de paquete",
        "Categoría",
        "Descripción",
        "Peso",
        "Unidad dimensiones",
        "Largo",
        "Ancho",
        "Alto",
        "Volumen",
        "Valor declarado",
        "Moneda",
        "Estado",
        "Manejo especial",
        "Seguro",
        "Observaciones"

    ];


    const filas =
        envios.map(
            envio => [

                envio.codigo,

                envio.fecha,

                envio.operationType,

                envio.transportMode,

                envio.cliente?.nombre,

                envio.cliente?.telefono,

                envio.cliente?.email,

                envio.cliente?.documento,

                envio.cliente?.direccion,

                envio.ruta?.origen,

                envio.ruta?.destino,

                envio.ruta?.remitente,

                envio.ruta?.destinatario,

                envio.ruta?.direccionEntrega,

                envio.packageQuantity,

                envio.packageType,

                envio.packageCategory,

                envio.description,

                envio.weight,

                envio.dimensions?.unit,

                envio.dimensions?.length,

                envio.dimensions?.width,

                envio.dimensions?.height,

                envio.dimensions?.cubicFeet,

                envio.declaredValue,

                envio.currency,

                envio.estadoLabel,

                envio.specialHandling,

                envio.insurance,

                envio.notes

            ]
        );


    const csv = [

        encabezados,

        ...filas

    ]
        .map(
            fila =>
                fila
                    .map(
                        valor =>
                            `"${String(
                                valor ?? ""
                            ).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
        )
        .join("\n");


    const blob =
        new Blob(
            [
                "\ufeff" +
                csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `envios-ya-reporte-${
            new Date()
                .toISOString()
                .split("T")[0]
        }.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   CONFIGURACIÓN
========================================================= */

function inicializarConfiguracion() {

    const button =
        document.getElementById(
            "saveSettingsButton"
        );


    cargarConfiguracion();


    if (button) {

        button.addEventListener(
            "click",
            guardarConfiguracion
        );

    }

}


function cargarConfiguracion() {

    try {

        const data =
            localStorage.getItem(
                SETTINGS_KEY
            );


        if (!data) {
            return;
        }


        const settings =
            JSON.parse(
                data
            );


        const campos = [

            "companyName",
            "companyPhone",
            "companyEmail",
            "companyAddress",
            "defaultOperation",
            "timezone"

        ];


        campos.forEach(
            id => {

                const elemento =
                    document.getElementById(
                        id
                    );


                if (
                    elemento &&
                    settings[id] !==
                    undefined
                ) {

                    elemento.value =
                        settings[id];

                }

            }
        );

    } catch (error) {

        console.error(
            "Error cargando configuración:",
            error
        );

    }

}


function guardarConfiguracion() {

    const campos = [

        "companyName",
        "companyPhone",
        "companyEmail",
        "companyAddress",
        "defaultOperation",
        "timezone"

    ];


    const settings = {};


    campos.forEach(
        id => {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                settings[id] =
                    elemento.value;

            }

        }
    );


    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );


    mostrarNotificacion(
        "Configuración guardada correctamente."
    );

}


/* =========================================================
   NUEVO CLIENTE
========================================================= */

function inicializarClientes() {

    const button =
        document.getElementById(
            "newClientButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            cambiarSeccion(
                "registrar"
            );


            setTimeout(
                () => {

                    const campo =
                        document.getElementById(
                            "clientName"
                        );


                    if (campo) {

                        campo.focus();

                    }

                },
                100
            );

        }
    );

}


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function inicializarMenuMovil() {

    const toggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (
        !toggle ||
        !sidebar
    ) {

        return;

    }


    toggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    document.querySelectorAll(
        ".nav-item"
    )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        sidebar.classList.remove(
                            "open"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   NOTIFICACIÓN
========================================================= */

function mostrarNotificacion(
    mensaje
) {

    let toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        toast.className =
            "toast";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        mensaje;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        mostrarNotificacion.timeout
    );


    mostrarNotificacion.timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   UTILIDADES
========================================================= */

function establecerTexto(id, texto) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        /*
            No mostramos error por cada campo
            porque algunos modales pueden no
            tener todos los campos.
        */

        return;

    }


    elemento.textContent =
        texto === undefined ||
        texto === null ||
        texto === ""
            ? "—"
            : texto;

}


/* =========================================================
   FORMATEAR NÚMERO
========================================================= */

function formatearNumero(
    valor
) {

    const numero =
        Number(valor);


    if (
        Number.isNaN(numero) ||
        numero <= 0
    ) {

        return "—";

    }


    return numero.toFixed(2);

}


/* =========================================================
   FORMATEAR VALOR DECLARADO
========================================================= */

function formatearValorDeclarado(
    valor,
    moneda
) {

    const numero =
        Number(valor);


    if (
        Number.isNaN(numero) ||
        numero <= 0
    ) {

        return "—";

    }


    return `${numero.toFixed(2)} ${
        moneda || ""
    }`.trim();

}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "—";
    }


    const date =
        new Date(fecha);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return fecha;

    }


    return date.toLocaleDateString(
        "es-NI"
    );

}


/* =========================================================
   FORMATEAR FECHA Y HORA
========================================================= */

function formatearFechaHora(
    fecha
) {

    if (!fecha) {
        return "—";
    }


    const date =
        new Date(fecha);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return fecha;

    }


    return date.toLocaleString(
        "es-NI",
        {

            dateStyle:
                "short",

            timeStyle:
                "short"

        }
    );

}


/* =========================================================
   FORMATEAR PESO
========================================================= */

function formatearPeso(
    peso
) {

    const numero =
        Number(peso);


    if (
        Number.isNaN(numero) ||
        numero <= 0
    ) {

        return "—";

    }


    return `${numero.toFixed(2)} lb`;

}


/* =========================================================
   SEGURIDAD HTML
========================================================= */

function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
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
   SEGURIDAD PARA ATRIBUTOS
========================================================= */

function escaparAtributo(
    valor
) {

    return String(
        valor ?? ""
    )

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /"/g,
            '\\"'
        )

        .replace(
            /\r?\n/g,
            "\\n"
        );

}


/* =========================================================
   EXPOSICIÓN DE FUNCIONES
========================================================= */

window.verDetalleEnvio =
    verDetalleEnvio;


window.cambiarEstadoEnvio =
    cambiarEstadoEnvio;


window.eliminarEnvio =
    eliminarEnvio;


window.verCliente =
    verCliente;


window.cerrarModal =
    cerrarModal;


window.cambiarSeccion =
    cambiarSeccion;