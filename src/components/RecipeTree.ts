import { Object3D } from "three";
import RecipeJSON from "../json/RecipeJSON";

export default class RecipeTree extends Object3D {

    private recipes: Map<string, RecipeJSON>;


    public constructor( name: string ) {

        super();

        this.recipes = new Map();

        this.loadRecipes( name );
        
    }

    private async loadRecipes( recipe: string ) {

        

    }

}