import { SourceFile, Node, SyntaxKind } from 'typescript'
import { IPlugin } from '../IPlugin';

export class ExportsParser implements IPlugin {


    constructor(private sourceFile: SourceFile) {
    }

    parse(node: Node): void {
        switch (node.kind) {
            case SyntaxKind.ExportKeyword:
            case SyntaxKind.ExportDeclaration:
            case SyntaxKind.ExportAssignment:
            case SyntaxKind.ExportSpecifier:
            case SyntaxKind.NamedExports:
                console.log(node.kind)
        }
    }
}