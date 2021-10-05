document.body.appendChild(view);

stage.addChild(viewport)

const canvas = document.getElementById('canvas');

const app = new PIXI.Application({
    view: canvas,
    width: 1000,
    height: 1000
});

const { stage, view, ticker, renderer } = app;

const viewport = new pixi_viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,

    interaction: app.renderer.plugins.interaction
})

