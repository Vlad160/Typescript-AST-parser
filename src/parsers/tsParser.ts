import { createSourceFile, forEachChild, Node, ScriptTarget, SourceFile } from 'typescript';
import { readFileSync } from 'fs';
import { ImportsParser } from '../plugins/importsParser/importsParser';
import { ExportsParser } from '../plugins/exportsParser/exportsParser';

export class TsParser {
    private readonly sourceFile: SourceFile;
    private importsParser: ImportsParser;
    private exportsParser: ExportsParser;

    constructor(file: string) {

        this.sourceFile = createSourceFile(file, readFileSync(file).toString(), ScriptTarget.ES2015, true);
        this.importsParser = new ImportsParser(this.sourceFile);
        this.exportsParser = new ExportsParser(this.sourceFile);
    }

    traverse() {
        this.parseNode(this.sourceFile);
        this.importsParser.print();
        this.exportsParser.print();
    }

    parseNode(node: Node) {
        this.importsParser.parse(node);
        this.exportsParser.parse(node);
        forEachChild(node, this.parseNode.bind(this));
    }
}