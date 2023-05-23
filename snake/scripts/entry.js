document.addEventListener("DOMContentLoaded", function() {
    import('./snakeGame.js').then(module => {
        const game = new module.SnakeGame();
        game.init().then(() => {
            game.play();
        });
    }, error => {
        console.error(error);
        alert("Nem sikerült betölteni a Snake modult! A konzolban megtalálja a hibát.");
    });
})