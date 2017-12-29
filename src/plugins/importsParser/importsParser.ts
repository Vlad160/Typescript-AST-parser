import { IPlugin } from '../IPlugin';
import * as ts from 'typescript';
import { IComponent, IImportComponent, PackageController } from './packageController';

export class ImportsParser implements IPlugin {

    private packageController = new PackageController();

    constructor(private sourceFile: ts.SourceFile) {

    }

    parse(node: ts.Node): void {

        switch (node.kind) {
            case ts.SyntaxKind.ImportDeclaration: {
                this.parseImportDeclaration(<ts.ImportDeclaration>node);
                break;
            }
            case ts.SyntaxKind.Identifier: {
                this.parseIdentifier(<ts.Identifier>node);
                break;
            }
            case  ts.SyntaxKind.QualifiedName: {
                this.parseQualifiedName(<ts.QualifiedName>node);
                break;
            }
            case ts.SyntaxKind.PropertyAccessExpression: {
                this.parsePropertyAccessExpression(<ts.PropertyAccessExpression>node);
                break;
            }
        }

    }

    print(): void {
        this.packageController.print();
    }

    parseImportDeclaration(node: ts.ImportDeclaration): void {
        if (node.importClause && ts.isNamespaceImport(node.importClause.namedBindings)) {
            this.parseNamespaceImport(<ts.ImportDeclaration>node);
        }
        if (node.importClause) {
            this.parseImportClause(node);
        } else if (node.moduleSpecifier) {
            this.parseStringImport(node);
        }
    }

    parseNamespaceImport(node: ts.ImportDeclaration): void {
        let packageName = <ts.StringLiteral>node.moduleSpecifier;
        const alias = (node.importClause.namedBindings as ts.NamespaceImport).name as ts.Identifier;
        this.packageController.addComponentToMap({
            componentName: alias.text,
            packageName: packageName.text,
            aliasName: alias.text,
            isNamespaceImport: true
        });
    }

    parseImportClause(node: ts.ImportDeclaration) {
        let packageName: string = (<ts.StringLiteral>node.moduleSpecifier).text;
        node.importClause.namedBindings.forEachChild(node => {
            if (ts.isImportSpecifier(node)) {
                const componentName = (<ts.ImportSpecifier>node).name.text;
                const component: IImportComponent = { packageName, componentName };
                if (node.propertyName) {
                    component.aliasName = node.propertyName.getText();
                }
                this.packageController.addComponentToMap(component)
            }
        });
    }

    parseStringImport(node: ts.ImportDeclaration) {
        const lib = <ts.StringLiteral>node.moduleSpecifier;
        const component = lib.text.split('/');
        this.packageController.addComponentToMap({
            componentName: component[component.length - 1],
            packageName: component[0]
        })
    }

    parseIdentifier(node: ts.Identifier): void {
        const componentFromMap
            = this.packageController.getComponentOrUndefinedFromMap(<string>node.escapedText);
        if (componentFromMap) {
            if (componentFromMap.isNamespaceImport) {
                return;
            }
            const component: IComponent = {
                componentName: node.text,
                line: ts.getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
                file: this.sourceFile.fileName,
                packageName: componentFromMap.packageName
            };
            if (componentFromMap.aliasName) {
                component.aliasName = componentFromMap.aliasName;
            }
            this.packageController.addToPackageMap(component);
        }
    }

    parsePropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        const componentFromMap =
            this.packageController.getComponentOrUndefinedFromMap(<string>node.expression['escapedText']);
        if (componentFromMap) {
            const component: IComponent = {
                componentName: <string>node.name.escapedText,
                line: ts.getLineAndCharacterOfPosition(this.sourceFile, node.expression.pos).line + 1,
                file: this.sourceFile.fileName,
                packageName: componentFromMap.packageName,
            };
            if (componentFromMap.aliasName) {
                component.aliasName = componentFromMap.aliasName;
            }
            this.packageController.addToPackageMap(component);
        }
    }

    parseQualifiedName(node: ts.QualifiedName): void {
        const componentFromMap =
            this.packageController.getComponentOrUndefinedFromMap(<string>node.left['escapedText']);
        if (componentFromMap) {
            const component: IComponent = {
                componentName: <string>node.right.escapedText,
                line: ts.getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
                file: this.sourceFile.fileName,
                packageName: componentFromMap.packageName,
            };
            if (componentFromMap.aliasName) {
                component.aliasName = componentFromMap.aliasName;
            }
            this.packageController.addToPackageMap(component);
        }
    }
}