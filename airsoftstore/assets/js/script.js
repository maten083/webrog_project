document.addEventListener("DOMContentLoaded", function() {
    import('./store.js').then(module => {
        new module.default();
    }, error => {
        console.error(error);
        document.querySelector('body').innerText = "Hiba az oldal betöltése közben.";
    });
})