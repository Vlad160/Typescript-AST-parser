import * as npm from 'npm';
import { ConfigOptions } from 'npm';

export class NpmService {

    private readonly defaultConfig = { loglevel: 'silent' };

    constructor() {
    }

    async getLatestVersion(packageName: string): Promise<string> {
        await this.loadNpm(this.defaultConfig);
        return new Promise<string>((resolve, reject) => {
            npm.commands.view([packageName, 'version'], ((err: Error, result: string) =>
                    err ? reject(err) : resolve(Object.keys(result)[0])
            ))
        })

    }

    async getRepoUrl(packageName: string): Promise<string> {
        await this.loadNpm(this.defaultConfig);
        return new Promise<string>((resolve, reject) => {
            npm.commands.view([packageName, 'repository.url'], ((err, result) => {
                if (err || !result) {
                    reject(err);
                    return;
                }
                const version = Object.keys(result)[0];
                // It's possible to access also with .git url, but it's made for future url build to files on git
                const repoUrl = result[version]['repository.url'].replace('.git', '/browse');
                resolve(repoUrl);
            }))
        })

    }

    loadNpm(config: ConfigOptions): Promise<void | Error> {
        return new Promise<void | Error>(((resolve, reject) => {
            npm.load(config, ((err, result) => result ? resolve() : reject(err)))
        }));

    }

}