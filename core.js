class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    magSq() {
        var x = this.x, y = this.y;
        return x * x + y * y;
    }
    mag() {
        return Math.sqrt(this.magSq());
    }
    add(x, y) {
        if (x instanceof Vector2) {
            this.x += x.x;
            this.y += x.y;
            return this;
        }
        this.x += x;
        this.y += y;
        return this;
    }
    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y)
    }
    sub(x, y) {
        if (x instanceof Vector2) {
            this.x -= x.x;
            this.y -= x.y;
            return this;
        }
        this.x -= x;
        this.y -= y;
        return this;
    }
    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y)
    }
    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    static div(a, b) {
        return new Vector2(a.x / b.x, a.y / b.y)
    }
    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    static multi(a, b) {
        return new Vector2(a.x * b.x, a.y * b.y)
    }
    len2() {
        return this.dot(this)
    }
    len() {
        return Math.sqrt(this.len2())
    }
    normalize() {
        return this.div(this.mag());
    }
    setMag(n) {
        return this.normalize().mult(n);
    }
    dot(x, y) {
        if (x instanceof Vector2) {
            return this.dot(x.x, x.y);
        }
        return this.x * x + this.y * y;
    }
    dist(v) {
        var d = Vector2.sub(v, this)
        return d.mag()
    }
    static dist(a, b) {
        let d = Vector2.sub(a, b)
        return d.mag()
    }
    limit(l) {
        var mSq = this.magSq();
        if (mSq > l * l) {
            this.div(Math.sqrt(mSq));
            this.mult(l);
        }
        return this;
    }
    perp() {
        let x = this.x
        this.x = this.y
        this.y = -x
        return this
    }
    headingRads() {
        var h = Math.atan2(this.y, this.x);
        return h;
    }
    headingDegs() {
        var r = Math.atan2(this.y, this.x);
        var h = (r * 180.0) / Math.PI;
        return h;
    }
    setRotation(a) {
        let x = this.x
        let y = this.y
        this.x = x * Math.cos(a) - y * Math.sin(a)
        this.y = x * Math.sin(a) + y * Math.cos(a)
        return this
    }
    rotate2(a) {
        let ang = -a * (Math.PI / 180)
        let cos = Math.cos(ang)
        let sin = Math.sin(ang)
        let x = this.x
        let y = this.y
        this.x = Math.round(10000 * (x * cos - y * sin)) / 10000
        this.y = Math.round(10000 * (x * sin + y * cos)) / 10000
        return this
    }
    project(other) {
        let amt = this.dot(other) / other.len2()
        this.x = amt * other.x
        this.y = amy * other.y
        return this
    }
    projectN(other) {
        let amt = this.dot(other)
        this.x = amt * other.x
        this.y = amy * other.y
        return this
    }
    reflect(axis) {
        let x = this.x
        let y = this.y
        this.project(axis).mult(2)
        this.x -= x
        this.y -= y
        return this
    }
    reflectN(axis) {
        let x = this.x
        let y = this.y
        this.projectN(axis).mult(2)
        this.x -= x
        this.y -= y
        return this
    }
    reverse() {
        this.x = -this.x
        this.y = -this.y
        return this
    }
    rotateRads(a) {
        var newHead = this.headingRads() + a;
        var mag = this.mag();
        this.x = Math.cos(newHead) * mag;
        this.y = Math.sin(newHead) * mag;
        return this;
    }
    rotateDegs(a) {
        a = (a * Math.PI) / 180.0;
        var newHead = this.headingRads() + a;
        var mag = this.mag();
        this.x = Math.cos(newHead) * mag;
        this.y = Math.sin(newHead) * mag;
        return this;
    }
    angleBetweenRads(x, y) {
        var v1 = this.copy(), v2;
        if (x instanceof Vector2) {
            v2 = x.copy();
        } else {
            v2 = new Vector2(x, y);
        };
        var angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
        return angle;
    }
    angleBetweenDegs(x, y) {
        var r = this.angleBetweenRads(x, y);
        var d = (r * 180) / Math.PI;
        return d;
    }
    lerp(x, y, amt) {
        if (x instanceof Vector2) {
            return this.lerp(x.x, x.y, y);
        }
        if (amt > 1.0) { amt = 1.0 };
        this.x += (x - this.x) * amt;
        this.y += (y - this.y) * amt;
        return this;
    }
    equals(x, y) {
        var a, b;
        if (x instanceof Vector2) {
            a = x.x || 0;
            b = x.y || 0;
        } else {
            a = x || 0;
            b = y || 0;
        }

        return this.x === a && this.y === b;
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    mimic(other) {
        let v = other.copy()
        this.x = v.x
        this.y = v.y
        return this
    }
}

