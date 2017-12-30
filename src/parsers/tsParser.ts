import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { ImportsParser } from '../plugins/importsParser/importsParser';
import { ExportsParser } from '../plugins/exportsParser/exportsParser';

export class TsParser {
    private readonly sourceFile: ts.SourceFile;
    private importsParser: ImportsParser;
    private exportsParser: ExportsParser;

    constructor(file: string) {

        this.sourceFile = ts.createSourceFile(file, readFileSync(file).toString(), ts.ScriptTarget.ES2015, true);
        this.importsParser = new ImportsParser(this.sourceFile);
        this.exportsParser = new ExportsParser(this.sourceFile);
    }

    traverse() {
        this.parseNode(this.sourceFile);
        // this.importsParser.print();
        // this.exportsParser.print();
    }

    parseNode(node: ts.Node) {
        this.importsParser.parse(node);
        this.exportsParser.parse(node);
        ts.forEachChild(node, this.parseNode.bind(this));
    }
}