import * as fs from 'fs'
import * as path from 'path';
import { TsParser } from '../parsers/tsParser';
import { ExportsParser } from '../plugins/exportsParser/exportsParser';
import { IExportDeclaration } from '../plugins/exportsParser/exportsController';
import { getPackageName, writeFile } from '../utils/utils';
import { NpmService } from '../services/npmService';

export interface INpmPackage {

    packageName: string;
    version: string;
    components: IExportDeclaration[];
    repo: string;
}

export class Generator {

    private readonly packagesPath = 'C:\\Work\\AST_parser\\packages';
    private NpmService: NpmService = new NpmService();

    constructor() {
    }

    async analyzePackages(): Promise<void> {
        const t0 = Date.now();
        const packageReport: INpmPackage[] = [];
        const packagesFolders = fs.readdirSync(this.packagesPath);
        console.log(`${packagesFolders.length} to analyze`);
        await Promise.all(packagesFolders.map(async (folder) => {
            packageReport.push(await this.getReportForPackage(folder));
        }));
        const report = JSON.stringify(packageReport, undefined, 4);
        console.log('--------------------');
        console.log(report.length);
        writeFile('C:\\Work\\AST_parser\\report.json', report);
        const t1 = Date.now();
        console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.')
    }

    getAllFilesFromDir(dir: string) {
        const files = [];

        readDir(dir);

        function readDir(packagePath: string): void {

            fs.readdirSync(packagePath).forEach(file => {
                const fileOrDirPath = path.resolve(packagePath, file);
                if (fs.lstatSync(fileOrDirPath).isDirectory()) {
                    readDir(fileOrDirPath);
                }
                if (path.extname(file).toLowerCase() === '.ts') {
                    files.push(fileOrDirPath)
                }
            });
        }

        return files;
    }

    private async getReportForPackage(folder: string): Promise<INpmPackage> {
        const packageFolder = path.resolve(this.packagesPath, folder);
        let components: IExportDeclaration[];
        if (fs.lstatSync(packageFolder).isDirectory()) {
            const tsFiles = this.getAllFilesFromDir(packageFolder);
            const tsParser = new TsParser(undefined, new ExportsParser());
            tsFiles.forEach(value => {
                tsParser.sourceFile = value;
                try {
                    tsParser.traverse();
                }
                catch (e) {
                    console.error(e);
                }
            });
            components = tsParser.getReport();
        }
        const packageName = getPackageName(packageFolder);
        let version, repo;
        [version, repo] = await Promise.all([this.NpmService.getLatestVersion(packageName), this.NpmService.getRepoUrl(packageName)]);
        return <INpmPackage>{ packageName, version, components, repo }
    }
}