/* =========================================================
   ENVIOS YA
   registrar.js

   Registro de nuevos envíos

   IMPORTANTE:
   - Este módulo SOLO agrega nuevos registros.
   - NO modifica envíos existentes.
   - NO elimina envíos existentes.
   - Los registros se almacenan en localStorage.
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const REGISTRAR_STORAGE_KEY = "envios";


/* =========================================================
   INICIALIZAR MÓDULO
========================================================= */

function initializeRegistrar() {

    console.log("Inicializando módulo de Registrar envío...");

    const form = document.getElementById("shipmentForm");

    if (!form) {
        console.warn("No se encontró el formulario de registro.");
        return;
    }

    /*
       Evitamos registrar los mismos eventos varias veces
       cuando el usuario entra y sale del módulo.
    */

    if (form.dataset.initialized === "true") {
        actualizarCalculoPrecio();
        return;
    }

    form.dataset.initialized = "true";


    /* -----------------------------------------------------
       REFERENCIA Y FECHA
    ----------------------------------------------------- */

    generarReferencia();
    establecerFechaActual();


    /* -----------------------------------------------------
       TIPO DE PAQUETE
    ----------------------------------------------------- */

    const packageType = document.getElementById("packageType");

    if (packageType) {

        packageType.addEventListener(
            "change",
            manejarTipoPaquete
        );

        manejarTipoPaquete();
    }


    /* -----------------------------------------------------
       ELEMENTOS DE TARIFICACIÓN
    ----------------------------------------------------- */

    const elementosPrecio = [
        "shipmentWeight",
        "weightUnit",
        "pricingMethod",
        "pricePerUnit",
        "serviceDiscount",
        "serviceTax",
        "serviceCurrency"
    ];


    elementosPrecio.forEach(id => {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            actualizarCalculoPrecio
        );

        element.addEventListener(
            "change",
            actualizarCalculoPrecio
        );

    });


    /* -----------------------------------------------------
       MÉTODO DE TARIFICACIÓN
    ----------------------------------------------------- */

    const pricingMethod =
        document.getElementById("pricingMethod");

    if (pricingMethod) {

        pricingMethod.addEventListener(
            "change",
            manejarMetodoTarificacion
        );

        manejarMetodoTarificacion();
    }


    /* -----------------------------------------------------
       FORMULARIO
    ----------------------------------------------------- */

    form.addEventListener(
        "submit",
        guardarEnvio
    );


    /* -----------------------------------------------------
       CANCELAR
    ----------------------------------------------------- */

    const cancelButton =
        document.getElementById(
            "cancelShipmentButton"
        );

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            cancelarRegistro
        );

    }


    /* -----------------------------------------------------
       CÁLCULO INICIAL
    ----------------------------------------------------- */

    actualizarCalculoPrecio();

}


/* =========================================================
   GENERAR REFERENCIA
========================================================= */

/* =========================================================
   GENERAR REFERENCIA
   Formato: ENV-00001
========================================================= */

function generarReferencia() {

    const referenceInput =
        document.getElementById("shipmentReference");

    if (!referenceInput) {
        return;
    }


    try {

        const storedData =
            localStorage.getItem(
                REGISTRAR_STORAGE_KEY
            );


        let enviosExistentes = [];


        /*
           Leer los registros existentes.
           NO modificamos ninguno.
        */

        if (storedData) {

            const parsedData =
                JSON.parse(storedData);

            if (Array.isArray(parsedData)) {

                enviosExistentes =
                    parsedData;

            }

        }


        /*
           Buscar el número más alto que ya exista.

           Ejemplos:

           ENV-00001
           ENV-00002
           ENV-00015

           El siguiente será:

           ENV-00016
        */

        let ultimoNumero = 0;


        enviosExistentes.forEach(envio => {

            const referencia =
                envio?.referencia ||
                envio?.reference ||
                "";


            const match =
                String(referencia).match(
                    /^ENV-(\d+)$/
                );


            if (match) {

                const numero =
                    parseInt(
                        match[1],
                        10
                    );


                if (
                    !Number.isNaN(numero) &&
                    numero > ultimoNumero
                ) {

                    ultimoNumero =
                        numero;

                }

            }

        });


        /*
           Siguiente número.
        */

        const siguienteNumero =
            ultimoNumero + 1;


        /*
           Formato:

           1    → ENV-00001
           12   → ENV-00012
           125  → ENV-00125
           1250 → ENV-01250
        */

        const referencia =
            `ENV-${String(siguienteNumero).padStart(5, "0")}`;


        referenceInput.value =
            referencia;


    } catch (error) {

        console.error(
            "Error generando referencia:",
            error
        );


        /*
           En caso de error no generamos
           una referencia que pueda colisionar.
        */

        referenceInput.value = "";

    }

}


