
const canvas = document.getElementById('canvas');

const app = new PIXI.Application({
    view: canvas,
    width: 700,
    height: 700,
    backgroundColor: 0xffffff
});

const { stage, view, ticker, renderer } = app;

document.body.appendChild(view);

const shader = PIXI.Shader.from(`

    precision mediump float;
    attribute vec2 aVertexPosition;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    void main() {
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`,

    `precision mediump float;

    void main() {
        gl_FragColor = vec4(0.5, .2, .2, 1.0);
    }

`);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

class Level extends Component {
    static default_data = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    constructor(parent, data) {
        super(parent)
        this.raw = data || Level.default_data
        this.hitbox = []
        this.geometries = []
        Level.generateLevelCollidersAndMesh(this.raw, this.hitbox, this.geometries)
        this.collider = this.gameObject.addComponent(TerrainCollider, this.hitbox)
        this.renderer = this.gameObject.addComponent(TerrainRenderer, this.geometries)
        this.object = Level.objectsFromMatrix(this.raw)
    }

    static getTileState(a, b, c, d) {
        return a * 8 + b * 4 + c * 2 + d * 1;
    }
    static getMatrixValues(matrix, x, y) {
        if (x < 0 || x > matrix.length - 1 || y < 0 || y > matrix[0].length - 1) {
            return -1
        }
        return matrix[x][y]
    }
    static generateLevelCollidersAndMesh(data, hitbox, geometries) {
        let matrix = data
        const TILE_SIZE = renderer.width > renderer.height ? Math.floor(renderer.width / matrix.length) : Math.floor(renderer.height / matrix.length)
        for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
                var pos = new Vector2(x * TILE_SIZE, y * TILE_SIZE),
                    a = new Vector2(pos.x, pos.y - TILE_SIZE / 2),
                    b = new Vector2(pos.x + TILE_SIZE / 2, pos.y - TILE_SIZE),
                    c = new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE / 2),
                    d = new Vector2(pos.x + TILE_SIZE / 2, pos.y)

                var p1 = Level.getMatrixValues(matrix, x, y),
                    p2 = Level.getMatrixValues(matrix, x, y - 1),
                    p3 = Level.getMatrixValues(matrix, x + 1, y - 1),
                    p4 = Level.getMatrixValues(matrix, x + 1, y)

                let h = 0,
                    j = 0,
                    k = 0,
                    l = 0

                if (p1 == 1) h = 1
                if (p2 == 1) j = 1
                if (p3 == 1) k = 1
                if (p4 == 1) l = 1

                var mode = Level.getTileState(h, j, k, l);

