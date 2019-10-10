import { Mesh, Object3D } from 'three';
export declare function getCharWidth(str: string): number;
export declare function createMinecraftChar(char: string, physical?: boolean): Mesh;
export default class MinecraftText extends Object3D {
    text: string;
    private textPosition;
    /**
     *
     * @param {string} text
     */
    constructor(text: string, physical?: boolean);
}
