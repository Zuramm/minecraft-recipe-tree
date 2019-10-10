export default class RecipeJSON {

    public constructor(
        public type: string,
        public group: string
    ) {}

    toJSON(): any {

        return Object.assign( {}, this );
        
    }

    static fromJSON( json: any ): RecipeJSON {

        let recipe;

        switch (json.type) {

            case 'minecraft:blasting':
            case 'minecraft:campfire_cooking':
            case 'minecraft:smelting':
            case 'minecraft:smoking':
                recipe = Object.create( CookingRecipeJSON.prototype );
                return Object.assign( recipe, json );

            case 'minecraft:crafting_shaped':
                recipe = Object.create( CraftingShapedRecipeJSON.prototype );
                return Object.assign( recipe, json );
            
            case 'minecraft:crafting_shapeless':
                recipe = Object.create( CraftingShaplessRecipeJSON.prototype );
                return Object.assign( recipe, json );
    
            case 'minecraft:stonecutting':
                recipe = Object.create( StonecuttingRecipeJSON.prototype );
                return Object.assign( recipe, json );

            default:
                recipe = Object.create( RecipeJSON.prototype );
                return Object.assign( recipe, json );

        }

    }

}

export class CookingRecipeJSON extends RecipeJSON {

    public constructor(
        type: string,
        group: string,
        public ingredient: Ingredient|Ingredient[],
        public result: string,
        public experience: number,
        public cookingtime: number = 200
    ) {
        super( type, group );
    }

}

export class CraftingShapedRecipeJSON extends RecipeJSON {

    public constructor(
        type: string,
        group: string,
        public pattern: string[],
        public key: Map<string, Ingredient|Ingredient[]>,
        public result: Result
    ) {
        super( type, group );
    }

}

export class CraftingShaplessRecipeJSON extends RecipeJSON {

    public constructor(
        type: string,
        group: string,
        public ingredients: Ingredient|Ingredient[],
        public result: Result
    ) {
        super( type, group );
    }

}

export class StonecuttingRecipeJSON extends RecipeJSON {

    public constructor(
        type: string,
        group: string,
        public ingredient: Ingredient|Ingredient[],
        public result: Result,
        public count: number
    ) {
        super( type, group );
    }

}

export class Ingredient {

    public constructor(
        public item: string,
        public tag: string
    ) {}

}

export class Result {

    public constructor(
        public count: number,
        public item: string
    ) {}

}