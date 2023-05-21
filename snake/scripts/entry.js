document.addEventListener("DOMContentLoaded", function() {
    import('./snake.js').then(module => {
        const game = new module.Snake();
        game.init();
        game.play();
    }, error => {
        console.error(error);
        alert("Nem sikerült betölteni a Snake modult! A konzolban megtalálja a hibát.");
    });
})