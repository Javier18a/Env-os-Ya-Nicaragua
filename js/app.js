const STORAGE_KEY = "envios_ya_envios";

const defaultShipments = [
    {
        id: "ENV-00128",
        client: "Carlos Martínez",
        phone: "+505 8888 0001",
        origin: "Miami, USA",
        destination: "Managua, Nicaragua",
        weight: 8.5,
        type: "Importación",
        status: "transito",
        statusLabel: "En tránsito",
        date: "2026-08-15",
        notes: "Paquete en traslado hacia Nicaragua.",
        history: [
            {
                title: "Envío recibido",
                description: "Paquete registrado",
                completed: true
            },
            {
                title: "Procesado",
                description: "Información verificada",
                completed: true
            },
            {
                title: "En tránsito",
                description: "En camino al destino",
                current: true
            },
            {
                title: "Entregado",
                description: "Pendiente"
            }
        ]
    },

    {
        id: "ENV-00127",
        client: "María López",
        phone: "+505 8888 0002",
        origin: "Miami, USA",
        destination: "Managua, Nicaragua",
        weight: 4.2,
        type: "Importación",
        status: "entregado",
        statusLabel: "Entregado",
        date: "2026-08-14",
        notes: "Entrega completada.",
        history: [
            {
                title: "Envío recibido",
                description: "Paquete registrado",
                completed: true
            },
            {
                title: "Procesado",
                description: "Información verificada",
                completed: true
            },
            {
                title: "En tránsito",
                description: "En camino al destino",
                completed: true
            },
            {
                title: "Entregado",
                description: "Entrega completada",
                completed: true
            }
        ]
    },

    {
        id: "ENV-00126",
        client: "José Rodríguez",
        phone: "+505 8888 0003",
        origin: "Panamá",
        destination: "Managua, Nicaragua",
        weight: 12.8,
        type: "Importación",
        status: "aduana",
        statusLabel: "En aduana",
        date: "2026-08-14",
        notes: "Pendiente de procesamiento aduanero.",
        history: [
            {
                title: "Envío recibido",
                description: "Paquete registrado",
                completed: true
            },
            {
                title: "Procesado",
                description: "Información verificada",
                completed: true
            },
            {
                title: "En aduana",
                description: "Pendiente de procesamiento",
                current: true
            },
            {
                title: "Entregado",
                description: "Pendiente"
            }
        ]
    },

    {
        id: "ENV-00125",
        client: "Ana García",
        phone: "+505 8888 0004",
        origin: "Miami, USA",
        destination: "Managua, Nicaragua",
        weight: 3.7,
        type: "Exportación",
        status: "pendiente",
        statusLabel: "Pendiente",
        date: "2026-08-13",
        notes: "Pendiente de recepción.",
        history: [
            {
                title: "Envío recibido",
                description: "Pendiente",
                current: true
            },
            {
                title: "Procesado",
                description: "Pendiente"
            },
            {
                title: "En tránsito",
                description: "Pendiente"
            },
            {
                title: "Entregado",
                description: "Pendiente"
            }
        ]
    }
];


let shipments = loadShipments();


const elements = {
    navItems: document.querySelectorAll(".nav-item"),
    contentSections: document.querySelectorAll(".content-section"),
    sectionButtons: document.querySelectorAll("[data-section]"),
    pageTitle: document.getElementById("pageTitle"),
    currentDate: document.getElementById("currentDate"),

    totalEnvios: document.getElementById("totalEnvios"),
    enviosTransito: document.getElementById("enviosTransito"),
    enviosAduana: document.getElementById("enviosAduana"),
    enviosEntregados: document.getElementById("enviosEntregados"),

    shipmentsTable: document.getElementById("shipmentsTable"),
    recentShipments: document.getElementById("recentShipments"),

    shipmentSearch: document.getElementById("shipmentSearch"),
    statusFilter: document.getElementById("statusFilter"),

    shipmentForm: document.getElementById("shipmentForm"),

    menuToggle: document.getElementById("menuToggle"),
    sidebar: document.querySelector(".sidebar"),

    shipmentModal: document.getElementById("shipmentModal"),
    closeModal: document.getElementById("closeModal"),
    closeModalButton: document.getElementById("closeModalButton"),

    modalShipmentTitle: document.getElementById("modalShipmentTitle"),
    modalClient: document.getElementById("modalClient"),
    modalStatus: document.getElementById("modalStatus"),
    modalOrigin: document.getElementById("modalOrigin"),
    modalDestination: document.getElementById("modalDestination")
};