                switch (mode) {
                    //1
                    case 8:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, a.x, a.y, d.x, d.y
                            ]);
                        geometries.push(g);
                        //console.log(mode);
                        // hitbox.push(a);
                        // hitbox.push(d);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(a.x, a.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;

                    //2
                    case 4:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                a.x, a.y, pos.x, pos.y - TILE_SIZE, b.x, b.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(a);
                        // hitbox.push(b);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(a.x, a.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(b.x, b.y)
                        ])
                        break;

                    //3
                    case 12:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, pos.x, pos.y - TILE_SIZE, b.x, b.y,
                                pos.x, pos.y, d.x, d.y, b.x, b.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(b);
                        // hitbox.push(d);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(b.x, b.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;

                    //4
                    case 2:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                b.x, b.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE, c.x, c.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(b);
                        // hitbox.push(c);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(b.x, b.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(c.x, c.y)
                        ])
                        break;

                    //5
                    case 10:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, a.x, a.y, b.x, b.y,
                                pos.x, pos.y, b.x, b.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE,
                                pos.x, pos.y, d.x, d.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE,
                                d.x, d.y, c.x, c.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE
                            ]);
                        geometries.push(g);
                        // hitbox.push(a);
                        // hitbox.push(b);
                        // hitbox.push(c);
                        // hitbox.push(d);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(a.x, a.y),
                            new Vector2(b.x, b.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(c.x, c.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;

                    //6
                    case 6:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                a.x, a.y, pos.x, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y - TILE_SIZE,
                                a.x, a.y, c.x, c.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE
                            ]);
                        geometries.push(g);
                        // hitbox.push(a);
                        // hitbox.push(c);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(a.x, a.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(c.x, c.y)
                        ])
                        break;

                    //7
                    case 14:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, pos.x, pos.y - TILE_SIZE, d.x, d.y,
                                c.x, c.y, pos.x, pos.y - TILE_SIZE, d.x, d.y,
                                pos.x, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y - TILE_SIZE, c.x, c.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(c);
                        // hitbox.push(d);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(c.x, c.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;

                    //8
                    case 1:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                d.x, d.y, c.x, c.y, pos.x + TILE_SIZE, pos.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(c);
                        // hitbox.push(d);
                        //console.log(mode);
                        hitbox.push([
                            new Vector2(c.x, c.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;

                    //9
                    case 9:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, a.x, a.y, pos.x + TILE_SIZE, pos.y,
                                c.x, c.y, a.x, a.y, pos.x + TILE_SIZE, pos.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(a);
                        // hitbox.push(c);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(a.x, a.y),
                            new Vector2(c.x, c.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y)
                        ])
                        break;

                    //10
                    case 5:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                a.x, a.y, d.x, d.y, pos.x + TILE_SIZE, pos.y,
                                a.x, a.y, pos.x, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y,
                                pos.x, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y, c.x, c.y,
                                pos.x, pos.y - TILE_SIZE, b.x, b.y, c.x, c.y
                            ]);
                        geometries.push(g);

                        // hitbox.push(b);
                        // hitbox.push(c);
                        // hitbox.push(a);
                        // hitbox.push(d);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(a.x, a.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(b.x, b.y),
                            new Vector2(c.x, c.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;
                    //11
                    case 13:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, pos.x, pos.y - TILE_SIZE, b.x, b.y,
                                c.x, c.y, pos.x, pos.y, b.x, b.y,
                                pos.x, pos.y, pos.x + TILE_SIZE, pos.y, c.x, c.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(b);
                        // hitbox.push(c);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(b.x, b.y),
                            new Vector2(c.x, c.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y)
                        ])
                        break;

                    //12
                    case 3:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                d.x, d.y, b.x, b.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE,
                                d.x, d.y, pos.x + TILE_SIZE, pos.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE
                            ]);
                        geometries.push(g);
                        // hitbox.push(b);
                        // hitbox.push(d);
                        //console.log(mode);
                        hitbox.push([
                            new Vector2(b.x, b.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(pos.x + TILE_SIZE, pos.y),
                            new Vector2(d.x, d.y)
                        ])
                        break;

                    //13
                    case 11:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, a.x, a.y, pos.x + TILE_SIZE, pos.y,
                                a.x, a.y, b.x, b.y, pos.x + TILE_SIZE, pos.y,
                                b.x, b.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y
                            ]);
                        geometries.push(g);
                        // hitbox.push(a);
                        // hitbox.push(b);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(pos.x, pos.y),
                            new Vector2(a.x, a.y),
                            new Vector2(b.x, b.y),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(pos.x + TILE_SIZE, pos.y)
                        ])
                        break;

                    //14
                    case 7:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                a.x, a.y, pos.x, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y - TILE_SIZE,
                                a.x, a.y, d.x, d.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE,
                                pos.x + TILE_SIZE, pos.y, d.x, d.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE
                            ]);
                        geometries.push(g);
                        // hitbox.push(a);
                        // hitbox.push(d);
                        //console.log(mode);

                        hitbox.push([
                            new Vector2(a.x, a.y),
                            new Vector2(pos.x, pos.y - TILE_SIZE),
                            new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                            new Vector2(pos.x + TILE_SIZE, pos.y),
                            new Vector2(d.x, d.y),
                        ])
                        break;

                    case 15:
                        var g = new PIXI.Geometry()
                            .addAttribute('aVertexPosition', [
                                pos.x, pos.y, pos.x, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y - TILE_SIZE, pos.x + TILE_SIZE, pos.y, pos.x, pos.y, pos.x + TILE_SIZE, pos.y - TILE_SIZE
                            ]);
                        geometries.push(g);
                        //console.log(mode);

                        // hitbox.push([
                        //     new Vector2(pos.x, pos.y),
                        //     new Vector2(pos.x, pos.y - TILE_SIZE),
                        //     new Vector2(pos.x + TILE_SIZE, pos.y - TILE_SIZE),
                        //     new Vector2(pos.x + TILE_SIZE, pos.y)
                        // ])
                        break;

                } // end of switch
            } //end of y for loop
        } // end of x for loop
    }
    static objectsFromMatrix(matrix) {

    }
}

class TerrainCollider extends Component {
    constructor(parent, hitbox) {
        super(parent)
        this.boxes = []
        this.generatePolygonColliders(hitbox)
    }
    generatePolygonColliders(i_hitbox) {
        let hitbox = i_hitbox
        for (let i = 0; i < hitbox.length; i++) {
            let colliderObj = new GameObject()
            colliderObj.tag = 'Terrain'
            colliderObj.addComponent(Transform)
            colliderObj.addComponent(PolygonCollider, hitbox[i]).isStatic = true
            this.boxes.push(colliderObj)
        }
    }
    drawColliders() {
        if (!this.graphic) {
            this.graphic = new PIXI.Graphics()
        }
        this.graphic.clear()

        for (let col of this.boxes) {
            // let p_points = []
            // for (let point of col.getComponent(PolygonCollider).points) {
            //     p_points.push(new PIXI.Point(point.x, point.y))
            // }
            // console.log(p_points)
            let points = col.getComponent(PolygonCollider).points
            //console.log(points)
            this.graphic.lineStyle(4, 0x000000)
            // this.graphic.moveTo(points[0].x, points[1].y)
            // for (let i = 1; i < points.length; i++) {
            //     this.graphic.lineTo(points[i].x, points[i].y)
            // }
            this.graphic.drawPolygon(points)
            this.graphic.endFill()
        }
        World.stage.addChild(this.graphic)
    }
    removal() {
        for (let i = this.boxes.length; i >= 0; i--) {
            this.boxes[i].removal()
            this.boxes.splice(i, 1)
        }
    }
}

