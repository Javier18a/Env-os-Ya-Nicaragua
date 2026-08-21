/* =========================================================
   ENVÍOS YA
   app.js

   Punto de entrada de la aplicación
========================================================= */


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Envíos Ya iniciando...");


    /*
       1. Cargar componentes
    */

    await cargarComponentes();


    /*
       2. Inicializar navegación
    */

    initializeNavigation();


    /*
       3. Cargar Dashboard
    */

    await loadPage("dashboard");


    /*
       4. Inicializar fecha
    */

    inicializarFecha();


    console.log("Envíos Ya iniciado correctamente.");

});


/* =========================================================
   CARGAR COMPONENTES
========================================================= */

async function cargarComponentes() {

    await cargarComponente(
        "sidebar-container",
        "dashboard/components/sidebar.html"
    );


    await cargarComponente(
        "topbar-container",
        "dashboard/components/topbar.html"
    );


    await cargarComponente(
        "modal-container",
        "dashboard/components/shipment-modal.html"
    );

}


/* =========================================================
   CARGAR COMPONENTE INDIVIDUAL
========================================================= */

async function cargarComponente(
    containerId,
    filePath
) {

    const container =
        document.getElementById(containerId);


    if (!container) {

        console.error(
            `No se encontró el contenedor: #${containerId}`
        );

        return;

    }


    try {

        const response =
            await fetch(filePath);


        if (!response.ok) {

            throw new Error(
                `No se pudo cargar: ${filePath}`
            );

        }


        const html =
            await response.text();


        container.innerHTML = html;


    } catch (error) {

        console.error(
            `Error cargando componente ${filePath}:`,
            error
        );

    }

}


/* =========================================================
   FECHA ACTUAL
========================================================= */

function inicializarFecha() {

    const currentDate =
        document.getElementById("currentDate");


    if (!currentDate) {

        return;

    }


    const fecha =
        new Date();


    currentDate.textContent =
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