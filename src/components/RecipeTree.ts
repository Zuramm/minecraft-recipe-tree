import { Object3D } from "three";
import RecipeJSON from "../json/RecipeJSON";

export default class RecipeTree extends Object3D {

    private recipes: RecipeJSON[];


    public constructor( name: string ) {

        super();

    }

    async loadRecipes() {

    }

}