/* =========================================================
   FECHA ACTUAL
========================================================= */

function establecerFechaActual() {

    const dateInput =
        document.getElementById(
            "shipmentDate"
        );

    if (!dateInput) {
        return;
    }


    const ahora = new Date();

    const year =
        ahora.getFullYear();

    const month =
        String(
            ahora.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            ahora.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;

}


/* =========================================================
   TIPO DE PAQUETE
========================================================= */

function manejarTipoPaquete() {

    const packageType =
        document.getElementById(
            "packageType"
        );

    const customPackageGroup =
        document.getElementById(
            "customPackageGroup"
        );

    const customPackageType =
        document.getElementById(
            "customPackageType"
        );


    if (
        !packageType ||
        !customPackageGroup
    ) {
        return;
    }


    const isOther =
        packageType.value === "otro";


    customPackageGroup.hidden =
        !isOther;


    if (customPackageType) {

        customPackageType.required =
            isOther;

        if (!isOther) {
            customPackageType.value = "";
        }

    }

}


/* =========================================================
   MÉTODO DE TARIFICACIÓN
========================================================= */

function manejarMetodoTarificacion() {

    const pricingMethod =
        document.getElementById(
            "pricingMethod"
        );

    const pricePerUnit =
        document.getElementById(
            "pricePerUnit"
        );


    if (
        !pricingMethod ||
        !pricePerUnit
    ) {
        return;
    }


    const method =
        pricingMethod.value;


    /*
       Si el cálculo es por peso,
       necesitamos tarifa por unidad.
    */

    if (method === "peso") {

        pricePerUnit.disabled = false;
        pricePerUnit.required = true;

    }


    /*
       Por unidad.
    */

    else if (method === "unidad") {

        pricePerUnit.disabled = false;
        pricePerUnit.required = false;

    }


    /*
       Precio fijo.
    */

    else if (method === "fijo") {

        pricePerUnit.disabled = false;
        pricePerUnit.required = false;

    }


    /*
       Cotización personalizada.
    */

    else if (method === "personalizado") {

        pricePerUnit.disabled = true;
        pricePerUnit.required = false;

    }


    actualizarCalculoPrecio();

}


/* =========================================================
   CALCULAR PRECIO
========================================================= */

function actualizarCalculoPrecio() {

    const weightInput =
        document.getElementById(
            "shipmentWeight"
        );

    const weightUnit =
        document.getElementById(
            "weightUnit"
        );

    const pricingMethod =
        document.getElementById(
            "pricingMethod"
        );

    const pricePerUnit =
        document.getElementById(
            "pricePerUnit"
        );

    const discountInput =
        document.getElementById(
            "serviceDiscount"
        );

    const taxInput =
        document.getElementById(
            "serviceTax"
        );


    const weight =
        Number(
            weightInput?.value || 0
        );

    const unit =
        weightUnit?.value || "lb";

    const method =
        pricingMethod?.value || "peso";

    const price =
        Number(
            pricePerUnit?.value || 0
        );

    const discount =
        Number(
            discountInput?.value || 0
        );

    const tax =
        Number(
            taxInput?.value || 0
        );


    let subtotal = 0;


    /* -----------------------------------------------------
       POR PESO
    ----------------------------------------------------- */

    if (method === "peso") {

        subtotal =
            weight * price;

    }


    /* -----------------------------------------------------
       POR UNIDAD
    ----------------------------------------------------- */

    else if (method === "unidad") {

        const quantityInput =
            document.getElementById(
                "productQuantity"
            );

        const quantity =
            Number(
                quantityInput?.value || 0
            );

        subtotal =
            quantity * price;

    }


    /* -----------------------------------------------------
       PRECIO FIJO
    ----------------------------------------------------- */

    else if (method === "fijo") {

        subtotal =
            price;

    }


    /*
       Cotización personalizada:
       el usuario podrá colocar el valor
       directamente mediante pricePerUnit.
    */

    else if (method === "personalizado") {

        subtotal =
            price;

    }


    /*
       Evitamos valores negativos.
    */

    subtotal =
        Math.max(
            0,
            subtotal
        );


    const discountValue =
        Math.min(
            Math.max(0, discount),
            subtotal
        );


    const taxableAmount =
        Math.max(
            0,
            subtotal - discountValue
        );


    const taxValue =
        Math.max(
            0,
            tax
        );


    const finalPrice =
        taxableAmount + taxValue;


    /* -----------------------------------------------------
       ACTUALIZAR INPUT SUBTOTAL
    ----------------------------------------------------- */

    actualizarInput(
        "serviceSubtotal",
        subtotal.toFixed(2)
    );


    /* -----------------------------------------------------
       RESUMEN
    ----------------------------------------------------- */

    actualizarTexto(
        "calculatedWeight",
        `${formatearNumero(weight)} ${unit.toUpperCase()}`
    );


    actualizarTexto(
        "calculatedSubtotal",
        formatearMoneda(subtotal)
    );


    actualizarTexto(
        "calculatedDiscount",
        `-${formatearMoneda(discountValue)}`
    );


    actualizarTexto(
        "calculatedTax",
        formatearMoneda(taxValue)
    );


    actualizarTexto(
        "finalServicePrice",
        formatearMoneda(finalPrice)
    );


    /*
       Guardamos temporalmente el cálculo
       para utilizarlo al registrar.
    */

    window.enviosYaPricing = {

        weight,
        weightUnit: unit,
        pricingMethod: method,
        pricePerUnit: price,
        subtotal,
        discount: discountValue,
        tax: taxValue,
        finalPrice

    };

}


/* =========================================================
   ACTUALIZAR INPUT
========================================================= */

function actualizarInput(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.value =
        value;

}


/* =========================================================
   ACTUALIZAR TEXTO
========================================================= */

function actualizarTexto(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value;

}


/* =========================================================
   FORMATEAR NÚMERO
========================================================= */

function formatearNumero(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "es-NI",
        {
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   FORMATEAR MONEDA
========================================================= */

function formatearMoneda(value) {

    const currency =
        document.getElementById(
            "serviceCurrency"
        )?.value || "USD";


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2
        }
    ).format(
        Number(value || 0)
    );

}


/* =========================================================
   GUARDAR ENVÍO
========================================================= */

function guardarEnvio(event) {

    event.preventDefault();


    const form =
        document.getElementById(
            "shipmentForm"
        );


    if (!form) {
        return;
    }


    /*
       Validación HTML.
    */

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    actualizarCalculoPrecio();


    const pricing =
        window.enviosYaPricing || {

            weight: 0,
            weightUnit: "lb",
            pricingMethod: "peso",
            pricePerUnit: 0,
            subtotal: 0,
            discount: 0,
            tax: 0,
            finalPrice: 0

        };


    /* =====================================================
       OBTENER VALORES
    ===================================================== */

    const getValue = id => {

        return document.getElementById(id)?.value?.trim() || "";

    };


    const referencia =
        getValue(
            "shipmentReference"
        );


    /* =====================================================
       CREAR OBJETO DEL ENVÍO
    ===================================================== */

    const nuevoEnvio = {

        /*
           Identificación
        */

        referencia: referencia,

        fecha: getValue(
            "shipmentDate"
        ),

        serviceType: getValue(
            "serviceType"
        ),

        shippingMode: getValue(
            "shippingMode"
        ),

        estado:
            getValue(
                "shipmentStatus"
            ) || "pendiente",


        /*
           Remitente
        */

        remitente: {

            nombre:
                getValue(
                    "senderName"
                ),

            telefono:
                getValue(
                    "senderPhone"
                ),

            email:
                getValue(
                    "senderEmail"
                ),

            documento:
                getValue(
                    "senderDocument"
                ),

            pais:
                getValue(
                    "senderCountry"
                ),

            ciudad:
                getValue(
                    "senderCity"
                ),

            direccion:
                getValue(
                    "senderAddress"
                )

        },


        /*
           Destinatario
        */

        destinatario: {

            nombre:
                getValue(
                    "recipientName"
                ),

            telefono:
                getValue(
                    "recipientPhone"
                ),

            email:
                getValue(
                    "recipientEmail"
                ),

            documento:
                getValue(
                    "recipientDocument"
                ),

            pais:
                getValue(
                    "recipientCountry"
                ),

            ciudad:
                getValue(
                    "recipientCity"
                ),

            direccion:
                getValue(
                    "recipientAddress"
                )

        },


        /*
           Mercancía
        */

        mercancia: {

            tipoPaquete:
                getValue(
                    "packageType"
                ),

            tipoPaquetePersonalizado:
                getValue(
                    "customPackageType"
                ),

            categoria:
                getValue(
                    "productCategory"
                ),

            cantidad:
                Number(
                    getValue(
                        "productQuantity"
                    ) || 0
                ),

            descripcion:
                getValue(
                    "shipmentDescription"
                ),

            observaciones:
                getValue(
                    "shipmentNotes"
                )

        },


        /*
           Carga
        */

        carga: {

            peso:
                pricing.weight,

            unidadPeso:
                pricing.weightUnit,

            largo:
                Number(
                    getValue(
                        "packageLength"
                    ) || 0
                ),

            ancho:
                Number(
                    getValue(
                        "packageWidth"
                    ) || 0
                ),

            alto:
                Number(
                    getValue(
                        "packageHeight"
                    ) || 0
                ),

            unidadDimensiones:
                getValue(
                    "dimensionUnit"
                )

        },


        /*
           Origen logístico
        */

        origen: {

            pais:
                getValue(
                    "originCountry"
                ),

            ciudad:
                getValue(
                    "originCity"
                ),

            direccion:
                getValue(
                    "originAddress"
                )

        },


        /*
           Destino logístico
        */

        destino: {

            pais:
                getValue(
                    "destinationCountry"
                ),

            ciudad:
                getValue(
                    "destinationCity"
                ),

            direccion:
                getValue(
                    "destinationAddress"
                )

        },


        /*
           Tarificación
        */

        tarificacion: {

            metodo:
                pricing.pricingMethod,

            precioPorUnidad:
                pricing.pricePerUnit,

            subtotal:
                pricing.subtotal,

            descuento:
                pricing.discount,

            impuestos:
                pricing.tax,

            precioFinal:
                pricing.finalPrice,

            moneda:
                getValue(
                    "serviceCurrency"
                ) || "USD"

        },


        /*
           Información logística
        */

        logistica: {

            transportista:
                getValue(
                    "carrier"
                ),

            numeroGuia:
                getValue(
                    "trackingNumber"
                ),

            referenciaExterna:
                getValue(
                    "externalReference"
                ),

            entregaEstimada:
                getValue(
                    "estimatedDelivery"
                ),

            aduana:
                getValue(
                    "customs"
                )

        },


        /*
           Pago
        */

        pago: {

            metodo:
                getValue(
                    "paymentMethod"
                ),

            estado:
                getValue(
                    "paymentStatus"
                ) || "pendiente"

        },


        /*
           Notas internas
        */

        notasInternas:
            getValue(
                "internalNotes"
            ),


        /*
           Información del sistema
        */

        creadoEn:
            new Date().toISOString()

    };


    /* =====================================================
       GUARDAR SIN ALTERAR REGISTROS EXISTENTES
    ===================================================== */

    try {

        const storedData =
            localStorage.getItem(
                REGISTRAR_STORAGE_KEY
            );


        let enviosExistentes = [];


        if (storedData) {

            const parsed =
                JSON.parse(
                    storedData
                );


            /*
               Si existe información válida,
               la conservamos exactamente como está.
            */

            if (Array.isArray(parsed)) {

                enviosExistentes =
                    parsed;

            }

        }


        /*
           SOLO agregamos el nuevo envío.
        */

        enviosExistentes.push(
            nuevoEnvio
        );


        localStorage.setItem(
            REGISTRAR_STORAGE_KEY,
            JSON.stringify(
                enviosExistentes
            )
        );


        console.log(
            "Envío registrado correctamente:",
            nuevoEnvio
        );


        mostrarRegistroExitoso(
            nuevoEnvio
        );


    } catch (error) {

        console.error(
            "Error guardando el envío:",
            error
        );


        mostrarErrorRegistro();

    }

}


/* =========================================================
   REGISTRO EXITOSO
========================================================= */

function mostrarRegistroExitoso(
    envio
) {

    const referencia =
        envio.referencia || "Sin referencia";


    /*
       Por ahora utilizamos una confirmación
       sencilla. Después podemos sustituirla
       por el modal global del sistema.
    */

    const continuar =
        window.confirm(
            `Envío registrado correctamente.\n\nReferencia: ${referencia}\nPrecio final: ${formatearMoneda(envio.tarificacion.precioFinal)}\n\n¿Deseas ir a la lista de envíos?`
        );


    if (continuar) {

        loadPage(
            "envios"
        );

        /*
           Actualizamos navegación si existe.
        */

        const enviosLink =
            document.querySelector(
                '[data-section="envios"], [data-page="envios"]'
            );


        if (enviosLink) {

            document
                .querySelectorAll(
                    ".nav-item"
                )
                .forEach(link => {

                    link.classList.remove(
                        "active"
                    );

                });


            enviosLink.classList.add(
                "active"
            );

        }

    }

}


/* =========================================================
   ERROR DE REGISTRO
========================================================= */

function mostrarErrorRegistro() {

    alert(
        "No se pudo registrar el envío. Verifica el almacenamiento del navegador e intenta nuevamente."
    );

}


/* =========================================================
   CANCELAR
========================================================= */

function cancelarRegistro() {

    const confirmar =
        window.confirm(
            "¿Deseas cancelar el registro? Los datos introducidos se perderán."
        );


    if (!confirmar) {
        return;
    }


    loadPage(
        "envios"
    );


    const enviosLink =
        document.querySelector(
            '[data-section="envios"], [data-page="envios"]'
        );


    if (enviosLink) {

        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(link => {

                link.classList.remove(
                    "active"
                );

            });


        enviosLink.classList.add(
            "active"
        );

    }

}


/* =========================================================
   OBTENER ÚLTIMO PRECIO CALCULADO
========================================================= */

function getPrecioFinalEnvio() {

    return (
        window.enviosYaPricing?.finalPrice ||
        0
    );

}


/* =========================================================
   EXPORTAR INFORMACIÓN
========================================================= */

window.initializeRegistrar =
    initializeRegistrar;

window.getPrecioFinalEnvio =
    getPrecioFinalEnvio;