import { readFileSync } from 'fs';
import * as ts from 'typescript';

@CustomDecorator({ selector: 'test-selector', styleUrls: ['styles.scss'] })
export function delit(sourceFile: ts.SourceFile) {

    delintNode(sourceFile);

    function delintNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ImportClause:
            case ts.SyntaxKind.ImplementsKeyword:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.NamedImports:
                console.log(node);
                break;
        }
        ts.forEachChild(node, delintNode);
    }
}

const fileName = '';
const sourceFile = ts.createSourceFile('test', readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);
delit(sourceFile);

export const d = 5;
const a = [readFileSync];
ts.createSourceFile(null, null, null);

interface Foo {
    a: string;
}

const b: Foo = { a: 'a' };

const node: ts.NodeArray<ts.Node> = [];
export let testVar: string = 'some shit';

export interface ITestInteface {
    foo: string;
    bar: number;
}

export class Test {
    private foo: string = 'bar';

    constructor() {
    }
}