class Response {
    constructor() {
        this.a = null
        this.b = null
        this.overlapN = new Vector2()
        this.overlapV = new Vector2()
        this.clear()
    }

    clear() {
        this.aInB = true
        this.bInA = true
        this.overlap = Number.MAX_VALUE
        return this
    }
}

class QuadTree {
    constructor(rect, n, max_depth, depth) {
        this.bounds = rect
        this.size = n
        this.max_depth = max_depth
        this.depth = depth
        this.objects = []
    }

    split() {
        let midX = this.bounds.bounds.min.x + (this.bounds.bounds.max.x - this.bounds.bounds.min.x) / 2,
            midY = this.bounds.bounds.min.y + (this.bounds.bounds.max.y - this.bounds.bounds.min.y) / 2
        let rectTL = new Bounds(this.bounds.bounds.min.x, this.bounds.bounds.min.y, midX, midY)
        let rectTR = new Bounds(midX, this.bounds.bounds.min.y, this.bounds.bounds.max.x, midY)
        let rectBL = new Bounds(midX, midY, this.bounds.bounds.max.x, this.bounds.bounds.max.y)
        let rectBR = new Bounds(this.bounds.bounds.min.x, midY, midX, this.bounds.bounds.max.y)
        this.boxTL = new QuadTree(rectTL, this.size, this.max_depth, this.depth + 1)
        this.boxTR = new QuadTree(rectTR, this.size, this.max_depth, this.depth + 1)
        this.boxBL = new QuadTree(rectBL, this.size, this.max_depth, this.depth + 1)
        this.boxBR = new QuadTree(rectBR, this.size, this.max_depth, this.depth + 1)
        for (let o of this.objects) {
            this.boxTL.append(o)
            this.boxTR.append(o)
            this.boxBL.append(o)
            this.boxBR.append(o)
        }
        this.objects = []
    }

    append(object) {
        if (!object instanceof Collider) {
            return false
        }
        if (!Bounds.Intersect(this.bounds, object.bounds)) {
            return false
        }
        if (this.objects.length < this.size && !this.isSplit) {
            this.objects.push(object)
        } else {
            if (!this.isSplit && this.depth < this.max_depth) {
                this.split()
                this.isSplit = true
            } else {
                this.objects.push(object)
                //console.log(this.objects)
                return
            }
            this.boxTL.append(object)
            this.boxTR.append(object)
            this.boxBL.append(object)
            this.boxBR.append(object)
        }
    }
    query(range, type = null) {
        let result = []
        if (!Bounds.Intersect(this.bounds, range)) return result


        for (let o of this.objects) {
            if (Bounds.Intersect(range, o.bounds)) {
                if (type) {
                    if (type == "Bot") {
                        if (o instanceof Bot) {
                            result.push(o)
                        }
                    }
                } else {
                    result.push(o)
                }
            }
        }
        if (!this.isSplit) return result

        result = result.concat(this.boxTL.query(range))
        result = result.concat(this.boxTR.query(range))
        result = result.concat(this.boxBL.query(range))
        result = result.concat(this.boxBR.query(range))
        // let tl = this.boxTL.query(range)
        // let tr = this.boxTR.query(range)
        // let bl = this.boxBL.query(range)
        // let br = this.boxBR.query(range)
        // tl.forEach(result.add, result)
        // tr.forEach(result.add, result)
        // bl.forEach(result.add, result)
        // br.forEach(result.add, result)
        return result
    }

