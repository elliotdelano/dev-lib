class GameObject {
    constructor() {
        this.manager = new ObjectManager(this)
    }
}

class ObjectManager {
    constructor(parent) {
        this.parent = parent
    }
}