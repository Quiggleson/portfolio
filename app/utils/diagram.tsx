import { randomUUID } from "crypto";

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    public static distance(point1: Point, point2: Point) {
        return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2);
    }
}

export class Item {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    connectionPoints: Point[] = [];
    connections: Connection[] = [];

    public constructor(
        name: string,
        x: number,
        y: number,
        width: number,
        height: number
    ){
        this.id = randomUUID();
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        const buffer = 10;
        this.connectionPoints.push({x: (x+x+width)/2, y: y - buffer});
        this.connectionPoints.push({x: (x+x+width)/2, y: y + height + buffer});
        this.connectionPoints.push({x: x - buffer, y: (y+y+height)/2});
        this.connectionPoints.push({x: x + width + buffer, y: (y+y+height)/2});
    }

    public closestPoint(point: Point) {
        var closestIndex = 0;
        var closestDistance = 
        this.connectionPoints.forEach((conPoint) => {

        }) 
    }

    public getCenter() {
        return new Point((this.x+this.x+this.width)/2, (this.y+this.y+this.height)/2);
    }
}

export class Connection {
    parent: Item;
    child: Item;
    points: Point[] = [];

    public constructor(parent: Item, child: Item) {
        this.parent = parent;
        this.child = child
    }
}