    clear() {
        this.objects = [];
        if (this.isSplit) {
            this.boxTL.clear()
            this.boxTR.clear()
            this.boxBL.clear()
            this.boxBR.clear()
        }
        this.boxTL = undefined
        this.boxTR = undefined
        this.boxBL = undefined
        this.boxBR = undefined
        this.isSplit = false
    }
}

class Bounds {
    constructor(minX, minY, maxX, maxY) {
        this.min = new Vector2(minX, minY)
        this.max = new Vector2(maxX, maxY)
    }
    static Intersect(a, b) {
        return (a.min.x <= b.max.x && a.max.x >= b.min.x
            && a.max.y >= b.min.y && a.min.y <= b.max.y)
    }
    static ContainsPoint(bounds, point) {
        return point.x >= bounds.min.x && point.x <= bounds.max.x && point.y >= bounds.min.y && point.y <= bounds.max.y
    }
}

class GameObject {
    manager = new ComponentManager(this)
    constructor() {
        this.manager.parent = this
    }
    addComponent = this.manager.addComponent
    getComponent = this.manager.getComponent
    removeComponent = this.manager.removeComponent
}

class ComponentManager {
    constructor(parent) {
        this.parent = parent
    }
    components = {}
    // addComponent = (component) => {
    //     if (component instanceof Component) {
    //         this.components[component.constructor.name] = component
    //         this.components[component.constructor.name].setGameObject(this.parent)
    //     } else {
    //         console.error('Error: Component non-existing')
    //     }
    // }
    addComponent = (component, ...args) => {
        if (typeof component == 'function') {
            let comp = new component.prototype.constructor(this.parent, ...args)
            this.components[comp.constructor.name] = comp
        } else {
            console.error('Error: Component non-existing')
        }
    }
    getComponent = (identifier) => {
        return this.components[identifier.name]
    }
    removeComponent = (identifier) => {
        this.components[identifier.name].removal()
        delete this.components[identifier.name]
    }
}

class PhysicsObject extends GameObject {
    constructor() {
        this.addComponent(new Transform())
        this.addComponent(new PhysicsComponent())
    }
}

class Component {
    gameObject
    constructor(object) {
        this.gameObject = object
        this.getComponent = this.gameObject.getComponent
    }
    // set gameObject(gameObject) {
    //     this.gameObject = gameObject
    // }
    // get gameObject() {
    //     return this.gameObject
    // }
    removal() {
        return null
    }
}

class Transform extends Component {
    constructor(parent) {
        super(parent)
    }
    position = new Vector2()
    rotation = 0
}

class PhysicsComponent extends Component {
    gravity = new Vector2(0, 0.1)
    mass = 1
    _accel = new Vector2()
    _vel = new Vector2()
    constructor(parent) {
        super(parent)
        Physics.updates.push(this)

        this.transform = this.getComponent(Transform)
    }

    applyForce(force) {
        this._accel.add(force.div(this.mass))
    }
    update() {
        this.applyForce(this.gravity)

        this._vel.add(this._accel)
        this.transform.position.add(this._vel)

        let col = this.getComponent(Collider)
        if (col) Collider.UpdateBounds(col.bounds, col.points, this.transform)

        this._accel.mult(0)
    }



    set acceleration(acceleration) {
        this._accel = acceleration
    }
    get acceleration() {
        return this._accel
    }
    set velocity(velocity) {
        this._vel = velocity
    }
    get velocity() {
        return this._vel
    }

}

class Collider extends Component {
    constructor(parent, points) {
        super(parent)
        this.points = points || []
        this.bounds = new Bounds()
        this.transform = this.getComponent(Transform)
        Collider.UpdateBounds(this.bounds, this.points, this.transform)
        World.Colliders.push(this)
    }
    removal() {
        for (let i = World.Colliders.length - 1; i >= 0; i--) {
            if (World.Colliders[i] === this) {
                return World.Colliders.splice(i, 1)
            }
        }
    }
    static UpdateBounds(bounds, points_i, transform) {
        let xMin = Number.MAX_VALUE,
            xMax = Number.MIN_VALUE,
            yMin = Number.MAX_VALUE,
            yMax = Number.MIN_VALUE

        let points = points_i


        for (let point of points) {
            if (point.x < xMin) xMin = point.x
            if (point.x > xMax) xMax = point.x
            if (point.y < yMin) yMin = point.y
            if (point.y > yMax) yMax = point.y
        }

        if (transform) {
            xMin += transform.position.x
            xMax += transform.position.x
            yMin += transform.position.y
            yMax += transform.position.y
        }

        bounds.min.x = xMin
        bounds.min.y = yMin
        bounds.max.x = xMax
        bounds.max.y = yMax
    }
}

