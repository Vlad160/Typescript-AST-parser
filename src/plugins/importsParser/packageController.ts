export interface IImportComponent {
    // aliasName is name from import, e.g. import {read as readFileSync}. `Read` is aliasName, component name is `readFileSync`
    componentName: string;
    packageName: string;
    aliasName?: string;
    isNamespaceImport?: boolean;
}

export interface IComponent extends IImportComponent {
    file: string;
    line: string | number;
}

export interface IPackageMap {

    [pakckageName: string]: IComponent[]
}

export interface IComponentMapper {

    [componentName: string]: IImportComponent
}

export class PackageController {

    private packageMap: IPackageMap = {};
    private mapper: IComponentMapper = {};

    constructor() {

    }

    addComponentToMap(importComponent: IImportComponent): void {
        this.mapper[importComponent.componentName] = importComponent;
    }

    addToPackageMap(component: IComponent): void {
        if (!component.packageName) {
            component.packageName = this.mapper[component.componentName].packageName || 'undefined';
        }
        if (!this.packageMap[component.packageName]) {
            this.packageMap[component.packageName] = [];
        }
        this.packageMap[component.packageName].push(component);
    }

    getComponentOrUndefinedFromMap(componentName: string): IImportComponent | undefined {
        if (this.mapper.hasOwnProperty(componentName)) {
            return this.mapper[componentName];
        }
    }

    //TODO don't use console.log for print. Make it solid, mb use fp
    print() {
        console.log(JSON.stringify(this.packageMap, undefined, 4))
    }
}