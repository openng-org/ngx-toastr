import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { lastValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ngAdd } from './index';

describe('ng-add', () => {
  it('adds the provider and default styles to a standalone application', async () => {
    // Arrange
    const runner = new SchematicTestRunner('test', require.resolve('../collection.json'));
    const tree = Tree.empty();
    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          test: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: {
                  browser: 'src/main.ts',
                  styles: ['src/styles.css'],
                },
              },
            },
          },
        },
      }),
    );
    tree.create(
      '/src/main.ts',
      "import { bootstrapApplication } from '@angular/platform-browser';\n" +
        "import { AppComponent } from './app/app.component';\n\n" +
        'bootstrapApplication(AppComponent);\n',
    );

    // Act
    const result = await lastValueFrom(runner.callRule(ngAdd({}), tree));
    const workspace = await getWorkspace(result);
    const main = result.readText('/src/main.ts');

    // Assert
    expect(main).toContain("import { provideToastr } from '@openng/ngx-toastr';");
    expect(main).toContain('providers: [provideToastr()]');
    expect(workspace.projects.get('test')?.targets.get('build')?.options?.['styles']).toEqual([
      'src/styles.css',
      'node_modules/@openng/ngx-toastr/toastr.css',
    ]);
  });
});
