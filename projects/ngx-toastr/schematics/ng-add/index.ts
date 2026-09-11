import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { addRootProvider, ProjectDefinition } from '@schematics/angular/utility';
import { getWorkspace, writeWorkspace } from '@schematics/angular/utility/workspace';
import { Schema } from './schema';

const PACKAGE_NAME = '@openng/ngx-toastr';

export function ngAdd(options: Schema): Rule {
  return async tree => {
    const workspace = await getWorkspace(tree);
    const [projectName, project] = resolveProject(workspace.projects, options.project);
    const buildOptions = project.targets.get('build')?.options;
    if (!buildOptions) {
      throw new SchematicsException('The application build options could not be determined.');
    }

    const styles = buildOptions['styles'];
    buildOptions['styles'] = [
      ...(Array.isArray(styles) ? styles : []),
      `node_modules/${PACKAGE_NAME}/toastr.css`,
    ];
    await writeWorkspace(tree, workspace);

    return addRootProvider(
      projectName,
      ({ code, external }) => code`${external('provideToastr', PACKAGE_NAME)}()`,
    );
  };
}

function resolveProject(
  projects: ReadonlyMap<string, ProjectDefinition>,
  requestedProject?: string,
): [string, ProjectDefinition] {
  if (requestedProject) {
    const project = projects.get(requestedProject);
    if (!project) {
      throw new SchematicsException(`Project "${requestedProject}" was not found.`);
    }

    return [requestedProject, project];
  }

  const applications = [...projects].filter(
    ([, project]) => project.extensions['projectType'] === 'application',
  );
  if (applications.length !== 1) {
    throw new SchematicsException('Specify the application to configure with --project.');
  }

  return applications[0];
}
