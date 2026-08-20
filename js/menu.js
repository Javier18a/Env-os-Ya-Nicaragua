/* =========================================================
   MENÚ MÓVIL
   Envíos Ya
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const mobileMenu = document.getElementById("mobileMenu");
    const mainNav = document.getElementById("mainNav");

    /* =====================================================
       VERIFICAR ELEMENTOS
    ===================================================== */

    if (!mobileMenu || !mainNav) {
        console.warn("Menú móvil: elementos no encontrados.");
        return;
    }

    const menuIcon = mobileMenu.querySelector("i");


    /* =====================================================
       ESTADO INICIAL
    ===================================================== */

    mobileMenu.setAttribute("aria-expanded", "false");


    /* =====================================================
       FUNCIÓN PARA CERRAR MENÚ
    ===================================================== */

    function closeMenu() {

        mainNav.classList.remove("active");

        mobileMenu.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        if (menuIcon) {

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");

        }

    }


    /* =====================================================
       FUNCIÓN PARA ABRIR MENÚ
    ===================================================== */

    function openMenu() {

        mainNav.classList.add("active");

        mobileMenu.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenu.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

        if (menuIcon) {

            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");

        }

    }


    /* =====================================================
       BOTÓN MENÚ
    ===================================================== */

    mobileMenu.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen =
            mainNav.classList.contains("active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    });


    /* =====================================================
       CERRAR AL SELECCIONAR OPCIÓN
    ===================================================== */

    const navItems =
        mainNav.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {
            closeMenu();
        });

    });


    /* =====================================================
       CERRAR AL HACER CLICK FUERA
    ===================================================== */

    document.addEventListener("click", (event) => {

        if (
            !mainNav.contains(event.target) &&
            !mobileMenu.contains(event.target)
        ) {

            closeMenu();

        }

    });


    /* =====================================================
       CERRAR CON ESCAPE
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            mainNav.classList.contains("active")
        ) {

            closeMenu();
            mobileMenu.focus();

        }

    });


    /* =====================================================
       CERRAR AL VOLVER A ESCRITORIO
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    });

});