export interface IExportDeclaration {
    name: string;
    type: string;
    file: string;
    line: string | number;
}

export interface IFunctionExport extends IExportDeclaration {

}

export interface IVariableExport extends IExportDeclaration {
    isConst: boolean;
    variableType?: any;
}

export interface IInterfaceExport extends IExportDeclaration {
    membersLen: number;
}

export interface IClassExport extends IInterfaceExport {
    isAngular?: boolean;
    selector?: string;
}

export interface IEnumExport extends IExportDeclaration {
    membersLen: number;
}

export class ExportsController {

    private exportsMap: Map<string, IExportDeclaration> = new Map<string, IExportDeclaration>();

    constructor() {

    }

    addDeclarationToMap(declaration: IExportDeclaration): void {
        this.exportsMap.set(declaration.name, declaration);

    }

    print(): string {
        const report: any = [];
        this.exportsMap.forEach((value, key) => {
            report.push({ [key]: value });
        });
        return report;

    }

}