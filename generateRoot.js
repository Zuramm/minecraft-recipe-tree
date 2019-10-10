const fs = require('fs');

const recipeFolder = './dist/assets/recipes/';

const allRecipes = [];
const allReferences = new Set();

fs.readdir(recipeFolder, async (err, files) => {
    const processes = [];

    files.forEach(file => {
        allRecipes.push('item:minecraft:' + file.substring(0, file.length - 5));

        processes.push(
            new Promise((resolve, reject) => {
                fs.readFile(recipeFolder + file, (err, data) => {
                    if (err) return reject(err);
                    let json = JSON.parse(data);
                    extractReferences(json);
                    resolve();
                });
            })
        );
    });

    await Promise.all(processes);

    for (const ref of allReferences) {
        allRecipes.splice(allRecipes.indexOf(ref), 1);
    }

    const outputStr = '[\n' + allRecipes.map(e => `    "${e}"`).join(',\n') + '\n]';

    fs.writeFile('./generated/roots.json', outputStr, (err) => { if (err) throw err });
});

function getItemNameOrNames(item) {
    if (Array.isArray(item)) {
        return item.map(getItemName);
    } else {
        return [getItemName(item)];
    }
}

function getItemName(item) {
    return item.hasOwnProperty('item')
        ? 'item:' + item.item
        : 'tag:' + item.tag;
}

function extractReferences(json) {
    switch (json.type) {
        case 'minecraft:blasting':
        case 'minecraft:campfire_cooking':
        case 'minecraft:smelting':
        case 'minecraft:smoking':
        case 'minecraft:stonecutting':
            getItemNameOrNames(json.ingredient).forEach(e =>
                allReferences.add(e)
            );
            break;

        case 'minecraft:crafting_shaped':
            getItemNameOrNames(Object.values(json.key)).forEach(e =>
                allReferences.add(e)
            );
            break;

        case 'minecraft:crafting_shapeless':
            getItemNameOrNames(json.ingredients).forEach(e =>
                allReferences.add(e)
            );
            break;

        case 'minecraft:crafting_special_armordye':
        case 'minecraft:crafting_special_bannerduplicate':
        case 'minecraft:crafting_special_bookcloning':
        case 'minecraft:crafting_special_firework_rocket':
        case 'minecraft:crafting_special_firework_star':
        case 'minecraft:crafting_special_firework_star_fade':
        case 'minecraft:crafting_special_mapcloning':
        case 'minecraft:crafting_special_mapextending':
        case 'minecraft:crafting_special_repairitem':
        case 'minecraft:crafting_special_shielddecoration':
        case 'minecraft:crafting_special_shulkerboxcoloring':
        case 'minecraft:crafting_special_tippedarrow':
        case 'minecraft:crafting_special_suspiciousstew':
            break;
    }
}