class TerrainRenderer extends Component {
    constructor(parent, geometries) {
        super(parent)
        this.generateMesh(geometries)
    }
    generateMesh(geometries) {
        if (geometries.length < 1) return
        let Geometry = PIXI.Geometry.merge(geometries);
        this.mesh = new PIXI.Mesh(Geometry, shader);
        World.stage.addChild(this.mesh);
    }
}

class PlayerController extends Component {
    constructor(parent) {
        super(parent)
        this.transform = this.getComponent(Transform)
        this.graphic = this.getComponent(Graphic)
        Physics.updates.push(this)

        document.addEventListener('keydown', (event) => {
            console.log(event)
        })
    }
    update() {

    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

World.stage = stage
World.size = new Vector2(700, 700)
Physics.beginLoop()
Renderer.beginLoop()

let level_test = new GameObject()
level_test.addComponent(Level)
level_test.getComponent(TerrainCollider).drawColliders()

let player = new GameObject()
player.addComponent(Transform).position.set(320, 200)
player.addComponent(PolygonCollider, [new Vector2(-10, 10), new Vector2(0, -10), new Vector2(10, 10)])
player.addComponent(PhysicsComponent)
player.addComponent(Graphic).DrawPolygon(player.getComponent(PolygonCollider).points, true, 0x0000ff)
player.addComponent(PlayerController)



// let boxA = new GameObject()
// boxA.addComponent(Transform)
// boxA.getComponent(Transform).position.set(330, -500)
// boxA.addComponent(PolygonCollider, [new Vector2(-100, -100), new Vector2(100, -100), new Vector2(100, 100), new Vector2(-100, 100)])
// boxA.addComponent(PhysicsComponent)
// boxA.addComponent(Graphic)
// boxA.getComponent(Graphic).DrawPolygon(boxA.getComponent(PolygonCollider).points)

let boxB = new GameObject()
boxB.addComponent(Transform)
boxB.getComponent(Transform).position.set(400, 300)
boxB.addComponent(PolygonCollider, [new Vector2(-50, -50), new Vector2(50, -50), new Vector2(50, 50), new Vector2(-50, 50)])
boxB.addComponent(PhysicsComponent)
boxB.addComponent(Graphic)
boxB.getComponent(Graphic).DrawPolygon(boxB.getComponent(PolygonCollider).points)

// let boxC = new GameObject()
// boxC.addComponent(Transform)
// boxC.getComponent(Transform).position.set(400, 100)
// boxC.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
// boxC.addComponent(PhysicsComponent)
// boxC.addComponent(Graphic)
// boxC.getComponent(Graphic).DrawPolygon(boxC.getComponent(PolygonCollider).points)

// let boxD = new GameObject()
// boxD.addComponent(Transform)
// boxD.getComponent(Transform).position.set(400, -700)
// boxD.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
// boxD.addComponent(PhysicsComponent)
// boxD.addComponent(Graphic)
// boxD.getComponent(Graphic).DrawPolygon(boxD.getComponent(PolygonCollider).points)

// let boxE = new GameObject()
// boxE.addComponent(Transform)
// boxE.getComponent(Transform).position.set(400, -800)
// boxE.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
// boxE.addComponent(PhysicsComponent)
// boxE.addComponent(Graphic)
// boxE.getComponent(Graphic).DrawPolygon(boxE.getComponent(PolygonCollider).points)

// let boxF = new GameObject()
// boxF.addComponent(Transform)
// boxF.getComponent(Transform).position.set(400, -1000)
// boxF.addComponent(PolygonCollider, [new Vector2(-25, -25), new Vector2(25, -25), new Vector2(25, 25), new Vector2(-25, 25)])
// boxF.addComponent(PhysicsComponent)
// boxF.addComponent(Graphic)
// boxF.getComponent(Graphic).DrawPolygon(boxF.getComponent(PolygonCollider).points)

// let floor = new GameObject()
// floor.addComponent(Transform)
// floor.getComponent(Transform).position.set(340, 600)
// floor.addComponent(PolygonCollider, [new Vector2(-300, -20), new Vector2(300, -20), new Vector2(300, 20), new Vector2(-300, 20)]).isStatic = true
// floor.addComponent(Graphic)
// floor.getComponent(Graphic).DrawPolygon(floor.getComponent(PolygonCollider).points)

// let visualizer = new GameObject()
// visualizer.addComponent(QuadTreeVisualizer)

