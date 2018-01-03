export const angularDecorators = ['Component', 'Directive'];

export function isAngularDecorator(decoratorName: string): boolean {

    return angularDecorators.includes(decoratorName);

}

export function detectAngularType(decoratorName: string): string | undefined {
    return angularDecorators.find(value => value === decoratorName);
}