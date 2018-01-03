import { IClassExport, IFunctionExport } from './exportsController';
import { detectAngularType, isAngularDecorator } from '../../utils/utils';
import { CallExpression, Decorator, Identifier, ObjectLiteralExpression, PropertyAssignment } from 'typescript';

export class DecoratorsParser {

    constructor() {

    }

    addDecoratorsMetadata(component: IClassExport | IFunctionExport, decorator: Decorator) {
        const decoratorName = (<Identifier>(<CallExpression>decorator.expression).expression).text;
        if (isAngularDecorator(decoratorName)) {
            this.parseAngularComponent(component, decorator);
        }
    }

    private parseAngularComponent(component: IClassExport | IFunctionExport, decorator: Decorator) {
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
}