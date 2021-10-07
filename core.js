const Physics = {
    gravity: 9.81,
    updates: [],
    frameRate: 60,

    fpsInterval: 1000 / 60,
    lastDrawTime: 0,
    frameCount: 0,
    //lastSampleTime,
    requestID: undefined,
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

            for (let obj of Physics.updates) {
                obj.update()
            }

            //////////Stop Stuff/////////
            Physics.frameCount++;
        }
    },
    endLoop: function () {
        cancelAnimationFrame(Physics.requestID)
    }
}

class GameObject {
    manager = new ComponentManager()
    constructor() {
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
    addComponent = (component) => {
        if (component instanceof Component) {
            this.components[component.constructor.name] = component
            this.components[component.constructor.name].gameObject = this.parent
        } else {
            console.error('Error: Component non-existing')
        }
    }
    getComponent = (identifier) => {
        return this.components[identifier]
    }
    removeComponent = (identifier) => {
        delete this.components[identifier]
    }
}

class PhysicsObject extends GameObject {
    constructor() {
        this.addComponent(new Transform())
        this.addComponent(new PhysicsComponent())
    }
}

class Component {
    _gameObject
    set gameObject(gameObject) {
        this._gameObject = gameObject
    }
    get gameObject() {
        return this._gameObject
    }
}

class Transform extends Component {
    static name = 'Transform'
    position = new Vector2()
    rotation = 0
}

class PhysicsComponent extends Component {
    static name = 'PhysicsComponent'

