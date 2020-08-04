# Integrity Agent Portal

An agent portal implemented using React and [Create React App](https://create-react-app.dev/).

[Main Portal App](https://ae-agent-portal-prod.netlify.app)

[Auth App](https://ae-auth-prod.netlify.app)

## Contents

- [Development](#Development)
  - [Environment Setup](#environment-setup)
  - [Key Libraries & Frameworks](#key-libraries--frameworks)
  - [Coding Standards](#coding-standards)
  - [Contributions](#contributions)
- [Project Structure](#project-structure)
- [Automated Testing](#automated-testing)
- [Environments](#environments)
- [Error Logging](#error-logging)

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

## Environments

All builds are automatically created via Netlify's out of the box CI/CD build process to the four environments below.
There are two build targets. App + Auth

### Build Target: App

Typical App target builds are triggered using the `REACT_APP_BUILD_TARGET=app` env variable.

#### Development

[https://ae-agent-portal-develop.netlify.app/](https://ae-agent-portal-develop.netlify.app/)

Automatically built + published from the `develop` branch.

Deploy preview apps are also automatically generated with each new pull request created. (eg. https://deploy-preview-x--ae-agent-portal-develop.netlify.app/)

#### QA

[https://ae-agent-portal-qa.netlify.app/](https://ae-agent-portal-qa.netlify.app/)

Automatically built + published from the `develop` branch.

#### Stage

[https://ae-agent-portal-stage.netlify.app/](https://ae-agent-portal-stage.netlify.app/)

Automatically built + published from the `master` branch.

#### Production

[https://ae-agent-portal-prod.netlify.app/](https://ae-agent-portal-prod.netlify.app/)

Automatically built from the `master` branch. All builds must be manually published.

### Build Target: Auth

Auth target builds are triggered using the `REACT_APP_BUILD_TARGET=auth` env variable.

#### Production

[https://ae-auth-prod.netlify.app/](https://ae-auth-prod.netlify.app/)

Automatically built from the `master` branch. All builds must be manually published.

## Error logging

[Sentry](https://sentry.io/organizations/integrity-marketing-org/issues/?project=5316442) used to track errors, and is also integrated into the netlify build process.
