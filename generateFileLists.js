const fs = require('fs');
const path = require('path');

const root = './dist/assets/';
const output = './dist/meta/';

const ingore = ['gui'];

async function listFiles(rel) {
    const dir = path.join(root, rel);
    const files = await new Promise((resolve, reject) =>
        fs.readdir(dir, async (err, files) => {
            if (err) return reject(err);
            resolve(files);
        })
    );

    const result = [];

    const processes = [];

    for (const file of files) {
        const fullpath = path.join(dir, file);
        processes.push(
            new Promise((resolve, reject) => {
                fs.stat(fullpath, (err, stat) => {
                    if (err) return reject(err);

                    if (stat.isDirectory() && !ingore.includes(file)) {
                        const resultDir = path.join(rel, file);
                        listFiles(resultDir).then(fileList => writeJSON(rel, file, fileList));
                    } else if (stat.isFile()) {
                        result.push(file);
                    }

                    resolve();
                });
            })
        );
    }

    await Promise.all(processes);

    return result;
}

async function writeJSON(rel ,name, files) {
    const resultDir = path.join(output, rel);

    await new Promise((resolve, reject) => {
        fs.access(resultDir, fs.constants.F_OK, async (err) => {
            if (err) {
                await new Promise((resolve, reject) => {
                    fs.mkdir(resultDir, (err) => { 
                        if (err) reject(err); else resolve(); 
                    });
                });
            }

            resolve();
        });
    });

    fs.writeFile(
        path.join(resultDir, `${name}.json`),
        JSON.stringify(files),
        (err) => { if (err) throw err }
    );
}

listFiles('');
