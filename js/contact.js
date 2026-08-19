/* =====================================================
   FORMULARIO DE CONTACTO
===================================================== */

const contactForm = document.getElementById("contactForm");

const submitButton = document.getElementById("submitButton");
const submitText = document.getElementById("submitText");
const submitIcon = document.getElementById("submitIcon");

const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");
const successModalButton = document.getElementById("successModalButton");
const successModalOverlay = document.querySelector(".success-modal-overlay");


/* =====================================================
   ABRIR MODAL
===================================================== */

function openSuccessModal() {

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

closeSuccessModal.addEventListener(
    "click",
    closeModal
);


successModalButton.addEventListener(
    "click",
    closeModal
);


successModalOverlay.addEventListener(
    "click",
    closeModal
);


/* =====================================================
   ESC PARA CERRAR
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            successModal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   ENVÍO DEL FORMULARIO
===================================================== */

contactForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* ---------------------------------------------
           ESTADO DE ENVÍO
        --------------------------------------------- */

        submitButton.disabled = true;

        submitText.textContent = "Enviando...";

        submitIcon.className = "fas fa-spinner fa-spin";


        try {

            const formData = new FormData(contactForm);


            const response = await fetch(
                contactForm.action,
                {
                    method: "POST",

                    body: formData,

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "No se pudo enviar el formulario."
                );

            }


            /* -----------------------------------------
               LIMPIAR FORMULARIO
            ----------------------------------------- */

            contactForm.reset();


            /* -----------------------------------------
               RESTAURAR BOTÓN
            ----------------------------------------- */

            submitButton.disabled = false;

            submitText.textContent = "Enviar mensaje";

            submitIcon.className = "fas fa-paper-plane";


            /* -----------------------------------------
               MOSTRAR MODAL
            ----------------------------------------- */

            openSuccessModal();


        } catch (error) {

            console.error(
                "Error al enviar formulario:",
                error
            );


            submitButton.disabled = false;

            submitText.textContent = "Intentar nuevamente";

            submitIcon.className = "fas fa-paper-plane";


            alert(
                "No pudimos enviar tu información. " +
                "Por favor, intenta nuevamente."
            );

        }

    }
);