class PolygonCollider extends Collider {
    constructor(parent, points) {
        super(parent, points)
        this.setPoints(points)
    }
    setPoints(points) {
        let lengthChanged = !this.points || this.points.length !== points.length
        if (lengthChanged) {
            let i
            let calcPoints = this.calcPoints = []
            let edges = this.edges = []
            let normals = this.normals = []

            for (i = 0; i < points.length; i++) {
                let p1 = points[i]
                let p2 = i < points.length - 1 ? points[i + 1] : points[0]
                if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
                    points.splice(i, 1)
                    i -= 1
                    continue
                }
                calcPoints.push(new Vector2())
                edges.push(new Vector2())
                normals.push(new Vector2())
            }
        }
        this.points = points


        this._recalc()
        return this
    }
    _recalc() {
        let calcPoints = this.calcPoints;
        let edges = this.edges;
        let normals = this.normals;
        let points = this.points;
        let offset = this.offset;
        let angle = this.angle;
        let len = points.length;
        console.log(len)
        for (let i = 0; i < len; i++) {
            console.log(calcPoints[i])
            let calcPoint = calcPoints[i].mimic(points[i])
            calcPoint.x += offset.x
            calcPoint.y += offset.y
            if (angle != 0) {
                calcPoint.setRotation(angle)
            }
        }

        for (let i = 0; i < len; i++) {
            let p1 = calcPoints[i]
            let p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0]
            let e = edges[i].mimic(p2).sub(p1)
            normals[i].mimic(e).perp().normalize()
        }

        return this
    }
    setAngle(angle) {
        this.angle = angle
        this._recalc()
        return this
    }

    setOffset(offset) {
        this.offset = offset
        this._recalc()
        return this
    }

    rotate(angle) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].setRotation(angle)
        }
        this._recalc()
        return this
    }

    translate(x, y) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x += x
            this.points[i].y += y
        }
        this._recalc()
        return this
    }
}

class Graphic extends Component {
    constructor(parent) {
        super(parent)
        this.graphic = new PIXI.Graphics()
        Renderer.updates.push(this)
    }
    DrawAABB(bounds, solid, color = 0xffffff) {
        let width = bounds.max.x - bounds.min.x
        let height = bounds.max.y - bounds.min.y
        this.graphic.clear()
        if (solid) {
            this.graphic.beginFill(color)
        } else {
            this.graphic.lineStyle(4, color)
        }
        this.graphic.drawRect(0, 0, width, height)
        this.graphic.endFill()
        World.stage.addChild(this.graphic)
    }
    DrawPolygon(points, solid, color = 0xffffff) {
        let p_points = []
        for (let point of points) {
            p_points.push(new PIXI.Point(point.x, point.y))
        }
        this.graphic.clear()
        if (solid) {
            this.graphic.beginFill(color)
        } else {
            this.graphic.lineStyle(4, color)
        }
        this.graphic.drawPolygon(p_points)
        this.graphic.endFill()
        World.stage.addChild(this.graphic)
    }
    removal() {
        World.stage.removeChild(this.graphic)
        for (let i = Renderer.updates.length; i >= 0; i--) {
            if (Renderer.updates[i] === this) {
                return Renderer.updates.splice(i, 1)
            }
        }
    }
}

const World = {
    stage: undefined,
    size: new Vector2(400, 400),
    Colliders: []
}
World.bounds = new Bounds(0, 0, World.size.x, World.size.y)
World.tree = new QuadTree(World.bounds, 2, 10, 0)

