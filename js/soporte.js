"use strict";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const SUPPORT_PHONE = "50557275727";

const categoryConfig = {
    seguimiento: {
        title: "Seguimiento de paquetes",
        icon: "fa-location-crosshairs",
        description: "Consulta el estado de tu paquete.",
        fields: [
            {
                name: "tracking",
                label: "Número de seguimiento o guía",
                placeholder: "Introduce tu número de guía",
                required: true
            },
            {
                name: "transport",
                label: "Modalidad de envío",
                type: "select",
                required: true,
                options: [
                    ["Aéreo", "Aéreo"],
                    ["Marítimo", "Marítimo"],
                    ["No estoy seguro", "No estoy seguro"]
                ]
            },
            {
                name: "lastStatus",
                label: "Último estado conocido",
                type: "select",
                required: true,
                options: [
                    ["En tránsito", "En tránsito"],
                    ["En bodega", "En bodega"],
                    ["En proceso de entrega", "En proceso de entrega"],
                    ["Entregado", "Entregado"],
                    ["No tengo información", "No tengo información"]
                ]
            },
            {
                name: "details",
                label: "Detalles de tu consulta",
                type: "textarea",
                placeholder: "¿Qué información necesitas conocer?",
                required: true
            }
        ]
    },

    problema: {
        title: "Problemas con un paquete",
        icon: "fa-box-open",
        description: "Cuéntanos qué inconveniente presenta tu paquete.",
        fields: [
            {
                name: "tracking",
                label: "Número de seguimiento o guía",
                placeholder: "Introduce tu número de guía",
                required: true
            },
            {
                name: "problemType",
                label: "Tipo de inconveniente",
                type: "select",
                required: true,
                options: [
                    ["Retraso", "Retraso"],
                    ["Paquete dañado", "Paquete dañado"],
                    ["Paquete incompleto", "Paquete incompleto"],
                    ["Paquete no localizado", "Paquete no localizado"],
                    ["Información incorrecta", "Información incorrecta"],
                    ["Otro inconveniente", "Otro inconveniente"]
                ]
            },
            {
                name: "incidentDate",
                label: "Fecha aproximada del inconveniente",
                type: "date",
                required: false
            },
            {
                name: "details",
                label: "Describe el problema",
                type: "textarea",
                placeholder: "Explica qué ocurrió y cualquier detalle relevante.",
                required: true
            }
        ]
    },

    reclamo: {
        title: "Reclamos y quejas",
        icon: "fa-comment-dots",
        description: "Registra los detalles de tu reclamo para su revisión.",
        fields: [
            {
                name: "tracking",
                label: "Número de seguimiento o guía",
                placeholder: "Si corresponde, introduce tu número de guía",
                required: false
            },
            {
                name: "claimType",
                label: "Motivo del reclamo",
                type: "select",
                required: true,
                options: [
                    ["Servicio recibido", "Servicio recibido"],
                    ["Retraso de envío", "Retraso de envío"],
                    ["Daño o faltante", "Daño o faltante"],
                    ["Atención recibida", "Atención recibida"],
                    ["Cobro o tarifa", "Cobro o tarifa"],
                    ["Otro motivo", "Otro motivo"]
                ]
            },
            {
                name: "details",
                label: "Descripción del reclamo",
                type: "textarea",
                placeholder: "Describe lo ocurrido e indica qué necesitas que revisemos.",
                required: true
            },
            {
                name: "resolution",
                label: "¿Qué solución esperas?",
                type: "textarea",
                placeholder: "Indica cómo podemos ayudarte a resolver la situación.",
                required: true
            }
        ]
    },

    pagos: {
        title: "Pagos y facturación",
        icon: "fa-receipt",
        description: "Consulta un cobro, pago o comprobante.",
        fields: [
            {
                name: "paymentType",
                label: "Tipo de consulta",
                type: "select",
                required: true,
                options: [
                    ["Confirmación de pago", "Confirmación de pago"],
                    ["Consulta de cobro", "Consulta de cobro"],
                    ["Factura o comprobante", "Factura o comprobante"],
                    ["Saldo pendiente", "Saldo pendiente"],
                    ["Otro asunto de facturación", "Otro asunto de facturación"]
                ]
            },
            {
                name: "reference",
                label: "Referencia del pago o factura",
                placeholder: "Número de referencia, si lo tienes",
                required: false
            },
            {
                name: "amount",
                label: "Monto relacionado (USD o NIO)",
                placeholder: "Ej. 25 USD o 900 NIO",
                required: false
            },
            {
                name: "details",
                label: "Detalles de la consulta",
                type: "textarea",
                placeholder: "Describe el cobro o pago que necesitas consultar.",
                required: true
            }
        ]
    },

    entrega: {
        title: "Entrega de paquetes",
        icon: "fa-truck-fast",
        description: "Consulta o coordina asuntos relacionados con tu entrega.",
        fields: [
            {
                name: "tracking",
                label: "Número de seguimiento o guía",
                placeholder: "Introduce tu número de guía",
                required: true
            },
            {
                name: "deliveryType",
                label: "Motivo de la consulta",
                type: "select",
                required: true,
                options: [
                    ["Consultar fecha de entrega", "Consultar fecha de entrega"],
                    ["Paquete marcado como entregado", "Paquete marcado como entregado"],
                    ["No he recibido mi paquete", "No he recibido mi paquete"],
                    ["Actualizar instrucciones de entrega", "Actualizar instrucciones de entrega"],
                    ["Coordinar recepción", "Coordinar recepción"],
                    ["Otro asunto de entrega", "Otro asunto de entrega"]
                ]
            },
            {
                name: "details",
                label: "Detalles de la entrega",
                type: "textarea",
                placeholder: "Indica la situación y cualquier detalle importante.",
                required: true
            }
        ]
    },

    actualizacion: {
        title: "Actualización de información",
        icon: "fa-address-card",
        description: "Solicita ayuda para corregir o actualizar tus datos.",
        fields: [
            {
                name: "tracking",
                label: "Número de seguimiento o guía",
                placeholder: "Si aplica, introduce tu número de guía",
                required: false
            },
            {
                name: "updateType",
                label: "Información que deseas actualizar",
                type: "select",
                required: true,
                options: [
                    ["Nombre del cliente", "Nombre del cliente"],
                    ["Teléfono de contacto", "Teléfono de contacto"],
                    ["Correo electrónico", "Correo electrónico"],
                    ["Dirección de entrega", "Dirección de entrega"],
                    ["Datos asociados al paquete", "Datos asociados al paquete"],
                    ["Otra información", "Otra información"]
                ]
            },
            {
                name: "details",
                label: "Explica qué necesitas actualizar",
                type: "textarea",
                placeholder: "Describe el cambio que deseas solicitar.",
                required: true,
                hint: "Por seguridad, el equipo podría necesitar verificar tu identidad antes de aplicar cambios."
            }
        ]
    },

    otras: {
        title: "Otras consultas",
        icon: "fa-circle-question",
        description: "Cuéntanos qué necesitas y te orientaremos.",
        fields: [
            {
                name: "topic",
                label: "Tema de la consulta",
                type: "select",
                required: true,
                options: [
                    ["Información sobre servicios", "Información sobre servicios"],
                    ["Tarifas", "Tarifas"],
                    ["Requisitos de envío", "Requisitos de envío"],
                    ["Horarios de atención", "Horarios de atención"],
                    ["Cuenta de cliente", "Cuenta de cliente"],
                    ["Otro tema", "Otro tema"]
                ]
            },
            {
                name: "tracking",
                label: "Número de seguimiento (si corresponde)",
                placeholder: "Introduce tu número de guía, si aplica",
                required: false
            },
            {
                name: "details",
                label: "¿Cómo podemos ayudarte?",
                type: "textarea",
                placeholder: "Escribe tu pregunta o consulta.",
                required: true
            }
        ]
    }
};

