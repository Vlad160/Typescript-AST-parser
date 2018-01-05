import { IClassExport, IFunctionExport } from './exportsController';
import { detectAngularType, isAngularDecorator, isCustomComponent } from '../../utils/utils';
import {
    CallExpression, Decorator, Identifier, ObjectLiteralExpression, PropertyAssignment,
    StringLiteral
} from 'typescript';

export class DecoratorsParser {

    constructor() {

    }

    addDecoratorsMetadata(component: IClassExport | IFunctionExport, decorator: Decorator) {
        const decoratorName = (<Identifier>(<CallExpression>decorator.expression).expression).text;
        if (isAngularDecorator(decoratorName)) {
            this.parseAngularComponent(component, decorator);
            return;
        }
        if (isCustomComponent(decoratorName)) {
            this.parseCustomElement(<IClassExport>component, decorator);
        }
    }

    private parseAngularComponent(component: IClassExport | IFunctionExport, decorator: Decorator): void {
        const selector = ((<CallExpression>decorator.expression).arguments[0] as ObjectLiteralExpression).properties
            .find(value => ((<Identifier>value.name).text === 'selector'));
        let selectorName: string;
        if (selector) {
            selectorName = (<Identifier>(<PropertyAssignment>selector).initializer).text
        }
        const decoratorName = (<Identifier>(<CallExpression>decorator.expression).expression).text;
        component.type = detectAngularType(decoratorName) || component.type;
        (<IClassExport>component).isAngular = true;
        (<IClassExport>component).selector = selectorName;
    }

    private parseCustomElement(component: IClassExport, decorator: Decorator): void {
        component.type = 'customElement';
        (<IClassExport>component).selector = (<StringLiteral>(<CallExpression>decorator.expression).arguments[0]).text;

    }
}