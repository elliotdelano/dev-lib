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

let boxA = new GameObject()
boxA.addComponent(Transform)
boxA.getComponent(Transform).position.set(350, -500)
boxA.addComponent(PolygonCollider, [new Vector2(-100, -100), new Vector2(100, -100), new Vector2(100, 100), new Vector2(-100, 100)])
boxA.addComponent(PhysicsComponent)
boxA.addComponent(Graphic)
boxA.getComponent(Graphic).DrawPolygon(boxA.getComponent(PolygonCollider).points)

let boxB = new GameObject()
boxB.addComponent(Transform)
boxB.getComponent(Transform).position.set(400, 0)
boxB.addComponent(PolygonCollider, [new Vector2(-50, -50), new Vector2(50, -50), new Vector2(50, 50), new Vector2(-50, 50)])
boxB.addComponent(PhysicsComponent)
boxB.addComponent(Graphic)
boxB.getComponent(Graphic).DrawPolygon(boxB.getComponent(PolygonCollider).points)

let boxC = new GameObject()
boxC.addComponent(Transform)
boxC.getComponent(Transform).position.set(400, -200)
boxC.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
boxC.addComponent(PhysicsComponent)
boxC.addComponent(Graphic)
boxC.getComponent(Graphic).DrawPolygon(boxC.getComponent(PolygonCollider).points)

let floor = new GameObject()
floor.addComponent(Transform)
floor.getComponent(Transform).position.set(350, 600)
floor.addComponent(PolygonCollider, [new Vector2(-300, -20), new Vector2(300, -20), new Vector2(300, 20), new Vector2(-300, 20)])
floor.addComponent(Graphic)
floor.getComponent(Graphic).DrawPolygon(floor.getComponent(PolygonCollider).points)