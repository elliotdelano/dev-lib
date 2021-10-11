const canvas = document.getElementById('canvas');

const app = new PIXI.Application({
    view: canvas,
    width: 700,
    height: 700
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

World.stage = viewport
World.size = new Vector2(700, 700)
Physics.beginLoop()
Renderer.beginLoop()

let g = new GameObject()
g.addComponent(Transform)
g.getComponent(Transform).position.set(200, 0)
g.addComponent(PolygonCollider, [new Vector2(-100, -100), new Vector2(100, -100), new Vector2(100, 100), new Vector2(-100, 100)])
g.addComponent(PhysicsComponent)
g.addComponent(Graphic)
g.getComponent(Graphic).DrawPolygon(g.getComponent(PolygonCollider).points)

let floor = new GameObject()
floor.addComponent(Transform)
floor.getComponent(Transform).position.set(350, 600)
floor.addComponent(PolygonCollider, [new Vector2(-300, -20), new Vector2(300, -20), new Vector2(300, 20), new Vector2(-300, 20)])
floor.addComponent(Graphic)
floor.getComponent(Graphic).DrawPolygon(floor.getComponent(PolygonCollider).points)