/* =====================================================
   ELEMENTOS
===================================================== */

const mobileMenu = document.getElementById("mobileMenu");
const mainNav = document.getElementById("mainNav");

const categoryButtons = document.querySelectorAll("[data-category]");

const supportForm = document.getElementById("supportForm");
const formFields = document.getElementById("formFields");
const formTitle = document.getElementById("formTitle");
const formDescription = document.getElementById("formDescription");
const formFooter = document.getElementById("formFooter");
const formFeedback = document.getElementById("formFeedback");

const selectedCategory = document.getElementById("selectedCategory");
const selectedCategoryIcon = document.getElementById("selectedCategoryIcon");
const selectedCategoryName = document.getElementById("selectedCategoryName");

const chooseCategoryButton = document.getElementById("chooseCategory");
const changeCategoryButton = document.getElementById("changeCategory");

let currentCategory = null;

/* =====================================================
   MENÚ MÓVIL
===================================================== */

function closeMobileMenu() {
    if (!mobileMenu || !mainNav) return;

    mainNav.classList.remove("active");
    mobileMenu.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-label", "Abrir menú");

    mobileMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';

    document.body.classList.remove("menu-open");
}

if (mobileMenu && mainNav) {
    mobileMenu.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("active");

        mobileMenu.setAttribute("aria-expanded", String(isOpen));
        mobileMenu.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );

        mobileMenu.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        document.body.classList.toggle("menu-open", isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });
}

