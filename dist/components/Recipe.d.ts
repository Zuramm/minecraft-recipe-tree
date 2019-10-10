import { Group, Mesh } from 'three';
import Item from './Item';
import MinecraftText from './MinecraftText';
import RecipeJSON from '../json/RecipeJSON';
/**
 * Creates the neccessary items and textures to display an recipe
 */
export default class Recipe extends Group {
    item: string;
    recipe: RecipeJSON;
    background: Mesh;
    icon: Item;
    title: MinecraftText;
    itemGroup: Group;
    /**
     *
     * @param {string} item The name of the crafting recipe to load
     */
    constructor(item: string, callback?: VoidFunction);
    private load;
    /**
     * Create an appropiate background for each workstation
     * @param {string} name The name of the background image
     * @param {string} title A title displayed above the work station
     */
    private createBackground;
    /**
     * Create all items for an shaped crafting recipe
     */
    private createCraftingShaped;
    /**
     * Create all items for an shapeless crafting recipe
     */
    private createCraftingShapeless;
    /**
     * Create all items for an smelting recipe
     */
    private createCooking;
    private createStonecutting;
    dispose(): Promise<void>;
}
