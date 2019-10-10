import { Object3D } from 'three';
import ModelJSON from '../json/ModelJSON';
/**
 * A three js object to represent items and blocks
 */
export default class Item extends Object3D {
    names: string[];
    index: number;
    json: ModelJSON;
    private intervalID;
    /**
     *
     * @param {string[]} names The name of an item. The item name can start with
     * `minecraft:`
     * @param {*} callback Called when everything is loaded
     */
    constructor(names: string | string[], callback?: VoidFunction);
    private load;
    private cycle;
    /**
     * Load the required JSON and either create an SpriteItem or ModelItem.
     * @param {string} name Name of the item to create
     */
    private createMesh;
    /**
     * Loads the neccessary textures and puts them on a plane.
     * @param {Map<string, any>} desc The JSON description of an item
     */
    private createSpriteItem;
    /**
     * Loads the neccessary parent models and textures and builds the model and
     * textures it.
     * @param {Map<string, any>} desc The JSON description of an model
     */
    private createModelItem;
    dispose(): void;
    private disposeItem;
    private disposeBlock;
    private disposeMesh;
}