const pageTitles = {
    dashboard: "Dashboard",
    envios: "Envíos",
    registrar: "Registrar envío",
    clientes: "Clientes",
    reportes: "Reportes",
    configuracion: "Configuración"
};


document.addEventListener("DOMContentLoaded", () => {

    initializeDate();

    initializeFormDate();

    renderDashboard();

    renderShipments();

    renderRecentShipments();

    setupNavigation();

    setupSearch();

    setupForm();

    setupModal();

    setupMobileMenu();

});


function loadShipments() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {

        const initialData = [...defaultShipments];

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialData)
        );

        return initialData;
    }

    try {

        const parsedData = JSON.parse(savedData);

        if (Array.isArray(parsedData)) {
            return parsedData;
        }

        return [...defaultShipments];

    } catch (error) {

        console.error(
            "No se pudieron cargar los envíos:",
            error
        );

        return [...defaultShipments];
    }
}


function saveShipments() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(shipments)
    );
}


function initializeDate() {

    if (!elements.currentDate) {
        return;
    }

    const today = new Date();

    const formatter = new Intl.DateTimeFormat(
        "es-NI",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    elements.currentDate.textContent = formatter.format(today);
}


function initializeFormDate() {

    const dateInput = document.getElementById(
        "shipmentDate"
    );

    if (!dateInput) {
        return;
    }

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;
}


function setupNavigation() {

    elements.sectionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const sectionId =
                button.dataset.section;

            if (!sectionId) {
                return;
            }

            showSection(sectionId);

        });

    });

}


function showSection(sectionId) {

    elements.contentSections.forEach(section => {

        section.classList.remove("active");

    });


    const targetSection =
        document.getElementById(sectionId);


    if (!targetSection) {
        return;
    }


    targetSection.classList.add("active");


    elements.navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionId
        );

    });


    if (elements.pageTitle) {

        elements.pageTitle.textContent =
            pageTitles[sectionId] ||
            "Envíos Ya";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (elements.sidebar) {
        elements.sidebar.classList.remove("open");
    }


    if (sectionId === "envios") {

        renderShipments();

    }


    if (sectionId === "dashboard") {

        renderDashboard();

        renderRecentShipments();

    }

}


function setupSearch() {

    if (elements.shipmentSearch) {

        elements.shipmentSearch.addEventListener(
            "input",
            renderShipments
        );

    }


    if (elements.statusFilter) {

        elements.statusFilter.addEventListener(
            "change",
            renderShipments
        );

    }

}


function renderDashboard() {

    const total =
        shipments.length;


    const transito =
        shipments.filter(
            shipment =>
                shipment.status === "transito"
        ).length;


    const aduana =
        shipments.filter(
            shipment =>
                shipment.status === "aduana"
        ).length;


    const entregados =
        shipments.filter(
            shipment =>
                shipment.status === "entregado"
        ).length;


    if (elements.totalEnvios) {

        elements.totalEnvios.textContent =
            total;

    }


    if (elements.enviosTransito) {

        elements.enviosTransito.textContent =
            transito;

    }


    if (elements.enviosAduana) {

        elements.enviosAduana.textContent =
            aduana;

    }


    if (elements.enviosEntregados) {

        elements.enviosEntregados.textContent =
            entregados;

    }

}


function renderRecentShipments() {

    if (!elements.recentShipments) {
        return;
    }


    const recent =
        [...shipments]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 5);


    elements.recentShipments.innerHTML =
        recent.map(
            shipment =>
                createRecentShipmentRow(shipment)
        ).join("");


    attachShipmentButtons(
        elements.recentShipments
    );

}


function createRecentShipmentRow(shipment) {

    return `
        <tr>

            <td>
                <strong>
                    ${escapeHTML(shipment.id)}
                </strong>
            </td>

            <td>
                ${escapeHTML(shipment.client)}
            </td>

            <td>
                ${escapeHTML(shipment.origin)}
            </td>

            <td>
                ${escapeHTML(shipment.destination)}
            </td>

            <td>
                ${escapeHTML(shipment.type)}
            </td>

            <td>
                ${createStatusBadge(shipment)}
            </td>

            <td>
                ${formatDate(shipment.date)}
            </td>

            <td>

                <button
                    class="table-action"
                    data-shipment="${escapeHTML(shipment.id)}">

                    Ver

                </button>

            </td>

        </tr>
    `;
}