    _accel = new Vector2()
    _vel = new Vector2()
    mass = 0

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

class BoxCollider extends Component {
    points = []
    constructor(w, h, offset) {
        this.width = w
        this.height = h
        this.offset = offset
        calculatePoints()
    }
    calculatePoints() {
        points[0] = Vector2.add(new Vector2(-this.width / 2, -this.height / 2), this.offset)
        points[1] = Vector2.add(new Vector2(this.width / 2, this.height / 2), this.offset)
        points[2] = Vector2.add(new Vector2(this.width / 2, -this.height / 2), this.offset)
        points[3] = Vector2.add(new Vector2(-this.width / 2, this.height / 2), this.offset)
    }
}



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

class Polygon {
    constructor(pos, points, width, height, draw) {
        this.position = pos || new Vector2()
        this.angle = 0
        this.offset = new Vector2()
        this.draw = draw || false
        this.setPoints(points || [])

        if (width) this.width = width
        if (height) this.height = height
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
        if (this.draw) {
            if (!this.graphic) {
                this.graphic = new PIXI.Graphics()
                viewport.addChild(this.graphic)
            }

            this.graphic.clear()
            this.graphic.position.set(this.position.x, this.position.y)
            this.graphic.lineStyle(4, 0xffffff)
            this.graphic.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
            for (let pt of this.points) {
                this.graphic.lineTo(pt.x, pt.y)
            }
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

    _recalc() {
        let calcPoints = this.calcPoints;
        let edges = this.edges;
        let normals = this.normals;
        let points = this.points;
        let offset = this.offset;
        let angle = this.angle;
        let len = points.length;

        for (let i = 0; i < len; i++) {
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

    getAABBAsBox() {
        let points = this.calcPoints
        let len = points.length;
        let xMin = points[0].x
        let yMin = points[0].y
        let xMax = points[0].x
        let yMax = points[0].y
        for (let i = 1; i < len; i++) {
            let point = points[i];
            if (point.x < xMin) {
                xMin = point.x
            }
            else if (point.x > xMax) {
                xMax = point.x
            }
            if (point.y < yMin) {
                yMin = point.y
            }
            else if (point.y > yMax) {
                yMax = point.y
            }
        }
        return new Box(this.position.copy().add(new Vector2(xMin, yMin)), xMax - xMin, yMax - yMin)
    }

    getAABB() {
        return this.getAABBAsBox().toPolygon()
    }

    getCentroid() {
        let points = this.calcPoints
        let cx = 0
        let cy = 0
        let ar = 0
        for (let i = 0; i < points.length; i++) {
            let p1 = points[i]
            let p2 = i === len - 1 ? points[0] : points[i + 1]
            let a = p1.x * p2.y - p2.x * p1.y
            cx += (p1.x + p2.x) * a
            cy += (p1.y + p2.y) * a
            ar += a
        }
        ar = ar * 3
        cx = cx / ar
        cy = cy / ar
        return new Vector2(cx, cy)
    }
}

class Box {
    constructor(pos, w, h, draw) {
        this.position = pos || new Vector2()
        this.width = w || 0
        this.height = h || 0

        if (draw) {
            this.draw()
        }
        //console.log(this)
    }

    toPolygon() {
        let pos = this.position
        let w = this.width
        let h = this.height
        return new Polygon(new Vector2(pos.x, pos.y), [
            new Vector2(), new Vector2(w, 0),
            new Vector2(w, h), new Vector2(0, h)
        ], w, h)
    }
    intersectsRect(other) {
        return !(other.position.x > this.position.x + this.width ||
            other.position.x + other.width < this.position.x ||
            other.position.y > this.position.y + this.height ||
            other.position.y + other.height < this.position.y)
    }
    draw() {
        this.box = new PIXI.Graphics()
        this.box.lineStyle(3, 0xffffff)
        this.box.drawRect(0, 0, this.width, this.height)
        viewport.addChild(this.box)
        //this.box.zIndex = 20
        this.box.position.set(this.position.x, this.position.y)
    }
}

class radius {
    position
    constructor(x, y, r) {
        this.position = new Vector2(x, y)
        this.r = r
    }
    within(point) {
        let dist = Math.sqrt(Math.pow((point.position.x - this.position.x), 2) + Math.pow((point.position.y - this.position.y), 2))
        return dist <= (point.size + this.r)
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
        let rectTL = new Box(new Vector2(this.bounds.position.x, this.bounds.position.y), this.bounds.width / 2, this.bounds.height / 2)
        let rectTR = new Box(new Vector2(this.bounds.position.x + this.bounds.width / 2, this.bounds.position.y), this.bounds.width / 2, this.bounds.height / 2)
        let rectBL = new Box(new Vector2(this.bounds.position.x, this.bounds.position.y + this.bounds.height / 2), this.bounds.width / 2, this.bounds.height / 2)
        let rectBR = new Box(new Vector2(this.bounds.position.x + this.bounds.width / 2, this.bounds.position.y + this.bounds.height / 2), this.bounds.width / 2, this.bounds.height / 2)
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
        if (!object.bounds) {
            return false
        }
        if (!this.bounds.intersectsRect(object.bounds)) {
            //console.log(object)
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
        if (!this.bounds.intersectsRect(range)) return result


        for (let o of this.objects) {
            if (range.intersectsRect(o.bounds)) {
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

var T_VECTORS = []
for (let i = 0; i < 10; i++) T_VECTORS.push(new Vector2())
var T_ARRAYS = []
for (let i = 0; i < 5; i++) T_ARRAYS.push([])
var T_RESPONSE = new Response()
var TEST_POINT = new Box(new Vector2(), 0.000001, 0.000001).toPolygon()

function flattenPointsOn(points, normal, result) {
    let min = Number.MAX_VALUE
    let max = -Number.MAX_VALUE
    for (let i = 0; i < points.length; i++) {
        let dot = points[i].dot(normal)
        if (dot < min) { min = dot }
        if (dot > max) { max = dot }
    }
    result[0] = min; result[1] = max
}

function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    let rangeA = []
    let rangeB = []

    let offsetV = bPos.copy().sub(aPos)
    let projectedOffset = offsetV.dot(axis)

    //let offsetV2 = aPos.copy().sub(bPos)
    //let projectedOffset2 = offsetV2.dot(axis)

    flattenPointsOn(aPoints, axis, rangeA)
    flattenPointsOn(bPoints, axis, rangeB)

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

function voronoiRegion(line, point) {
    let len2 = line.len2()
    let dp = point.dot(line)

    if (dp < 0)
        return LEFT_VORONOI_REGION
    else if (dp > len2)
        return RIGHT_VORONOI_REGION
    else
        return MIDDLE_VORONOI_REGION
}

function pointInCircle(p, c) {
    let differenceV = T_VECTORS.pop().mimic(p).sub(c.position).sub(c.offset)
    let radiusSq = c.r * c.r
    let distanceSq = differenceV.len2()
    T_VECTORS.push(differenceV)
    return distanceSq <= radiusSq
}

function pointInPolygon(p, poly) {
    TEST_POINT.position.mimic(p)
    T_RESPONSE.clear()
    let result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE)
    if (result) {
        result = T_RESPONSE.aInB
    }
    return result
}

function testCircleCircle(a, b, response) {
    let differenceV = T_VECTORS.pop().mimic(b.position).add(b.offset).sub(a.position).sub(a.offset)
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

function testPolygonCircle(polygon, circle, response) {
    var circlePos = T_VECTORS.pop().copy(circle.pos).add(circle.offset).sub(polygon.pos);
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

        var region = voronoiRegion(edge, point);
        if (region === LEFT_VORONOI_REGION) {
            edge.copy(polygon.edges[prev]);
            var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
            region = voronoiRegion(edge, point2);
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
            region = voronoiRegion(edge, point);
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

function testCirclePolygon(circle, polygon, response) {
    var result = testPolygonCircle(polygon, circle, response)
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

function testPolygonPolygon(a, b, response) {
    let aPoints = a.calcPoints
    let bPoints = b.calcPoints

    //console.log(a.normals)
    for (let i = 0; i < a.normals.length; i++) {
        if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i], response)) {
            return false
        }
    }

    for (let i = 0; i < b.normals.length; i++) {
        if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[i], response)) {
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