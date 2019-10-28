export default class ModelJSON {
    parent: string;
    ambientocclusion: boolean;
    display: Display;
    textures: {
        [s: string]: string;
    };
    elements: Element[];
    constructor(parent: string, ambientocclusion: boolean, display: Display, textures: {
        [s: string]: string;
    }, elements: Element[]);
    toJSON(): any;
    static fromJSON(json: any): ModelJSON;
}
export declare class Display {
    thirdperson_righthand: Transform;
    thirdperson_lefthand: Transform;
    firstperson_righthand: Transform;
    firstperson_lefthand: Transform;
    gui: Transform;
    head: Transform;
    ground: Transform;
    fixed: Transform;
    constructor(thirdperson_righthand: Transform, thirdperson_lefthand: Transform, firstperson_righthand: Transform, firstperson_lefthand: Transform, gui: Transform, head: Transform, ground: Transform, fixed: Transform);
}
export declare class Transform {
    rotation: [number, number, number];
    translation: [number, number, number];
    scale: [number, number, number];
    constructor(rotation: [number, number, number], translation: [number, number, number], scale: [number, number, number]);
}
export declare class Element {
    from: [number, number, number];
    to: [number, number, number];
    rotation: Rotation;
    shade: boolean;
    faces: Faces;
    constructor(from: [number, number, number], to: [number, number, number], rotation: Rotation, shade: boolean, faces: Faces);
}
export declare class Rotation {
    origin: [number, number, number];
    axis: Axis;
    angle: number;
    rescale: boolean;
    constructor(origin: [number, number, number], axis: Axis, angle: number, rescale?: boolean);
}
export declare enum Axis {
    x = "x",
    y = "y",
    z = "z"
}
export declare class Faces {
    down: Face;
    up: Face;
    north: Face;
    south: Face;
    west: Face;
    east: Face;
    constructor(down: Face, up: Face, north: Face, south: Face, west: Face, east: Face);
}
export declare class Face {
    uv: [number, number, number, number];
    texture: string;
    cullface: string;
    rotation: number;
    tintindex: number;
    constructor(uv: [number, number, number, number], texture: string, cullface: string, rotation: number, tintindex: number);
}
