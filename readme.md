# Minecraft Recipe Tree
This aim of this project is to help you plan for your minecraft and calculate 
the needed resources.

## Todo's
[x] Generate Items models
[x] Generate Block models
[x] Show shaped crafting recipes
[x] Show shapeless crafting recipes
[x] Show coocking repices
[x] Show stonecutting recipes
[] Show crafting dependecies as a tree
[] Search recipes
[] Calculate needed resources for block
[] Select wich tables you want to use
[] Select wich crafting you want to do
[] Type in a list of wanted item/block

## Run server
### Option 1: Use the express server from this git.
```sh
$ npm install --production
$ npm run start
```
### Option 2: Use your own static server.
If you want to use your own static server, you need to expose `index.html`, 
`dist` and `json`.

## Build server
```sh
$ npm install
$ npm run build
```

There is also a a watch mode, wich rebuild every time a source file changes.
```sh
$ npm install
$ npm run watch
```

> Note: you will need to run `npm install` only once