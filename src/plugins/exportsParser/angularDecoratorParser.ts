export interface IDecorator {
    name: string;
    arguments: any[];
}

export class AngularDecoratorParser {

    private readonly templateMapper = {
        'Component': {
            type: 'Component',
        },
        'Directive': {
            type: 'Directive'
        }
    };

    constructor() {

    }

    getAngularMetadate(decorator: IDecorator): undefined | any {
        if (!this.templateMapper[decorator.name]) {
            return;
        }
        return {
            type: this.templateMapper[decorator.name],
            selector: 'test-selector'
        }
    }
}