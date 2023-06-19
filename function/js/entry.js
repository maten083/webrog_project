document.addEventListener('DOMContentLoaded', function() {
    import('./functionGraph.js').then(function(module) {
        const functionGraph = new module.default();
        functionGraph.init();
    });
})