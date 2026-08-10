# Releasing

This project uses **Release Please**.

## Release flow

1. Merge changes into `main` using Conventional Commit titles.
2. Release Please creates or updates a release pull request.
3. Review the proposed version and changelog, wait for CI, and merge the pull request.
4. Release Please creates a `vX.Y.Z` tag and GitHub release.
5. The Publish workflow publishes `@openng/ngx-toastr` to npm.

## Versioning

Release Please derives the next version from commits that change `projects/ngx-toastr`:

| Commit title                                | Version change |
| ------------------------------------------- | -------------- |
| `fix: correct timeout handling`             | Patch          |
| `feat: add a toast option`                  | Minor          |
| `feat!: change the public API`              | Major          |
| `docs:`, `test:`, `build:`, `ci:`, `chore:` | None           |

For squash merges, make the pull request title a Conventional Commit.
Add a `BREAKING CHANGE:` footer when a breaking change needs more detail.

## Recovery

Rerun a failed Publish workflow after correcting its configuration.
The workflow exits successfully if that version is already on npm.
Never reuse a published npm version; merge a fix and release a new patch instead.

## Initial Setup

### GitHub App

Release Please uses a GitHub App so its pull requests run CI and its releases start the Publish workflow.

1. Create and install a GitHub App for this repository.
2. Give the app read and write access to Contents, Issues, and Pull requests.
3. Add the app client ID as the repository variable `RELEASE_PLEASE_APP_CLIENT_ID`.
4. Generate a private key and add it as the repository secret `RELEASE_PLEASE_APP_PRIVATE_KEY`.

### First npm release

The package must exist on npm before trusted publishing can be configured.
Use a token once to publish the first version:

1. Create an npm access token that can publish packages in the `@openng` scope.
2. Add the token as the repository secret `NPM_TOKEN`.
3. Merge the first Release Please pull request.
4. Confirm that `@openng/ngx-toastr` was published.
5. In the npm package settings, add a GitHub Actions trusted publisher for repository `openng-org/ngx-toastr` and workflow `publish.yml`.
6. Allow `npm publish`, then delete the `NPM_TOKEN` repository secret.
7. Require two-factor authentication and disallow token-based publishing in the npm package settings.

Later releases use npm's short-lived OIDC credentials.
When `NPM_TOKEN` is absent, npm uses OIDC.