/* =====================================================
   CREACIÓN SEGURA DE CAMPOS
===================================================== */

function createFormGroup(field) {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    const id = `support-${field.name}`;

    label.htmlFor = id;
    label.append(document.createTextNode(field.label));

    if (field.required) {
        const requiredMark = document.createElement("span");
        requiredMark.className = "required-mark";
        requiredMark.textContent = " *";
        label.appendChild(requiredMark);
    }

    let control;

    if (field.type === "textarea") {
        control = document.createElement("textarea");
        control.rows = 4;
    } else if (field.type === "select") {
        control = document.createElement("select");

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Selecciona una opción";
        control.appendChild(placeholder);

        field.options.forEach(([value, text]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            control.appendChild(option);
        });
    } else {
        control = document.createElement("input");
        control.type = field.type || "text";
    }

    control.id = id;
    control.name = field.name;
    control.required = Boolean(field.required);
    control.autocomplete = "off";

    if (field.placeholder && field.type !== "select") {
        control.placeholder = field.placeholder;
    }

    if (field.hint) {
        const hintId = `${id}-hint`;

        control.setAttribute("aria-describedby", hintId);

        const hint = document.createElement("small");
        hint.className = "field-hint";
        hint.id = hintId;
        hint.textContent = field.hint;

        group.append(label, control, hint);
    } else {
        group.append(label, control);
    }

    return group;
}

/* =====================================================
   CAMBIAR CATEGORÍA
===================================================== */

function selectCategory(categoryKey) {
    const config = categoryConfig[categoryKey];

    if (!config) return;

    currentCategory = categoryKey;

    categoryButtons.forEach((button) => {
        const selected = button.dataset.category === categoryKey;

        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    formTitle.textContent = config.title;
    formDescription.textContent = config.description;

    selectedCategory.hidden = false;
    selectedCategoryIcon.className = `fa-solid ${config.icon}`;
    selectedCategoryName.textContent = config.title;

    formFields.replaceChildren();

    const commonFields = [
        {
            name: "customerName",
            label: "Nombre completo",
            placeholder: "Escribe tu nombre",
            required: true
        },
        {
            name: "customerPhone",
            label: "Teléfono de contacto",
            type: "tel",
            placeholder: "Ej. +505 8888 8888",
            required: true
        },
        {
            name: "customerEmail",
            label: "Correo electrónico (opcional)",
            type: "email",
            placeholder: "correo@ejemplo.com",
            required: false
        }
    ];

    const personalFields = document.createElement("div");
    personalFields.className = "form-row";

    commonFields.forEach((field) => {
        personalFields.appendChild(createFormGroup(field));
    });

    formFields.appendChild(personalFields);

    config.fields.forEach((field) => {
        formFields.appendChild(createFormGroup(field));
    });

    formFooter.hidden = false;
    formFeedback.hidden = true;
    formFeedback.textContent = "";

    supportForm.querySelectorAll("[aria-invalid]").forEach((element) => {
        element.removeAttribute("aria-invalid");
    });

    document.getElementById("formulario").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        block: "start"
    });
}

