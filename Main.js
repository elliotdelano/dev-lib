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

document.body.appendChild(view);

stage.addChild(viewport)

World.stage = stage
Physics.beginLoop()
Renderer.beginLoop()

let g = new GameObject()
g.addComponent(Transform)
g.addComponent(Collider, [new Vector2(200, 200), new Vector2(400, 200), new Vector2(400, 400), new Vector2(200, 400)])
g.addComponent(PhysicsComponent)
g.addComponent(Graphic)
g.getComponent(Graphic.name).DrawAABB(g.getComponent(Collider.name).bounds)