function renderShipments() {

    if (!elements.shipmentsTable) {
        return;
    }


    const search =
        elements.shipmentSearch
            ? elements.shipmentSearch.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        elements.statusFilter
            ? elements.statusFilter.value
            : "todos";


    const filtered =
        shipments.filter(shipment => {

            const matchesSearch =
                !search ||
                shipment.id
                    .toLowerCase()
                    .includes(search) ||
                shipment.client
                    .toLowerCase()
                    .includes(search) ||
                shipment.origin
                    .toLowerCase()
                    .includes(search) ||
                shipment.destination
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                status === "todos" ||
                shipment.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    if (filtered.length === 0) {

        elements.shipmentsTable.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    style="text-align:center;padding:40px;">

                    No se encontraron envíos.

                </td>

            </tr>
        `;

        return;
    }


    elements.shipmentsTable.innerHTML =
        filtered
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .map(
                shipment =>
                    createShipmentRow(shipment)
            )
            .join("");


    attachShipmentButtons(
        elements.shipmentsTable
    );

}


function createShipmentRow(shipment) {

    return `
        <tr>

            <td>
                <strong>
                    ${escapeHTML(shipment.id)}
                </strong>
            </td>

            <td>
                ${escapeHTML(shipment.client)}
            </td>

            <td>
                ${escapeHTML(shipment.origin)}
            </td>

            <td>
                ${escapeHTML(shipment.destination)}
            </td>

            <td>
                ${Number(shipment.weight).toFixed(2)} kg
            </td>

            <td>
                ${createStatusBadge(shipment)}
            </td>

            <td>
                ${formatDate(shipment.date)}
            </td>

            <td>

                <button
                    class="table-action"
                    data-shipment="${escapeHTML(shipment.id)}">

                    Ver

                </button>

            </td>

        </tr>
    `;
}


function createStatusBadge(shipment) {

    const allowedClasses = [
        "pendiente",
        "recibido",
        "transito",
        "aduana",
        "entregado"
    ];


    const statusClass =
        allowedClasses.includes(shipment.status)
            ? shipment.status
            : "pendiente";


    return `
        <span class="status status-${statusClass}">
            ${escapeHTML(shipment.statusLabel)}
        </span>
    `;
}


function attachShipmentButtons(container) {

    const buttons =
        container.querySelectorAll(
            "[data-shipment]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const shipmentId =
                    button.dataset.shipment;

                openShipmentModal(
                    shipmentId
                );

            }
        );

    });

}


function setupForm() {

    if (!elements.shipmentForm) {
        return;
    }


    elements.shipmentForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            registerShipment();

        }
    );


    elements.shipmentForm.addEventListener(
        "reset",
        () => {

            setTimeout(
                initializeFormDate,
                0
            );

        }
    );

}


function registerShipment() {

    const code =
        document.getElementById(
            "shipmentCode"
        ).value
            .trim()
            .toUpperCase();


    const operationType =
        document.getElementById(
            "operationType"
        ).value;


    const origin =
        document.getElementById(
            "origin"
        ).value
            .trim();


    const destination =
        document.getElementById(
            "destination"
        ).value
            .trim();


    const weight =
        document.getElementById(
            "weight"
        ).value;


    const date =
        document.getElementById(
            "shipmentDate"
        ).value;


    const clientName =
        document.getElementById(
            "clientName"
        ).value
            .trim();


    const clientPhone =
        document.getElementById(
            "clientPhone"
        ).value
            .trim();


    const notes =
        document.getElementById(
            "notes"
        ).value
            .trim();


    if (!code || !clientName) {

        showNotification(
            "Completa los campos obligatorios.",
            "error"
        );

        return;
    }


    const existingShipment =
        shipments.some(
            shipment =>
                shipment.id.toLowerCase() ===
                code.toLowerCase()
        );


    if (existingShipment) {

        showNotification(
            "Ya existe un envío con ese código.",
            "error"
        );

        return;
    }


    const newShipment = {

        id: code,

        client: clientName,

        phone: clientPhone,

        origin,

        destination,

        weight: Number(weight),

        type: operationType,

        status: "pendiente",

        statusLabel: "Pendiente",

        date,

        notes,

        history: [
            {
                title: "Envío recibido",
                description: "Paquete registrado",
                current: true
            },
            {
                title: "Procesado",
                description: "Pendiente"
            },
            {
                title: "En tránsito",
                description: "Pendiente"
            },
            {
                title: "Entregado",
                description: "Pendiente"
            }
        ]

    };


    shipments.unshift(
        newShipment
    );


    saveShipments();

    renderDashboard();

    renderRecentShipments();

    renderShipments();


    elements.shipmentForm.reset();

    initializeFormDate();


    showNotification(
        `El envío ${code} fue registrado correctamente.`,
        "success"
    );


    setTimeout(
        () => showSection("envios"),
        500
    );

}


function openShipmentModal(shipmentId) {

    const shipment =
        shipments.find(
            item =>
                item.id === shipmentId
        );


    if (!shipment) {
        return;
    }


    if (elements.modalShipmentTitle) {

        elements.modalShipmentTitle.textContent =
            shipment.id;

    }


    if (elements.modalClient) {

        elements.modalClient.textContent =
            shipment.client;

    }


    if (elements.modalStatus) {

        elements.modalStatus.textContent =
            shipment.statusLabel;

    }


    if (elements.modalOrigin) {

        elements.modalOrigin.textContent =
            shipment.origin;

    }


    if (elements.modalDestination) {

        elements.modalDestination.textContent =
            shipment.destination;

    }


    renderTrackingHistory(
        shipment
    );


    elements.shipmentModal.classList.add(
        "active"
    );


    elements.shipmentModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function renderTrackingHistory(shipment) {

    const timeline =
        document.querySelector(
            ".tracking-timeline"
        );


    if (!timeline) {
        return;
    }


    const history =
        shipment.history ||
        createDefaultHistory(
            shipment.status
        );


    timeline.innerHTML =
        history.map(item => {

            let className =
                "timeline-item";


            if (item.completed) {
                className += " completed";
            }


            if (item.current) {
                className += " current";
            }


            const icon =
                item.completed
                    ? "✓"
                    : item.current
                        ? "●"
                        : "○";


            return `
                <div class="${className}">

                    <span class="timeline-dot">
                        ${icon}
                    </span>

                    <div>

                        <strong>
                            ${escapeHTML(item.title)}
                        </strong>

                        <small>
                            ${escapeHTML(item.description)}
                        </small>

                    </div>

                </div>
            `;

        }).join("");

}


function createDefaultHistory(status) {

    const states = [
        {
            key: "recibido",
            title: "Envío recibido",
            description: "Paquete registrado"
        },
        {
            key: "procesado",
            title: "Procesado",
            description: "Información verificada"
        },
        {
            key: "transito",
            title: "En tránsito",
            description: "En camino al destino"
        },
        {
            key: "entregado",
            title: "Entregado",
            description: "Entrega completada"
        }
    ];


    const statusOrder = {
        pendiente: 0,
        recibido: 1,
        procesado: 2,
        transito: 3,
        aduana: 3,
        entregado: 4
    };


    const currentOrder =
        statusOrder[status] ?? 0;


    return states.map(
        (state, index) => {

            return {

                title:
                    state.title,

                description:
                    index < currentOrder
                        ? state.description
                        : "Pendiente",

                completed:
                    index < currentOrder,

                current:
                    index === currentOrder

            };

        }
    );

}


function setupModal() {

    if (
        !elements.shipmentModal ||
        !elements.closeModal ||
        !elements.closeModalButton
    ) {
        return;
    }


    elements.closeModal.addEventListener(
        "click",
        closeShipmentModal
    );


    elements.closeModalButton.addEventListener(
        "click",
        closeShipmentModal
    );


    elements.shipmentModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                elements.shipmentModal
            ) {

                closeShipmentModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                elements.shipmentModal.classList.contains(
                    "active"
                )
            ) {

                closeShipmentModal();

            }

        }
    );

}


function closeShipmentModal() {

    elements.shipmentModal.classList.remove(
        "active"
    );


    elements.shipmentModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


function setupMobileMenu() {

    if (!elements.menuToggle) {
        return;
    }


    elements.menuToggle.addEventListener(
        "click",
        () => {

            elements.sidebar.classList.toggle(
                "open"
            );

        }
    );

}


function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return new Intl.DateTimeFormat(
        "es-NI",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    ).format(date);

}


function showNotification(message, type = "success") {

    const existing =
        document.querySelector(
            ".system-notification"
        );


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");


    notification.className =
        `system-notification ${type}`;


    notification.innerHTML = `

        <span class="notification-icon">
            ${type === "success" ? "✓" : "!"}
        </span>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    Object.assign(
        notification.style,
        {
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: "3000",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "13px 16px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            boxShadow: "0 12px 35px rgba(15, 23, 42, 0.15)",
            color: "#0f172a",
            fontSize: "12px",
            fontWeight: "600",
            animation: "sectionIn 0.2s ease"
        }
    );


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => {

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateY(5px)";

            notification.style.transition =
                "0.2s ease";


            setTimeout(
                () => notification.remove(),
                200
            );

        },
        3000
    );

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}