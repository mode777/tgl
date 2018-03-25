const glob = require("glob");
const path = require("path");
const fs = require("fs");

const defaultOptions = {
    pattern: '**/*.ts',
    path: '.',
    entry: './tests.ts'
}

class DiscoveryPlugin {

    constructor(options) {
        console.log(options);
        this.path = options.pattern || defaultOptions.pattern;
        this.extensions = options.extensions || defaultOptions.extensions;
        this.entry = options.entry || defaultOptions.entry;
    }

    createEntry(){
        const tests = glob.sync(this.path);
        const lines = tests.map(x => "import '" + x + "';") ;
        lines.push("import { run } from 'test';");   
        lines.push("run();");
        return lines.join('\n');
    }

    apply(compiler) {
        const that = this;
        const _path = this.path;
        const entry = this.entry;
        const entryDir = path.dirname(this.entry);          
        console.info('Test discovery plugin: Discovering tests in ' + _path);
        console.info('Create testfile in in ' + _path);

        compiler.plugin('compile', function (para) {
            const _new = that.createEntry();
            if(fs.existsSync(entry)){
                const old = fs.readFileSync(entry, { encoding: 'utf8'});
                if(old !== _new){
                    console.log("File is new", old, _new)
                    fs.unlinkSync(entry);
                    fs.writeFileSync(entry, _new);
                }
            }
            else {
                console.log("File does not exist: rewrite");
                fs.writeFileSync(entry, _new);
            }
        });
    }
}

module.exports = DiscoveryPlugin;