const Physics = {
    gravity: 9.81,
    updates: [],
    frameRate: 60,

    fpsInterval: 1000 / 60,
    lastDrawTime: 0,
    frameCount: 0,
    //lastSampleTime,
    requestID: undefined,
    response: new Response(),
    beginLoop: function () {
        Physics.fpsInterval = 1000 / Physics.frameRate;
        Physics.lastDrawTime = performance.now();
        //this.lastSampleTime = lastDrawTime;
        Physics.frameCount = 0;

        Physics.loop();
    },
    loop: function (now) {
        Physics.requestID = requestAnimationFrame(Physics.loop);

        let elapsed = now - Physics.lastDrawTime;

        // if enough time has elapsed draw the next frame
        if (elapsed > Physics.fpsInterval) {
            Physics.lastDrawTime = now - (elapsed % Physics.fpsInterval);
            ///////////Do Stuff//////////
            World.tree.clear()
            for (let col of World.Colliders) {
                World.tree.append(col)
            }
            for (let obj of Physics.updates) {
                obj.update()
            }
            for (let obj of World.Colliders) {
                // let range = new Bounds(obj.bounds.min.x - 500, obj.bounds.min.y - 500, obj.bounds.max.x + 500, obj.bounds.max.y + 500)
                // let colliders = World.tree.query(range)
                // if (colliders.length <= 0) continue
                // for (let col of colliders) {
                //     if (col === obj) continue
                //     if (Bounds.Intersect(obj.bounds, col.bounds)) {
                //         console.log('objects colliding')
                //         let physics = obj.getComponent(PhysicsComponent)
                //         console.log(physics)
                //         if (physics) {
                //             physics.acceleration.mult(0)
                //             physics.velocity.mult(0)
                //             physics.gravity.mult(0)
                //             console.log(physics)
                //         }
                //     }
                // }
                for (let col of World.Colliders) {
                    if (obj === col) continue

                    if (Bounds.Intersect(obj.bounds, col.bounds)) {
                        Physics.response.clear()
                        if (SAT.testPolygonPolygon(obj, col, Physics.response)) {
                            obj.transform.position.sub(Physics.response.overlapV)
                        }
                        // let physics = obj.getComponent(PhysicsComponent)
                        // if (physics) {
                        //     physics.acceleration.mult(0)
                        //     physics.velocity.mult(0)
                        //     physics.gravity.mult(0)
                        // }
                    }
                }
            }

            //////////Stop Stuff/////////
            Physics.frameCount++;
        }
    },
    endLoop: function () {
        cancelAnimationFrame(Physics.requestID)
    }
}

const Renderer = {
    updates: [],
    frameRate: 60,

    fpsInterval: 1000 / 60,
    lastDrawTime: 0,
    frameCount: 0,
    //lastSampleTime,
    requestID: undefined,
    beginLoop: function () {
        Renderer.fpsInterval = 1000 / Renderer.frameRate;
        Renderer.lastDrawTime = performance.now();
        //this.lastSampleTime = lastDrawTime;
        Renderer.frameCount = 0;

        Renderer.loop();
    },
    loop: function (now) {
        Renderer.requestID = requestAnimationFrame(Renderer.loop);

        let elapsed = now - Renderer.lastDrawTime;

        // if enough time has elapsed draw the next frame
        if (elapsed > Renderer.fpsInterval) {
            Renderer.lastDrawTime = now - (elapsed % Renderer.fpsInterval);
            ///////////Do Stuff//////////

            for (let obj of Renderer.updates) {
                let transform = obj.getComponent(Transform)
                let graphic = obj.getComponent(Graphic)
                graphic.graphic.position = transform.position
            }
            //////////Stop Stuff/////////
            Renderer.frameCount++;
        }
    },
    endLoop: function () {
        cancelAnimationFrame(Renderer.requestID)
    }
}

const SAT = {}

class Circle {
    constructor(pos, r) {
        this.position = pos || new Vector2()
        this.r = r || 0
        this.offset = new Vector2()
    }
    getAABBAsBox() {
        let r = this.r
        let corner = this.position.copy().add(this.offset).sub(new Vector2(r, r))
        return new Box(corner, r * 2, r * 2)
    }
    getAABB() {
        return this.getAABBAsBox().toPolygon()
    }
    setOffset(value) {
        this.offset = value
        return this
    }
}

