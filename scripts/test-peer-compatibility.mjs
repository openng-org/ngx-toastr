// @ts-check
import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const supportedAngularMajors = new Set(['20', '21', '22']);
const typescriptRanges = {
  ['20']: '>=5.8.0 <6.0.0',
  ['21']: '>=5.9.0 <6.0.0',
  ['22']: '>=6.0.0 <6.1.0',
};
const angularMajor = /** @type {keyof typeof typescriptRanges} */ (process.argv[2]);

if (!supportedAngularMajors.has(angularMajor)) {
  throw new Error(`Version ${angularMajor} must be: ${[...supportedAngularMajors].join(', ')}`);
}

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const libraryPath = path.join(repositoryRoot, 'dist', 'ngx-toastr');
const consumerPath = await fs.mkdtemp(path.join(tmpdir(), `ngx-toastr-angular-${angularMajor}-`));
const sourcePath = path.join(consumerPath, 'src');
const commandEnvironment = { ...process.env, NG_CLI_ANALYTICS: 'false' };

const packageJson = {
  private: true,
  scripts: {
    build: 'ng build --no-progress',
  },
  dependencies: {
    '@angular/common': angularMajor,
    '@angular/compiler': angularMajor,
    '@angular/core': angularMajor,
    '@angular/platform-browser': angularMajor,
    '@openng/ngx-toastr': `file:${libraryPath}`,
    rxjs: '7.8.2',
    tslib: '2.8.1',
  },
  devDependencies: {
    '@angular/build': angularMajor,
    '@angular/cli': angularMajor,
    '@angular/compiler-cli': angularMajor,
    typescript: typescriptRanges[angularMajor],
  },
};

const angularJson = {
  version: 1,
  projects: {
    consumer: {
      projectType: 'application',
      root: '',
      sourceRoot: 'src',
      architect: {
        build: {
          builder: '@angular/build:application',
          options: {
            browser: 'src/main.ts',
            index: 'src/index.html',
            tsConfig: 'tsconfig.json',
            outputPath: 'dist',
          },
        },
      },
    },
  },
};

const tsconfigJson = {
  compilerOptions: {
    target: 'ES2022',
    module: 'preserve',
    moduleResolution: 'bundler',
    strict: true,
    isolatedModules: true,
    experimentalDecorators: true,
    importHelpers: true,
    skipLibCheck: true,
  },
  angularCompilerOptions: {
    strictTemplates: true,
  },
  files: ['src/main.ts'],
};

const main = `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideToastr } from '@openng/ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  template: 'Compatible',
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideToastr()],
});
`;

const indexHtml = '<app-root></app-root>';

try {
  await fs.mkdir(sourcePath);
  await fs.writeFile(path.join(consumerPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  await fs.writeFile(path.join(consumerPath, 'angular.json'), JSON.stringify(angularJson, null, 2));
  await fs.writeFile(
    path.join(consumerPath, 'tsconfig.json'),
    JSON.stringify(tsconfigJson, null, 2),
  );
  await fs.writeFile(path.join(sourcePath, 'main.ts'), main);
  await fs.writeFile(path.join(sourcePath, 'index.html'), indexHtml);

  await execFileAsync('npm', ['install', '--no-audit', '--no-fund', '--package-lock=false'], {
    cwd: consumerPath,
    env: commandEnvironment,
  });
  await execFileAsync('npm', ['run', 'build'], {
    cwd: consumerPath,
    env: commandEnvironment,
  });
} finally {
  await fs.rm(consumerPath, { recursive: true, force: true });
}
