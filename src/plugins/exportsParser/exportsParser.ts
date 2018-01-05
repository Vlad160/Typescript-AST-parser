import {
    ClassDeclaration, EnumDeclaration, FunctionDeclaration, FunctionExpression, getLineAndCharacterOfPosition,
    Identifier, InterfaceDeclaration, Node, NodeFlags, SourceFile, SyntaxKind, VariableStatement
} from 'typescript'
import { IPlugin } from '../IPlugin';
import {
    ExportsController, IClassExport, IEnumExport, IFunctionExport, IInterfaceExport,
    IVariableExport
} from './exportsController';
import { DecoratorsParser } from './decoratorsParser';


export class ExportsParser implements IPlugin {

    private exportsController: ExportsController;
    private decoratorsParser: DecoratorsParser;
    private _sourceFile: SourceFile;

    constructor() {
        this.exportsController = new ExportsController();
        this.decoratorsParser = new DecoratorsParser();
    }

    set sourceFile(sourceFile: SourceFile) {
        this._sourceFile = sourceFile;
    }

    get sourceFile(): SourceFile {
        return this._sourceFile;
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
        switch (node.kind) {
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.FunctionExpression:
                this.parseFunctionDeclaration(<FunctionDeclaration | FunctionExpression>node);
                break;
            case SyntaxKind.VariableDeclaration:
            case SyntaxKind.VariableStatement:
                this.parseVariableDeclaration(<VariableStatement>node);
                break;
            case SyntaxKind.ClassDeclaration:
                this.parseClassDeclaration(<ClassDeclaration>node);
                break;
            case SyntaxKind.InterfaceDeclaration:
                this.parseInterfaceDeclaration(<InterfaceDeclaration>node);
                break;
            case SyntaxKind.EnumDeclaration:
                this.parseEnumDeclaration(<EnumDeclaration>node);
                break;
        }
    }

    parseFunctionDeclaration(node: FunctionDeclaration | FunctionExpression): void {
        const functionExport: IFunctionExport = {
            name: (<Identifier>node.name ? (<Identifier>node.name).text : 'Anonymous'),
            type: SyntaxKind[node.kind],
            file: this.sourceFile.fileName,
            line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
        };
        if (node.decorators) {
            node.decorators.forEach(value => {
                this.decoratorsParser.addDecoratorsMetadata(functionExport, value);
            });
        }
        this.exportsController.addDeclarationToMap(functionExport)
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

    parseInterfaceDeclaration(node: InterfaceDeclaration): void {
        const interfaceExport: IInterfaceExport = {
            name: (<Identifier>node.name).text,
            type: SyntaxKind[node.kind],
            file: this.sourceFile.fileName,
            line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
            membersLen: node.members.length,
        };
        this.exportsController.addDeclarationToMap(interfaceExport);
    }

    parseClassDeclaration(node: ClassDeclaration): void {
        const classExport: IClassExport = {
            name: (<Identifier>node.name).text,
            type: SyntaxKind[node.kind],
            file: this.sourceFile.fileName,
            line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
            membersLen: node.members.length - 1,
        };
        if (node.decorators) {
            node.decorators.forEach(value => {
                this.decoratorsParser.addDecoratorsMetadata(classExport, value);
            });
        }
        this.exportsController.addDeclarationToMap(classExport);
    }

    parseEnumDeclaration(node: EnumDeclaration): void {
        const enumExport: IEnumExport = {
            name: (<Identifier>node.name).text,
            type: SyntaxKind[node.kind],
            file: this.sourceFile.fileName,
            line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
            membersLen: node.members.length - 1,
        };
        this.exportsController.addDeclarationToMap(enumExport);
    }

    print(): any {
        return this.exportsController.print();
    }
}