var T_VECTORS = []
for (let i = 0; i < 10; i++) T_VECTORS.push(new Vector2())
var T_ARRAYS = []
for (let i = 0; i < 5; i++) T_ARRAYS.push([])
var T_RESPONSE = new Response()

SAT.flattenPointsOn = function (points, normal, result) {
    let min = Number.MAX_VALUE
    let max = -Number.MAX_VALUE
    for (let i = 0; i < points.length; i++) {
        let dot = points[i].dot(normal)
        if (dot < min) { min = dot }
        if (dot > max) { max = dot }
    }
    result[0] = min; result[1] = max
}

SAT.isSeparatingAxis = function (aPos, bPos, aPoints, bPoints, axis, response) {
    let rangeA = []
    let rangeB = []

    let offsetV = bPos.copy().sub(aPos)
    let projectedOffset = offsetV.dot(axis)

    SAT.flattenPointsOn(aPoints, axis, rangeA)
    SAT.flattenPointsOn(bPoints, axis, rangeB)

    //rangeA[0] -= projectedOffset2
    //rangeA[1] -= projectedOffset2
    rangeB[0] += projectedOffset
    rangeB[1] += projectedOffset
    //console.log(rangeB)

    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        return true
    }

    if (response) {
        let overlap = 0

        if (rangeA[0] < rangeB[0]) {
            response.aInB = false
            if (rangeA[1] < rangeB[1]) {
                overlap = rangeA[1] - rangeB[0]
                response.bInA = false
            } else {
                let option1 = rangeA[1] - rangeB[0]
                let option2 = rangeB[1] - rangeA[0]
                overlap = option1 < option2 ? option1 : -option2
            }
        } else {
            response.bInA = false
            if (rangeA[1] > rangeB[1]) {
                overlap = rangeA[0] - rangeB[1]
                response.aInB = false
            } else {
                let option1 = rangeA[1] - rangeB[0]
                let option2 = rangeB[1] - rangeA[0]
                overlap = option1 < option2 ? option1 : -option2
            }
        }

        let absOverlap = Math.abs(overlap)
        if (absOverlap < response.overlap) {
            response.overlap = absOverlap
            response.overlapN.mimic(axis)
            if (overlap < 0) {
                response.overlapN.reverse()
            }
        }
    }
    return false
}

var LEFT_VORONOI_REGION = -1
var MIDDLE_VORONOI_REGION = 0
var RIGHT_VORONOI_REGION = 1

SAT.voronoiRegion = function (line, point) {
    let len2 = line.len2()
    let dp = point.dot(line)

    if (dp < 0)
        return LEFT_VORONOI_REGION
    else if (dp > len2)
        return RIGHT_VORONOI_REGION
    else
        return MIDDLE_VORONOI_REGION
}

SAT.pointInCircle = function (p, c) {
    let differenceV = T_VECTORS.pop().mimic(p).sub(c.transform.position).sub(c.offset)
    let radiusSq = c.r * c.r
    let distanceSq = differenceV.len2()
    T_VECTORS.push(differenceV)
    return distanceSq <= radiusSq
}

SAT.pointInPolygon = function (p, poly) {
    TEST_POINT.position.mimic(p)
    T_RESPONSE.clear()
    let result = SAT.testPolygonPolygon(TEST_POINT, poly, T_RESPONSE)
    if (result) {
        result = T_RESPONSE.aInB
    }
    return result
}

SAT.testCircleCircle = function (a, b, response) {
    let differenceV = T_VECTORS.pop().mimic(b.transform.position).add(b.offset).sub(a.transform.position).sub(a.offset)
    let totalRadius = a.r + b.r
    let totalRadiusSq = totalRadius * totalRadius
    let distanceSq = differenceV.len2()

    if (distanceSq > totalRadiusSq) {
        T_VECTORS.push(differenceV)
        return false
    }

    if (response) {
        let dist = Math.sqrt(distanceSq)
        response.a = a
        response.b = b
        response.overlap = totalRadius - dist
        response.overLapN.mimic(differenceV.normalize())
        response.overLapV.mimic(differenceV).mult(response.overlap)
        response.aInB = a.r <= b.r && dist <= b.r - a.r
        response.bInA = b.r <= a.r && dist < a.r - b.r
    }
    T_VECTORS.push(differenceV)
    return true
}

