/* =====================================================
   FORMULARIO DE CONTACTO - ENVÍOS YA
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const contactForm = document.getElementById("contactForm");

const submitButton = document.getElementById("submitButton");
const submitText = document.getElementById("submitText");
const submitIcon = document.getElementById("submitIcon");

const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");
const successModalButton = document.getElementById("successModalButton");
const successModalOverlay = document.querySelector(
    ".success-modal-overlay"
);


/* =====================================================
   ABRIR MODAL
===================================================== */

function openSuccessModal() {

    if (!successModal) {
        return;
    }

    successModal.classList.add("active");

    successModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


/* =====================================================
   CERRAR MODAL
===================================================== */

function closeModal() {

    if (!successModal) {
        return;
    }

    successModal.classList.remove("active");

    successModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


/* =====================================================
   EVENTOS DEL MODAL
===================================================== */

if (closeSuccessModal) {

    closeSuccessModal.addEventListener(
        "click",
        closeModal
    );

}


if (successModalButton) {

    successModalButton.addEventListener(
        "click",
        closeModal
    );

}


if (successModalOverlay) {

    successModalOverlay.addEventListener(
        "click",
        closeModal
    );

}


/* =====================================================
   ESC PARA CERRAR MODAL
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            successModal &&
            successModal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   ENVÍO DEL FORMULARIO
===================================================== */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            /*
             * Evita que el navegador envíe el formulario
             * de la manera tradicional.
             *
             * Esto evita la redirección de FormSubmit.
             */

            event.preventDefault();


            /* =================================================
               VALIDACIÓN HTML
            ================================================= */

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;

            }


            /* =================================================
               ESTADO: ENVIANDO
            ================================================= */

            submitButton.disabled = true;

            submitText.textContent = "Enviando...";

            submitIcon.className =
                "fas fa-spinner fa-spin";


            try {

                /* =============================================
                   OBTENER DATOS DEL FORMULARIO
                ============================================= */

                const formData = new FormData(
                    contactForm
                );


                /* =============================================
                   OBTENER ACTION
                ============================================= */

                const action =
                    contactForm.getAttribute("action");


                if (!action) {

                    throw new Error(
                        "El formulario no tiene configurado un destino."
                    );

                }


                /* =============================================
                   CONVERTIR FORM SUBMIT NORMAL
                   A ENDPOINT AJAX
                ============================================= */

                let ajaxUrl = action;


                if (
                    ajaxUrl.includes(
                        "https://formsubmit.co/"
                    )
                ) {

                    ajaxUrl =
                        ajaxUrl.replace(
                            "https://formsubmit.co/",
                            "https://formsubmit.co/ajax/"
                        );

                }


                console.log(
                    "Enviando formulario a:",
                    ajaxUrl
                );


                /* =============================================
                   PETICIÓN AJAX
                ============================================= */

                const response = await fetch(
                    ajaxUrl,
                    {
                        method: "POST",

                        body: formData,

                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


                /* =============================================
                   OBTENER RESPUESTA
                ============================================= */

                let result = null;


                try {

                    result = await response.json();

                } catch (jsonError) {

                    console.warn(
                        "La respuesta no pudo convertirse a JSON."
                    );

                }


                console.log(
                    "Respuesta de FormSubmit:",
                    result
                );


                /* =============================================
                   VERIFICAR RESPUESTA
                ============================================= */

                if (!response.ok) {

                    throw new Error(
                        result?.message ||
                        "FormSubmit rechazó el envío."
                    );

                }


                /*
                 * FormSubmit normalmente devuelve:
                 *
                 * {
                 *     success: true,
                 *     message: "..."
                 * }
                 *
                 * Si devuelve success === false,
                 * consideramos que hubo un error.
                 */

                if (
                    result &&
                    result.success === false
                ) {

                    throw new Error(
                        result.message ||
                        "No se pudo enviar la información."
                    );

                }


                /* =================================================
                   ENVÍO EXITOSO
                ================================================= */


                /* ---------------------------------------------
                   LIMPIAR FORMULARIO
                --------------------------------------------- */

                contactForm.reset();


                /* ---------------------------------------------
                   RESTAURAR BOTÓN
                --------------------------------------------- */

                submitButton.disabled = false;

                submitText.textContent =
                    "Enviar mensaje";

                submitIcon.className =
                    "fas fa-paper-plane";


                /* ---------------------------------------------
                   MOSTRAR MODAL
                --------------------------------------------- */

                openSuccessModal();


            } catch (error) {

                /* =================================================
                   ERROR
                ================================================= */

                console.error(
                    "Error al enviar formulario:",
                    error
                );


                /* ---------------------------------------------
                   RESTAURAR BOTÓN
                --------------------------------------------- */

                submitButton.disabled = false;

                submitText.textContent =
                    "Intentar nuevamente";

                submitIcon.className =
                    "fas fa-paper-plane";


                /*
                 * Por ahora utilizamos alert.
                 * Después podemos crear un modal de error
                 * con exactamente el mismo diseño.
                 */

                alert(
                    "No pudimos enviar tu información. " +
                    "Por favor, intenta nuevamente."
                );

            }

        }
    );

}