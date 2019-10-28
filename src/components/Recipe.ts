import {
    Group,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    NearestFilter,
    TextureLoader,
    FileLoader
} from 'three';
import { loadAync, maybeToArray } from '../util';
import Item from './Item';
import MinecraftText from './MinecraftText';
import RecipeJSON, { Ingredient, CraftingShapedRecipeJSON, CraftingShaplessRecipeJSON, CookingRecipeJSON, StonecuttingRecipeJSON } from '../json/RecipeJSON';
import TagJSON from '../json/TagJSON';

const textureLoader = new TextureLoader();
const jsonLoader = new FileLoader();

jsonLoader.setResponseType( 'json' );

async function unwrapItem( item: Ingredient ): Promise<string|string[]> {

    if ( item.hasOwnProperty( 'tag' ) ) {

        const tags = TagJSON.fromJSON( await loadAync.call( jsonLoader, `/assets/tags/items/${ item.tag.substring( 10 ) }.json` ) );

        return tags.values;

    }

    if ( item.hasOwnProperty( 'item' ) ) {

        return item.item;

    }

    throw new Error('Couldn\'t parse item');

}

const workstation: Map<string, string> = new Map( [
    [ 'minecraft:blasting', 'blast_furnace' ],
    [ 'minecraft:campfire_cooking', 'campfire' ],
    [ 'minecraft:smelting', 'furnace' ],
    [ 'minecraft:smoking', 'smoker' ],
    [ 'minecraft:crafting_shaped', 'crafting_table' ],
    [ 'minecraft:crafting_shapeless', 'crafting_table' ],
    [ 'minecraft:stonecutting', 'stonecutter' ]
] );

/**
 * Creates the neccessary items and textures to display an recipe
 */
export default class Recipe extends Group {

    public recipe: RecipeJSON;
    public background: Mesh;
    public icon: Item;
    public title: MinecraftText;
    public itemGroup: Group;

    /**
     *
     * @param {string} item The name of the crafting recipe to load
     */
    public constructor( public item: string, callback?: VoidFunction ) {

        super();

        this.load();

    }

    private async load() {

        const name = this.item.substring( this.item.lastIndexOf( ':' ) + 1 );

        this.recipe = RecipeJSON.fromJSON( await loadAync.call(
            jsonLoader,
            `/assets/recipes/${name}.json`
        ) );

        if ( this.recipe instanceof CraftingShapedRecipeJSON ) {

            this.createBackground( 'crafting_table_small', 'Crafting' );
            this.createCraftingShaped( this.recipe );

        }

        if ( this.recipe instanceof CraftingShaplessRecipeJSON ) {

            this.createBackground( 'crafting_table_small', 'Crafting' );
            this.createCraftingShapeless( this.recipe );

        }

        if ( this.recipe instanceof CookingRecipeJSON ) {

            this.createBackground( 'furnace_small' );
            this.createCooking( this.recipe );

        }

        if ( this.recipe instanceof StonecuttingRecipeJSON ) {

            this.createBackground( 'stone_cutter_small' );
            this.createStonecutting( this.recipe );

        }

    }

    /**
     * Create an appropiate background for each workstation
     * @param {string} name The name of the background image
     * @param {string} title A title displayed above the work station
     */
    private async createBackground( name: string, title?: string ) {

        const texture = await loadAync.call( textureLoader, `/assets/gui/${name}.png` );
        texture.name = name;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;

        const geometry = new PlaneGeometry(
            texture.image.width,
            texture.image.height
        );
        const material = new MeshBasicMaterial( { map: texture, transparent: true } );
        this.background = new Mesh( geometry, material );
        this.background.name = name;
        this.background.position.z = -8;

        this.add( this.background );

        if ( workstation.has( this.recipe.type ) ) {

            this.icon = new Item( workstation.get( this.recipe.type ) );

        }
        else {

            this.icon = new Item( 'crafting_table' );

        }

        this.icon.position.set( -texture.image.width / 2 + 8, texture.image.height / 2 + 4, -4 );

        this.title = new MinecraftText( title );
        this.title.position.set( -texture.image.width / 2 + 18, texture.image.height / 2 + 1, -4 );

        this.add( this.title );

    }

    /**
     * Create all items for an shaped crafting recipe
     */
    private async createCraftingShaped( recipe: CraftingShapedRecipeJSON ) {

        const needed = new Map<string, Item>();
        const promisses = new Array<Promise<void>>();

        for ( const key in recipe.key ) {

            if ( recipe.key.hasOwnProperty( key ) ) {

                const ingredients = maybeToArray( recipe.key[ key ] );

                const name = await Promise.all( ingredients.map( unwrapItem ) );

                promisses.push( new Promise(

                    resolve => needed.set(
                        key,
                        new Item(
                            name.map( maybeToArray ).reduce( ( a, b ) => a.concat( b ) ),
                            resolve
                        )
                    )

                ) );

            }

        }

        await Promise.all( promisses );

        // 65, 34

        let j = 0;

        for (const row of recipe.pattern) {

            let i = 0;

            for (const cell of row) {

                if ( needed.hasOwnProperty( cell ) ) {

                    const item = needed.get( cell ).clone( false );
                    item.position.set( -49 + i * 18, 18 - j * 18, 0 );

                    this.add( item );

                }

                i++;

            }

            j++;

        }

        const result = new Item( recipe.result.item );
        result.position.set( 45, 0, 0 );

        this.add( result );

    }

    /**
     * Create all items for an shapeless crafting recipe
     */
    private async createCraftingShapeless( recipe: CraftingShaplessRecipeJSON ) {

        let i = 0, j = 0;

        for ( const key of maybeToArray( recipe.ingredients ) ) {

            const item = new Item( await unwrapItem( key ) );
            item.position.set( -49 + i * 18, 18 - j * 18, 0 );

            this.add( item );

            if ( ++i >= 3 ) {

                i = 0;
                j++;

            }

        }

        const result = new Item( recipe.result.item );
        result.position.set( 45, 0, 0 );

        this.add( result );

    }

    // TODO: add animation
    /**
     * Create all items for an smelting recipe
     */
    private async createCooking( recipe: CookingRecipeJSON ) {

        const ingredient = new Item(
            ( await Promise.all(
                maybeToArray( recipe.ingredient ).map( unwrapItem )
            ) )
            .map( maybeToArray )
            .reduce( ( a, b ) => a.concat( b ) )
        );
        ingredient.position.set( -32, 18, 0 );

        this.add( ingredient );

        // TODO: add fuel (position -32, 18)

        const result = new Item( recipe.result );
        result.position.set( 28, 0, 0 );

        this.add( result );

    }

    private async createStonecutting( recipe: StonecuttingRecipeJSON ) {

        const ingredient = new Item(
            ( await Promise.all(
                maybeToArray( recipe.ingredient ).map( unwrapItem )
            ) )
            .map( maybeToArray )
            .reduce( ( a, b ) => a.concat( b ) )
        );
        ingredient.position.set( -32, 0, 0 );

        this.add( ingredient );

        const result = new Item( recipe.result.item );
        result.position.set( 28, 0, 0 );

        this.add( result );

    }

    public async dispose() {

        const mesh = this.children[0];

        if ( mesh instanceof Mesh ) {

            mesh.geometry.dispose();

            if ( Array.isArray( mesh.material ) ) {

                mesh.material.forEach( e => e.dispose() );

            }
            else {

                mesh.material.dispose();

            }

        }

        for (let i = 1; i < this.children.length; i++) {

            const child = this.children[i];

            if ( child instanceof Item ) {

                child.dispose();

            }

        }

    }

}