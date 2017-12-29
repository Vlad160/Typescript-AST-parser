import * as ts from 'typescript';

export interface IPlugin {
    parse(node: ts.Node): void;
}