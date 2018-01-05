import * as ts from 'typescript';

export interface IPlugin {
    parse(node: ts.Node): void;

    print(): any;

    sourceFile: ts.SourceFile;
}

// export abstract class AbstractPlugin {
// }