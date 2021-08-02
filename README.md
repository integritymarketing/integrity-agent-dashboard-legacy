# Integrity Agent Portal

An agent portal implemented using React and [Create React App](https://create-react-app.dev/).

[https://www.medicarecenter.com](https://www.medicarecenter.com)

## Contents

- [Development](#Development)
  - [Local env setup](#local-env-setup)
    - [Portal App](#portal-app)
    - [Auth App](#auth-app)
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

### Local ENV Setup

#### Portal App

1. Add a `.env` file to project root
   (see `.env.sample` and/or request a working `.env` from another developer)
2. `yarn install`
3. `yarn start`

The portal app should now be running on http://localhost:3000/

#### Auth App

The auth app is a separate react app that controls the front-end for Identity Server (authentication).

##### Part 1

For local development, you can run the front-end auth app in a similar way to the portal:

1. Add a `.env` file to project root
   (see `.env.sample` and/or request a working `.env` from another developer)
2. `yarn install`
3. `yarn start:auth`

The auth app should be running on http://localhost:3001/

##### Part 2

You will also need to clone the Identity Server code base and run it locally.

1. Download Visual Studio
2. Clone the Identity Server project within VS (after adding your ssh key)

`IntegrityMarketing@vs-ssh.visualstudio.com:v3/IntegrityMarketing/AgentEnablement/ae-identity-service`

3. check out the `feature/local-dev` branch

4. request non-versioned key vault values for `appsettings.Development.json` file in the project root. eg

```
  "KeyVault": {
    "Vault": "",
    "ClientId": "",
    "ClientSecret": ""
  }
```

5. run the project in visual studio (by default, this will run on http://localhost:5000)

6. note, SSL is required to run Identity Server locally. Either set-up a local SSL cert, or use a reverse proxy like ngrok to setup an SSL connection to port 5000.

7. in the `.env.local` config file (used for both auth + portal apps), set the following env vars to the https version of identity server eg

```
REACT_APP_AUTH_AUTHORITY_URL="https://dd23a78795e6.ngrok.io"
REACT_APP_AUTH_BASE_URL="https://dd23a78795e6.ngrok.io"
```

(restart the portal + auth app after updating env vars)

Phew!

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

  When all tests are passing and code is ready for review, submit a pull request with a URL reference to the item you are working on from the backlog + any supporting description / detail as necessary.

### Known Issues

- `react-helmet` [#548](https://github.com/nfl/react-helmet/issues/548): There is a console error warning about UNSAFE_componentWillMount in strict mode.

#### Window dev environment issues

Windows requires CRLF (carraige Return & Line Feed), where Linux requires LF(Line feed)

```
Error: resolve-url-loader: CSS error. source-map information is not available at url() declaration (found orphan CR, try removeCR option)
```

Temporary solution: if you ever came a cross such error then do this

```
Path: ae-agent-portal\node_modules\resolve-url-loader\index.js
Step 1: locate folder called "resolve-url-loader" inside "node_modules".
Step 2: open up the folder and look for "index.js". And open up that file.
Step 3: Inside "index.js", look for "var option".
example:var options = Object.assign(
    {
      sourceMap: loader.sourceMap,
      engine   : 'postcss',
      silent   : false,
      absolute : false,
      keepQuery: false,
      removeCR : false,
      root     : false,
      debug    : false,
      join     : joinFn.defaultJoin
    },
Step 4: Look for "removeCR" which is turned "false". Turn it to "true" and save the changes.
Step 5: restart your app either by "yarn start" or "npm start". Error will be gone.
```

Note: do this every time whenever you came across such an error.

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

## Getting Started with Storybook

Storybook is an open-source tool for developing UI components in isolation for React, Vue, Angular, and more. (https://storybook.js.org/).
It is only used for building UI components and keeping react application(business logic) separate. React is all about creating multiple components it will be difficult to know every component we have in project and how it works. So, Storybook provides us with an instrument to have all components more structured and make it easy for other dev’s to easily understand about each component.

## To run Storybook

- Components can be easily visualized when you run the storybook through this

- npm run storybook (windows) or yarn storybook(mac/ubuntu)

- this command will build all the stories that you've written and build useful ui for that so you can browse them easily and it
  becomes extremely useful when you have a big code base.
