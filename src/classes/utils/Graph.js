export default class Graph {
    constructor() {
        this.nodes = [],
        this.edges = []
    }
}

class Edge {
    constructor(origin, end) {
        this.origin = origin;
        this.end = end
    }
}
class Node {
    constructor(room) {
        this.room = room
    }
}