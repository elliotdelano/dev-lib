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
boxA.getComponent(Transform).position.set(330, -500)
boxA.addComponent(PolygonCollider, [new Vector2(-100, -100), new Vector2(100, -100), new Vector2(100, 100), new Vector2(-100, 100)])
boxA.addComponent(PhysicsComponent)
boxA.addComponent(Graphic)
boxA.getComponent(Graphic).DrawPolygon(boxA.getComponent(PolygonCollider).points)

let boxB = new GameObject()
boxB.addComponent(Transform)
boxB.getComponent(Transform).position.set(400, 300)
boxB.addComponent(PolygonCollider, [new Vector2(-50, -50), new Vector2(50, -50), new Vector2(50, 50), new Vector2(-50, 50)])
boxB.addComponent(PhysicsComponent)
boxB.addComponent(Graphic)
boxB.getComponent(Graphic).DrawPolygon(boxB.getComponent(PolygonCollider).points)

let boxC = new GameObject()
boxC.addComponent(Transform)
boxC.getComponent(Transform).position.set(400, 100)
boxC.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
boxC.addComponent(PhysicsComponent)
boxC.addComponent(Graphic)
boxC.getComponent(Graphic).DrawPolygon(boxC.getComponent(PolygonCollider).points)

let boxD = new GameObject()
boxD.addComponent(Transform)
boxD.getComponent(Transform).position.set(400, -700)
boxD.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
boxD.addComponent(PhysicsComponent)
boxD.addComponent(Graphic)
boxD.getComponent(Graphic).DrawPolygon(boxD.getComponent(PolygonCollider).points)

let boxE = new GameObject()
boxE.addComponent(Transform)
boxE.getComponent(Transform).position.set(400, -800)
boxE.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
boxE.addComponent(PhysicsComponent)
boxE.addComponent(Graphic)
boxE.getComponent(Graphic).DrawPolygon(boxE.getComponent(PolygonCollider).points)

let boxF = new GameObject()
boxF.addComponent(Transform)
boxF.getComponent(Transform).position.set(400, -1000)
boxF.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
boxF.addComponent(PhysicsComponent)
boxF.addComponent(Graphic)
boxF.getComponent(Graphic).DrawPolygon(boxF.getComponent(PolygonCollider).points)

let floor = new GameObject()
floor.addComponent(Transform)
floor.getComponent(Transform).position.set(340, 600)
floor.addComponent(PolygonCollider, [new Vector2(-300, -20), new Vector2(300, -20), new Vector2(300, 20), new Vector2(-300, 20)]).isStatic = true
floor.addComponent(Graphic)
floor.getComponent(Graphic).DrawPolygon(floor.getComponent(PolygonCollider).points)

let visualizer = new GameObject()
visualizer.addComponent(QuadTreeVisualizer)