/* =====================================================
   EVENTOS DE CATEGORÍA
===================================================== */

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectCategory(button.dataset.category);
    });
});

if (chooseCategoryButton) {
    chooseCategoryButton.addEventListener("click", () => {
        document.getElementById("categorias").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

if (changeCategoryButton) {
    changeCategoryButton.addEventListener("click", () => {
        document.getElementById("categorias").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

/* =====================================================
   VALIDACIÓN
===================================================== */

function showFeedback(message) {
    formFeedback.textContent = message;
    formFeedback.hidden = false;
    formFeedback.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function clearFeedback() {
    formFeedback.textContent = "";
    formFeedback.hidden = true;
}

function validateSupportForm() {
    const controls = Array.from(
        supportForm.querySelectorAll("input, select, textarea")
    );

    for (const control of controls) {
        control.removeAttribute("aria-invalid");

        if (!control.checkValidity()) {
            control.setAttribute("aria-invalid", "true");

            showFeedback(
                control.validity.valueMissing
                    ? "Completa el campo obligatorio: " +
                      supportForm.querySelector(`label[for="${control.id}"]`).textContent.trim()
                    : "Revisa la información ingresada en el formulario."
            );

            control.focus();
            return false;
        }
    }

    return true;
}

supportForm.addEventListener("input", (event) => {
    if (event.target.matches("input, select, textarea")) {
        event.target.removeAttribute("aria-invalid");
        clearFeedback();
    }
});

supportForm.addEventListener("change", (event) => {
    if (event.target.matches("input, select, textarea")) {
        event.target.removeAttribute("aria-invalid");
        clearFeedback();
    }
});

/* =====================================================
   PREPARAR MENSAJE PERSONALIZADO
===================================================== */

function getFieldValue(name) {
    const control = supportForm.elements.namedItem(name);

    if (!control) return "";

    return String(control.value || "").trim();
}

function buildWhatsAppMessage() {
    const config = categoryConfig[currentCategory];

    const lines = [
        "SOLICITUD DE SOPORTE | ENVIOS YA",
        "",
        "Categoría: " + config.title,
        "",
        "DATOS DEL CLIENTE",
        "Nombre: " + getFieldValue("customerName"),
        "Teléfono: " + getFieldValue("customerPhone")
    ];

    const email = getFieldValue("customerEmail");

    if (email) {
        lines.push("Correo electrónico: " + email);
    }

    lines.push("", "DETALLES DE LA SOLICITUD");

    config.fields.forEach((field) => {
        const value = getFieldValue(field.name);

        if (value) {
            lines.push(field.label + ": " + value);
        }
    });

    lines.push(
        "",
        "Solicito su apoyo para revisar esta consulta. Gracias."
    );

    return lines.join("\n");
}

/* =====================================================
   ABRIR WHATSAPP
===================================================== */

supportForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFeedback();

    if (!currentCategory || !categoryConfig[currentCategory]) {
        showFeedback("Selecciona una categoría antes de continuar.");
        return;
    }

    if (!validateSupportForm()) {
        return;
    }

    const message = buildWhatsAppMessage();

    const whatsappUrl =
        "https://wa.me/" +
        SUPPORT_PHONE +
        "?text=" +
        encodeURIComponent(message);

    /*
     * Solo abre WhatsApp con el texto preparado.
     * No envía mensajes ni registra solicitudes.
     * El cliente debe confirmar el envío dentro de WhatsApp.
     */

    const whatsappWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
    );

    /*
     * Si el navegador bloquea la nueva ventana,
     * navegar a WhatsApp en la pestaña actual.
     */

    if (!whatsappWindow) {
        window.location.assign(whatsappUrl);
    }
});