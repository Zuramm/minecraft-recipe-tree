export default class ModelJSON {

    public constructor(
        public parent: string,
        public ambientocclusion: boolean = true,
        public display: Display,
        public textures: {[s: string]: string},
        public elements: Element[]
    ) {}

    toJSON(): any {

        return Object.assign( {}, this );

    }

    static fromJSON( json: any ): ModelJSON {

        let user = Object.create( ModelJSON.prototype );
        return Object.assign( user, json, json.hasOwnProperty( 'textures' ) );

    }

}

export class Display {

    public constructor(
        public thirdperson_righthand: Transform,
        public thirdperson_lefthand: Transform,
        public firstperson_righthand: Transform,
        public firstperson_lefthand: Transform,
        public gui: Transform,
        public head: Transform,
        public ground: Transform,
        public fixed: Transform
    ) {}

}

export class Transform {

    public constructor(
        public rotation: [number, number, number],
        public translation: [number, number, number],
        public scale: [number, number, number]
    ) {}

}

export class Element {

    public constructor(
        public from: [number, number, number],
        public to: [number, number, number],
        public rotation: Rotation,
        public shade: boolean = true,
        public faces: Faces
    ) {}

}

export class Rotation {

    public constructor(
        public origin: [number, number, number],
        public axis: Axis,
        public angle: number,
        public rescale: boolean = false
    ) {}

}

export enum Axis {
    x = 'x',
    y = 'y',
    z = 'z'
}

export class Faces {

    public constructor(
        public down: Face,
        public up: Face,
        public north: Face,
        public south: Face,
        public west: Face,
        public east: Face
    ) {}

}

export class Face {

    public constructor(
        public uv: [number, number, number, number],
        public texture: string,
        public cullface: string,
        public rotation: number = 0,
        public tintindex: number
    ) {}

}