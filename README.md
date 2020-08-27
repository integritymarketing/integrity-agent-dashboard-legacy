# Integrity Agent Portal

An agent portal implemented using React and [Create React App](https://create-react-app.dev/).

[https://www.medicarecenter.com](https://www.medicarecenter.com)

## Contents

- [Development](#Development)
  - [Environment Setup](#environment-setup)
  - [Key Libraries & Frameworks](#key-libraries--frameworks)
  - [Coding Standards](#coding-standards)
  - [Contributions](#contributions)
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
- [Redux](https://redux.js.org/): Redux is a predictable state container for JavaScript apps. It's used as the central data store.
- [Mirage](https://miragejs.com/): Mirage JS is an API mocking library used for local development. Familiarity is recommended if working directly with any APIs.

### Coding Standards

- The project has been built using the [Prettier](https://prettier.io/) code formatting engine. Please install and use when contributing.

- Implement React functional components only. Avoid the ES6 `Class` syntax.

- Include proper test coverage with pull requests.

### Contributions

- To contribute a feature or bugfix, create a branch from the default branch (`develop`) using the format:

  `feature/title-of-feature`<br />
  `bugfix/title-of-fix`

  When all tests are passing and code is ready for review, submit a pull request with a brief description + reference to the item you are working on from the backlog (eg, `this closes #12`)

## Project Structure

TBD

## Automated Testing

`yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

TBD -- info regarding different types of tests (eg unit, integration, e2e)

## Releases

1. To prepare a release, a PR from `develop` -> `release` (or `hotfix/name-of-fix` -> `release`) should be initiated.
2. Merging the PR will create a release build in both the UAT and QA [environments](#environements).
3. Once the build has passed QA, create a PR from `release` -> `master`.
4. Merging this PR will create and publish a build on stage, as well as create an un-published build in the production site.
5. Once the release build is merged to master, a github release should be created with the appropriate version tag (eg `1.0.2`).

## Error logging

[Sentry](https://sentry.io/organizations/integrity-marketing-org/issues/?project=5316442) used to track errors, and is also integrated into the netlify build process.

## Environments

All builds are automatically created via Netlify's out of the box CI/CD build process to the five environments below.
There are two build targets. App + Auth

### Build Target: Portal App

The Portal App is the default build. I will be triggered by default with or with out the `REACT_APP_BUILD_TARGET=app` env variable. (see [Build Target: Auth](#build-target-auth-app))

#### Production

CNAME [https://www.medicarecenter.com](https://identity.medicarecenter.com) -> [https://ae-agent-portal-prod.netlify.app/](https://ae-agent-portal-prod.netlify.app/)

Automatically built from the `master` branch. All builds must be manually published.

#### Stage

Automatically built + published from the `master` branch.

CNAME [https://ae-stage.integritymarketinggroup.com](https://ae-stage.integritymarketinggroup.com) -> [https://ae-agent-portal-stage.netlify.app/](https://ae-agent-portal-stage.netlify.app/)

#### UAT

Automatically built + published from the `release` branch.

CNAME [https://ae-uat.integritymarketinggroup.com](https://ae-uat.integritymarketinggroup.com) -> [https://ae-agent-portal-uat.netlify.app/](https://ae-agent-portal-uat.netlify.app/)

#### QA

Automatically built + published from the `release` branch.

CNAME [https://ae-qa.integritymarketinggroup.com](https://ae-qa.integritymarketinggroup.com) -> [https://ae-agent-portal-qa.netlify.app/](https://ae-agent-portal-qa.netlify.app/)

#### Development

Automatically built + published from the `develop` branch.

CNAME [https://ae-dev.integritymarketinggroup.com](https://ae-dev.integritymarketinggroup.com) -> [https://ae-agent-portal-develop.netlify.app/](https://ae-agent-portal-develop.netlify.app/)

Deploy preview apps are also automatically generated with each new pull request created. (eg. https://deploy-preview-x--ae-agent-portal-develop.netlify.app/)

### Build Target: Auth App

Auth target builds are triggered using the `REACT_APP_BUILD_TARGET=auth` env variable.

#### Production

CNAME [https://identity.medicarecenter.com](https://identity.medicarecenter.com) -> [https://ae-auth-prod.netlify.app/](https://ae-auth-prod.netlify.app/)

Automatically built from the `master` branch. All builds must be manually published.

#### Stage

Automatically built + published from the `master` branch.

CNAME [https://ae-identity-stage.integritymarketinggroup.com](https://ae-identity-stage.integritymarketinggroup.com) -> [https://ae-auth-stage.netlify.app/](https://ae-auth-stage.netlify.app/)

#### UAT

Automatically built + published from the `release` branch.

CNAME [https://aidentity-e-uat.integritymarketinggroup.com](https://aidentity-e-uat.integritymarketinggroup.com) -> [https://ae-auth-uat.netlify.app/](https://ae-auth-uat.netlify.app/)

#### QA

Automatically built + published from the `release` branch.

CNAME [https://identity-ae-qa.integritymarketinggroup.com](https://identity-ae-qa.integritymarketinggroup.com) -> [https://ae-auth-qa.netlify.app/](https://ae-auth-qa.netlify.app/)

#### Development

Automatically built + published from the `develop` branch.

CNAME [https://aidentity-e-dev.integritymarketinggroup.com](https://aidentity-e-dev.integritymarketinggroup.com) -> [https://ae-auth-develop.netlify.app/](https://ae-auth-develop.netlify.app/)

### Certs

A non-prod wild-card cert has been installed for the non-prod (dev, qa, uat, stage) environments.

Commands used to parse pfx file and upload to Netlify

pem
`openssl pkcs12 -in vfm.pfx -clcerts -nokeys | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > clientcert.cer`

private key
`openssl pkcs12 -in vfm.pfx -nocerts -nodes | sed -ne '/-BEGIN PRIVATE KEY-/,/-END PRIVATE KEY-/p' > clientcert.key`

ca certs
`openssl pkcs12 -in vfm.pfx -cacerts -out cacerts.cer`
