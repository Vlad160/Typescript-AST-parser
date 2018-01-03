import { IPlugin } from '../IPlugin';
import { IComponent, IImportComponent, PackageController } from './packageController';
import {
    getLineAndCharacterOfPosition, Identifier, ImportDeclaration, ImportSpecifier, isImportSpecifier,
    isNamespaceImport, NamespaceImport, Node, PropertyAccessExpression, QualifiedName, SourceFile, StringLiteral,
    SyntaxKind
} from 'typescript';

export class ImportsParser implements IPlugin {

    private packageController = new PackageController();

    constructor(private sourceFile: SourceFile) {

    }

    parse(node: Node): void {

        switch (node.kind) {
            case SyntaxKind.ImportDeclaration: {
                this.parseImportDeclaration(<ImportDeclaration>node);
                break;
            }
            case SyntaxKind.Identifier: {
                this.parseIdentifier(<Identifier>node);
                break;
            }
            case  SyntaxKind.QualifiedName: {
                this.parseQualifiedName(<QualifiedName>node);
                break;
            }
            case SyntaxKind.PropertyAccessExpression: {
                this.parsePropertyAccessExpression(<PropertyAccessExpression>node);
                break;
            }
        }

    }

    print(): void {
        this.packageController.print();
    }

    parseImportDeclaration(node: ImportDeclaration): void {
        if (node.importClause && isNamespaceImport(node.importClause.namedBindings)) {
            this.parseNamespaceImport(<ImportDeclaration>node);
        }
        if (node.importClause) {
            this.parseImportClause(node);
        } else if (node.moduleSpecifier) {
            this.parseStringImport(node);
        }
    }

    parseNamespaceImport(node: ImportDeclaration): void {
        let packageName = <StringLiteral>node.moduleSpecifier;
        const alias = <Identifier>(<NamespaceImport>node.importClause.namedBindings).name;
        this.packageController.addComponentToMap({
            componentName: alias.text,
            packageName: packageName.text,
            aliasName: alias.text,
            isNamespaceImport: true
        });
    }

    parseImportClause(node: ImportDeclaration) {
        let packageName: string = (<StringLiteral>node.moduleSpecifier).text;
        node.importClause.namedBindings.forEachChild(node => {
            if (isImportSpecifier(node)) {
                const componentName = (<ImportSpecifier>node).name.text;
                const component: IImportComponent = { packageName, componentName };
                if (node.propertyName) {
                    component.aliasName = node.propertyName.getText();
                }
                this.packageController.addComponentToMap(component)
            }
        });
    }

    parseStringImport(node: ImportDeclaration) {
        const lib = <StringLiteral>node.moduleSpecifier;
        const component = lib.text.split('/');
        this.packageController.addComponentToMap({
            componentName: component[component.length - 1],
            packageName: component[0]
        })
    }

    parseIdentifier(node: Identifier): void {
        const componentFromMap
            = this.packageController.getComponentOrUndefinedFromMap(<string>node.escapedText);
        if (componentFromMap) {
            if (componentFromMap.isNamespaceImport) {
                return;
            }
            const component: IComponent = {
                componentName: node.text,
                line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
                file: this.sourceFile.fileName,
                packageName: componentFromMap.packageName
            };
            if (componentFromMap.aliasName) {
                component.aliasName = componentFromMap.aliasName;
            }
            this.packageController.addToPackageMap(component);
        }
    }

    parsePropertyAccessExpression(node: PropertyAccessExpression): void {
        const componentFromMap =
            this.packageController.getComponentOrUndefinedFromMap(<string>node.expression['escapedText']);
        if (componentFromMap) {
            const component: IComponent = {
                componentName: <string>node.name.escapedText,
                line: getLineAndCharacterOfPosition(this.sourceFile, node.expression.pos).line + 1,
                file: this.sourceFile.fileName,
                packageName: componentFromMap.packageName,
            };
            if (componentFromMap.aliasName) {
                component.aliasName = componentFromMap.aliasName;
            }
            this.packageController.addToPackageMap(component);
        }
    }

    parseQualifiedName(node: QualifiedName): void {
        const componentFromMap =
            this.packageController.getComponentOrUndefinedFromMap((<Identifier>node.left).text);
        if (componentFromMap) {
            const component: IComponent = {
                componentName: <string>node.right.escapedText,
                line: getLineAndCharacterOfPosition(this.sourceFile, node.pos).line + 1,
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