SAT.testPolygonCircle = function (polygon, circle, response) {
    var circlePos = T_VECTORS.pop().copy(circle.pos).add(circle.offset).sub(polygon.transform.position);
    var radius = circle.r;
    var radius2 = radius * radius;
    var points = polygon.calcPoints;
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();

    for (var i = 0; i < len; i++) {
        var next = i === len - 1 ? 0 : i + 1;
        var prev = i === 0 ? len - 1 : i - 1;
        var overlap = 0;
        var overlapN = null;

        edge.copy(polygon.edges[i]);
        point.copy(circlePos).sub(points[i]);

        if (response && point.len2() > radius2) {
            response.aInB = false;
        }

        var region = SAT.voronoiRegion(edge, point);
        if (region === LEFT_VORONOI_REGION) {
            edge.copy(polygon.edges[prev]);
            var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
            region = SAT.voronoiRegion(edge, point2);
            if (region === RIGHT_VORONOI_REGION) {
                var dist = point.len();
                if (dist > radius) {
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    T_VECTORS.push(point2);
                    return false;
                } else if (response) {
                    response.bInA = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                }
            }
            T_VECTORS.push(point2);
        } else if (region === RIGHT_VORONOI_REGION) {
            edge.copy(polygon.edges[next]);
            point.copy(circlePos).sub(points[next]);
            region = SAT.voronoiRegion(edge, point);
            if (region === LEFT_VORONOI_REGION) {
                var dist = point.len();
                if (dist > radius) {
                    T_VECTORS.push(circlePos);
                    T_VECTORS.push(edge);
                    T_VECTORS.push(point);
                    return false;
                } else if (response) {
                    response.bInA = false;
                    overlapN = point.normalize();
                    overlap = radius - dist;
                }
            }
        } else {
            var normal = edge.perp().normalize()
            var dist = point.dot(normal);
            var distAbs = Math.abs(dist);
            if (dist > 0 && distAbs > radius) {
                T_VECTORS.push(circlePos);
                T_VECTORS.push(normal);
                T_VECTORS.push(point);
                return false;
            } else if (response) {
                overlapN = normal;
                overlap = radius - dist;
                if (dist >= 0 || overlap < 2 * radius) {
                    response.bInA = false;
                }
            }
        }
        if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
            response.overlap = overlap;
            response.overlapN.copy(overlapN);
        }
    }

    if (response) {
        response.a = polygon;
        response.b = circle;
        response.overlapV.copy(response.overlapN).scale(response.overlap);
    }
    T_VECTORS.push(circlePos);
    T_VECTORS.push(edge);
    T_VECTORS.push(point);
    return true;
}

SAT.testCirclePolygon = function (circle, polygon, response) {
    var result = SAT.testPolygonCircle(polygon, circle, response)
    if (result && response) {
        let a = response.a
        let aInB = response.aInB
        response.overLapN.reverse()
        response.overlapV.reverse()
        response.a = response.b
        response.b = a
        response.aInB = response.bInA
        response.bInA = aInB
    }
    return result
}

SAT.testPolygonPolygon = function (a, b, response) {
    let aPoints = a.calcPoints
    let bPoints = b.calcPoints

    //console.log(a.normals)
    for (let i = 0; i < a.normals.length; i++) {
        if (SAT.isSeparatingAxis(a.transform.position, b.transform.position, aPoints, bPoints, a.normals[i], response)) {
            return false
        }
    }

    for (let i = 0; i < b.normals.length; i++) {
        if (SAT.isSeparatingAxis(a.transform.position, b.transform.position, aPoints, bPoints, b.normals[i], response)) {
            return false
        }
    }

    if (response) {
        response.a = a
        response.b = b
        response.overlapV.mimic(response.overlapN).mult(response.overlap)
    }
    return true
}