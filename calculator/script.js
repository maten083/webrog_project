document.addEventListener("DOMContentLoaded", function() {
    import('./calculator.js').then(module => {
        const calc = new module.Calculator();
        calc.init();
    }, error => {
        console.error(error);
        alert("Nem sikerült betölteni a Calculator modult! A konzolban megtalálja a hibát.");
    });
})