# Integrity Agent Portal

An agent portal implemented using React and [Create React App](https://create-react-app.dev/).

[https://www.medicarecenter.com](https://www.medicarecenter.com)

## Contents

- [Development](#Development)
  - [Environment Setup](#environment-setup)
  - [Key Libraries & Frameworks](#key-libraries--frameworks)
  - [Coding Standards](#coding-standards)
  - [Contributions](#contributions)
  - [Known Issues](#known-issues)
- [Project Structure](#project-structure)
- [Automated Testing](#automated-testing)
- [Releases](#releases)
- [Error Logging](#error-logging)
- [Environments](#environments)
  - [Build Target: Portal App](##build-target-portal-app)
  - [Build Target: Auth App](#build-target-auth-app)
  - [Certs](#certs)

## Development

### Environment Setup

1. Add a `.env` file to project root
   (see `.env.sample` and/or request a working `.env` from another developer)
2. `yarn install`
3. `yarn start`

### Key Libraries & Frameworks

This project is built on a few fundamental libraries & frameworks and assumes a working knowledge of the following:

- [React & JSX](https://reactjs.org/): Componentization & view layer framework.

### Coding Standards

- The project has been built using the [Prettier](https://prettier.io/) code formatting engine. Please install and use when contributing.

- Implement React functional components only. Avoid the ES6 `Class` syntax.

- Include proper test coverage with pull requests.

### Contributions

- To contribute a feature or bugfix, create a branch from the default branch (`develop`) using the format:

  `feature/title-of-feature`<br />
  `bugfix/title-of-fix`

  When all tests are passing and code is ready for review, submit a pull request with a brief description + reference to the item you are working on from the backlog (eg, `this closes #12`)

### Known Issues

- `react-helmet` [#548](https://github.com/nfl/react-helmet/issues/548): There is a console error warning about UNSAFE_componentWillMount in strict mode.

## Project Structure

TBD

## Automated Testing

`yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

TBD -- info regarding different types of tests (eg unit, integration, e2e)

## Releases

1. To prepare a release, a PR from `develop` -> `release` (or `hotfix/name-of-fix` -> `release`) should be initiated.
2. The new version number should be set for each release in the netlify.toml file under then `REACT_APP_VERSION` variable. This version variable is tied directly to the Sentry integration.
3. Merging the PR will create a release build in both the UAT and QA [environments](#environements).
4. Once the build has passed QA, create a PR from `release` -> `master`.
5. Merging this PR will create and publish a build on stage, as well as create an un-published build in the production site.
6. Once the release build is merged to master, a github release should be created with the appropriate version tag (eg `1.0.2`).

## Error logging

[Sentry](https://sentry.io/organizations/integrity-marketing-org/issues/?project=5316442) used to track errors, and is also integrated into the netlify build process.

## Environments

All builds are automatically created via Netlify's out of the box CI/CD build process to the five environments below.
There are two build targets. App + Auth

### Build Target: Portal App

The Portal App is the default build. I will be triggered by default with or with out the `REACT_APP_BUILD_TARGET=app` env variable. (see [Build Target: Auth](#build-target-auth-app))

See [ADO Front-end Portal Environments Wiki](https://integritymarketing.visualstudio.com/AgentEnablement/_wiki/wikis/AgentEnablement.wiki/79/Environments?anchor=portal-app)

### Build Target: Auth App

Auth target builds are triggered using the `REACT_APP_BUILD_TARGET=auth` env variable.

See [ADO Front-end Auth App Environments Wiki](https://integritymarketing.visualstudio.com/AgentEnablement/_wiki/wikis/AgentEnablement.wiki/79/Environments?anchor=authentication-app)

### Certs

A non-prod wild-card cert has been installed for the non-prod (dev, qa, uat, stage) environments.

Commands used to parse pfx file and upload to Netlify

pem
`openssl pkcs12 -in vfm.pfx -clcerts -nokeys | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > clientcert.cer`

private key
`openssl pkcs12 -in vfm.pfx -nocerts -nodes | sed -ne '/-BEGIN PRIVATE KEY-/,/-END PRIVATE KEY-/p' > clientcert.key`

ca certs
`openssl pkcs12 -in vfm.pfx -cacerts -out cacerts.cer`
