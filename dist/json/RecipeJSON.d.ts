export default class RecipeJSON {
    type: string;
    group: string;
    constructor(type: string, group: string);
    toJSON(): any;
    static fromJSON(json: any): RecipeJSON;
}
export declare class CookingRecipeJSON extends RecipeJSON {
    ingredient: Ingredient | Ingredient[];
    result: string;
    experience: number;
    cookingtime: number;
    constructor(type: string, group: string, ingredient: Ingredient | Ingredient[], result: string, experience: number, cookingtime?: number);
}
export declare class CraftingShapedRecipeJSON extends RecipeJSON {
    pattern: string[];
    key: Map<string, Ingredient | Ingredient[]>;
    result: Result;
    constructor(type: string, group: string, pattern: string[], key: Map<string, Ingredient | Ingredient[]>, result: Result);
}
export declare class CraftingShaplessRecipeJSON extends RecipeJSON {
    ingredients: Ingredient | Ingredient[];
    result: Result;
    constructor(type: string, group: string, ingredients: Ingredient | Ingredient[], result: Result);
}
export declare class StonecuttingRecipeJSON extends RecipeJSON {
    ingredient: Ingredient | Ingredient[];
    result: Result;
    count: number;
    constructor(type: string, group: string, ingredient: Ingredient | Ingredient[], result: Result, count: number);
}
export declare class Ingredient {
    item: string;
    tag: string;
    constructor(item: string, tag: string);
}
export declare class Result {
    count: number;
    item: string;
    constructor(count: number, item: string);
}
