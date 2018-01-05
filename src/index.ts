import { readFileSync } from 'fs';
import * as ts from 'typescript'
import { Generator } from './generators/generator';

const fileName = 'C:\\Work\\AST_parser\\packageList.component.ts';
const sourceFile = ts.createSourceFile
('packageList.component', readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);
new Generator().analyzePackages();