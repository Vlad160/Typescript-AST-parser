import * as fs from 'fs';
import * as path from 'path';

export const angularDecorators = ['Component', 'Directive', 'NgModule'];

export function isAngularDecorator(decoratorName: string): boolean {

    return angularDecorators.includes(decoratorName);

}

export function isCustomComponent(decoratorName: string): boolean {
    return decoratorName === 'customElement';
}

export function detectAngularType(decoratorName: string): string | undefined {
    return angularDecorators.find(value => value === decoratorName);
}

export function isValidVersion(currentVer, headVer) {
    return currentVer === headVer;
}

export function getPackageName(packageDir: string) {
    if (fs.lstatSync(packageDir).isDirectory()) {
        const _package = fs.readFileSync(path.resolve(packageDir, 'package.json'), 'utf-8');
        return JSON.parse(_package).name;
    }
}

export function writeFile(path: string, data: any, encoding: string = 'utf-8'): void {
    return fs.writeFileSync(path, data, { encoding })
}