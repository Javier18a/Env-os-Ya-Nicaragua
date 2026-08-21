/* =========================================================
   CONFIGURACIÓN
========================================================= */

const PAGE_PATH = "dashboard/page/";
const CSS_PATH = "dashboard/css/";

const pageStyles = {
    dashboard: "dashboard.css",
    styles: "styles.css",
    envios: "envios.css",
    registrar: "registrar.css",
    clientes: "clientes.css",
    seguimiento: "seguimiento.css",
    reportes: "reportes.css",
    facturacion: "facturacion.css",
    finanzas: "finanzas.css",
    usuarios: "usuarios.css",
    configuracion: "configuracion.css"
};

function loadPageStyles(pageName) {

    const styleId = "page-specific-style";

    // Eliminar el CSS específico de la página anterior
    const existingStyle = document.getElementById(styleId);

    if (existingStyle) {
        existingStyle.remove();
    }

    const cssFile = pageStyles[pageName];

    if (!cssFile) {
        return;
    }

    const link = document.createElement("link");

    link.id = styleId;
    link.rel = "stylesheet";
    link.href = `${CSS_PATH}${cssFile}`;

    document.head.appendChild(link);
}


/* =========================================================
   TÍTULOS DE LAS PÁGINAS
========================================================= */

const pageTitles = {

    dashboard: "Dashboard",

    envios: "Envíos",

    registrar: "Registrar envío",

    clientes: "Clientes",

    seguimiento: "Seguimiento",

    reportes: "Reportes",

    facturacion: "Facturación",

    finanzas: "Ingresos y gastos",

    usuarios: "Usuarios",

    configuracion: "Configuración"

};


/* =========================================================
   PÁGINA ACTUAL
========================================================= */

let currentPage = "dashboard";


/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

function getPageContainer() {

    return document.getElementById("page-container");

}


function getPageTitle() {

    return document.getElementById("pageTitle");

}


/* =========================================================
   CARGAR PÁGINA
========================================================= */

async function loadPage(pageName) {

    const pageContainer = getPageContainer();

    if (!pageContainer) {

        console.error(
            "No se encontró #page-container"
        );

        return;

    }


    /*
       Verificar que la página exista
       dentro de las páginas permitidas.
    */

    if (!pageTitles[pageName]) {

        console.error(
            `Página no válida: ${pageName}`
        );

        return;

    }


    try {

        const response = await fetch(
            `${PAGE_PATH}${pageName}.html`
        );


        if (!response.ok) {

            throw new Error(
                `No se pudo cargar ${pageName}.html`
            );

        }


        const html = await response.text();


        pageContainer.innerHTML = html;

        currentPage = pageName;

        updatePageTitle(pageName);
        updateActiveNavigation(pageName);
        loadPageStyles(pageName);


        /*
           Inicializar la lógica específica
           de la página.
        */

        initializePage(pageName);


    } catch (error) {

        console.error(
            `Error cargando la página "${pageName}":`,
            error
        );

        console.error(
            "Ruta que se intentó cargar:",
            `${PAGE_PATH}${pageName}.html`
        );

        pageContainer.innerHTML = `
        <section class="content-section active">

            <div class="section-header">

                <div>

                    <span class="section-label">
                        ERROR
                    </span>

                    <h3>
                        No se pudo cargar la página
                    </h3>

                    <p>
                        No fue posible cargar
                        "${pageName}".
                    </p>

                </div>

            </div>

        </section>
    `;

    }

}


/* =========================================================
   ACTUALIZAR TÍTULO
========================================================= */

function updatePageTitle(pageName) {

    const titleElement = getPageTitle();

    if (!titleElement) {

        return;

    }


    titleElement.textContent =
        pageTitles[pageName] || "Dashboard";

}


/* =========================================================
   ACTUALIZAR NAVEGACIÓN ACTIVA
========================================================= */

function updateActiveNavigation(pageName) {

    const navItems =
        document.querySelectorAll(
            ".nav-item[data-section]"
        );


    navItems.forEach(item => {

        const section =
            item.dataset.section;


        item.classList.toggle(
            "active",
            section === pageName
        );

    });

}


/* =========================================================
   EVENTOS DE NAVEGACIÓN
========================================================= */

function initializeNavigation() {

    document.addEventListener(
        "click",
        handleNavigationClick
    );

}


/* =========================================================
   MANEJAR CLICK
========================================================= */

function handleNavigationClick(event) {

    const navigationElement =
        event.target.closest(
            "[data-section]"
        );


    if (!navigationElement) {

        return;

    }


    const pageName =
        navigationElement.dataset.section;


    if (!pageName) {

        return;

    }


    event.preventDefault();


    loadPage(pageName);

}


/* =========================================================
   INICIALIZAR PÁGINA
========================================================= */

/* =========================================================
   INICIALIZAR PÁGINA
========================================================= */

function initializePage(pageName) {

    switch (pageName) {

        case "dashboard":

            if (
                typeof initializeDashboard ===
                "function"
            ) {

                initializeDashboard();

            }

            break;


        case "envios":

            if (
                typeof initializeEnvios ===
                "function"
            ) {

                initializeEnvios();

            }

            break;


        case "registrar":

            if (
                typeof initializeRegistrar ===
                "function"
            ) {

                initializeRegistrar();

            }

            break;


        case "clientes":

            if (
                typeof initializeClientes ===
                "function"
            ) {

                initializeClientes();

            }

            break;


        case "seguimiento":

            if (
                typeof initializeSeguimiento ===
                "function"
            ) {

                initializeSeguimiento();

            }

            break;


        case "reportes":

            if (
                typeof initializeReportes ===
                "function"
            ) {

                initializeReportes();

            }

            break;


        case "facturacion":

            if (
                typeof initializeFacturacion ===
                "function"
            ) {

                initializeFacturacion();

            }

            break;


        case "finanzas":

            if (
                typeof initializeFinanzas ===
                "function"
            ) {

                initializeFinanzas();

            }

            break;


        case "usuarios":

            if (
                typeof initializeUsuarios ===
                "function"
            ) {

                initializeUsuarios();

            }

            break;


        case "configuracion":

            if (
                typeof initializeConfiguracion ===
                "function"
            ) {

                initializeConfiguracion();

            }

            break;


        default:

            console.warn(
                `No existe módulo para: ${pageName}`
            );

    }

}


/* =========================================================
   PÁGINA ACTUAL
========================================================= */

function getCurrentPage() {

    return currentPage;

}