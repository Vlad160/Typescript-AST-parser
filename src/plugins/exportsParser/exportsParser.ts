import {
    CallExpression, FunctionDeclaration, getLineAndCharacterOfPosition, Identifier, Node, NodeFlags, SourceFile,
    SyntaxKind, VariableStatement
} from 'typescript'
import { IPlugin } from '../IPlugin';
import { ExportsController, IFunctionExport, IVariableExport } from './exportsController';


export class ExportsParser implements IPlugin {

    private exportsController: ExportsController;

    constructor(private sourceFile: SourceFile) {
        this.exportsController = new ExportsController();
    }

    parse(node: Node): void {
        switch (node.kind) {
            case SyntaxKind.ExportKeyword:
            case SyntaxKind.ExportDeclaration:
            case SyntaxKind.ExportAssignment:
            case SyntaxKind.ExportSpecifier:
            case SyntaxKind.NamedExports:
                this.parseExportKeyword(node.parent);
        }
    }

    parseExportKeyword(node: any): void {
        // Temp workaround

        switch (node.kind) {
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.FunctionExpression:
                this.parseFunctionDeclaration(<FunctionDeclaration>node);
                break;
            case SyntaxKind.VariableDeclaration:
            case SyntaxKind.VariableStatement:
                this.parseVariableDeclaration(<VariableStatement>node);
                break;

        }
    }

    parseFunctionDeclaration(node: FunctionDeclaration): void {
        const functionDeclaration: IFunctionExport = {
            name: (<Identifier>node.name).text,
            type: SyntaxKind[node.kind],
            file: this.sourceFile.fileName,
            line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
        };
        node.decorators.forEach(value => {
            console.log((<Identifier>(<CallExpression>value.expression).expression).text);
            console.log((<CallExpression>value.expression).arguments)
        });
        this.exportsController.addDeclarationToMap(functionDeclaration)
    }

    parseVariableDeclaration(node: VariableStatement): void {
        if (node.declarationList && node.declarationList.declarations) {
            node.declarationList.declarations.forEach(value => {
                const variableDeclaration: IVariableExport = {
                    name: (<Identifier>value.name).text,
                    type: SyntaxKind[value.kind],
                    file: this.sourceFile.fileName,
                    line: getLineAndCharacterOfPosition(this.sourceFile, value.pos).line + 1,
                    isConst: (value.parent.flags === NodeFlags.Const),
                    variableType: (value.type ? value.type.getText() : 'any'),
                };
                this.exportsController.addDeclarationToMap(variableDeclaration)
            })
        }

    }

    print(): void {
        console.log(this.exportsController.print());
    }
}