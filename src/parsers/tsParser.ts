import { createSourceFile, forEachChild, Node, ScriptTarget, SourceFile, } from 'typescript';
import { readFileSync } from 'fs';
import { IPlugin } from '../plugins/IPlugin';

export class TsParser {
    private _sourceFile: SourceFile;
    private plugins: IPlugin[];

    constructor(file?: string, ...plugins: IPlugin[]) {

        if (file) {
            this._sourceFile = createSourceFile(file, readFileSync(file).toString(), ScriptTarget.ES2015, true);
            this.plugins.forEach((plugin: IPlugin) => plugin.sourceFile = this._sourceFile);
        }
        this.plugins = plugins;
    }

    set sourceFile(file: string) {
        this._sourceFile = createSourceFile(file, readFileSync(file).toString(), ScriptTarget.ES2015, true);
    }


    traverse() {
        this.plugins.forEach((plugin: IPlugin) => plugin.sourceFile = this._sourceFile);
        this.parseNode(this._sourceFile);
    }

    parseNode(node: Node) {
        this.plugins.forEach((plugin: IPlugin) => plugin.parse(node));
        forEachChild(node, this.parseNode.bind(this));
    }

    getReport(): any[] {
        return this.plugins.map((plugin: IPlugin) => plugin.print());
    }
}