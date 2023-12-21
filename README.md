# Integrity Agent Portal

An agent portal implemented using React and [Create React App](https://create-react-app.dev/).

[https://www.clients.integrity.com](https://www.clients.integrity.com)

## Contents

-   [Development](#Development)
    -   [Local env setup](#local-env-setup)
        -   [Portal App](#portal-app)
        -   [Auth App](#auth-app)
    -   [Key Libraries & Frameworks](#key-libraries--frameworks)
    -   [Coding Standards](#coding-standards)
    -   [Contributions](#contributions)
    -   [Known Issues](#known-issues)
-   [Project Structure](#project-structure)
-   [Automated Testing](#automated-testing)
-   [Releases](#releases)
-   [Error Logging](#error-logging)
-   [Environments](#environments)
    -   [Build Target: Portal App](##build-target-portal-app)
    -   [Build Target: Auth App](#build-target-auth-app)
    -   [Certs](#certs)

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

For local development, you can run the front-end auth app in a similar way to the portal:

1. Add a `.env` file to project root
   (see `.env.sample` and/or request a working `.env` from another developer)
2. `yarn install`
3. `yarn start:auth`

The auth app should be running on http://localhost:3001/

Note that w/ current environments, you need to request a config chance to the identity server dev app to do local development on the auth app forms.

In the future, the data team plans to build a separate 'localhost' environment to enable easier local dev for the auth app.

### Key Libraries & Frameworks

This project is built on a few fundamental libraries & frameworks and assumes a working knowledge of the following:

-   [React & JSX](https://reactjs.org/): Componentization & view layer framework.

### Coding Standards

-   The project has been built using the [Prettier](https://prettier.io/) code formatting engine. Please install and use when contributing.

-   Implement React functional components only. Avoid the ES6 `Class` syntax.

-   Include proper test coverage with pull requests.

-   Please also review the [coding conventions](https://github.com/integritymarketing/ae-consumer-platform#conventions) defined on the consumer site.

### Contributions

-   To contribute a feature or bugfix, create a branch from the default branch (`develop`) using the format:

    `feature/title-of-feature`<br />
    `bugfix/title-of-fix`

    When all tests are passing and code is ready for review, submit a pull request with a URL reference to the item you are working on from the backlog + any supporting description / detail as necessary.

### Known Issues

-   `react-helmet` [#548](https://github.com/nfl/react-helmet/issues/548): There is a console error warning about UNSAFE_componentWillMount in strict mode.

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

1. To prepare a normal release, a PR from `develop` -> `release`. The PR should be titled as a release candidate (RC), and should be in the format `RC-major.minor.micro` (eg RC-2.1.2) to indicate the release candidate version number. (Alternatively, if a hotfix release is needed, a PR should be cut from the current release branch, and targetted to release w/ the format `Hotfix-major.minor.micro.hotfix_num`)
2. The new version number should be set for each release in the package.json file. This version variable is tied directly to the Sentry integration and is automatically added to the Netlify build.
3. When ready for UAT testing, merging the RC or Hotfix PR to release will create and publish a release build in both the UAT and Stage [environments](#environments). It will also create a build in the production environment, however production builds need to be manually published.
4. Once everything is good on UAT and/or Stage, open a new PR titled `Release major.minor.micro` from `release` -> `main`.
5. Releasing to producting is as simple as publishing the latest release build that is currently on prod, but un-published. (NOTE: it is important that you publish the build in both the main medicare center app, as well as the auth app. Usually there are no changes to the auth app, but it's good to keep it up-to-date and at the same version as the main production app).
6. Rolling back: In the event a rollback is needed, simply re-publish the last build that was live in production. On Netlify, this will swap the build out in less than a second.
7. Once the release build on production has been smoke tested and cleared, merge the Release PR into Main, then draft and publish a new release in github (which also tags the release). The tag should be created with the appropriate version tag in the format (eg `v2.1.2`). Documenting the new release happens [here in github](https://github.com/integritymarketing/ae-agent-portal/releases).

## Error logging

[Sentry](https://sentry.io/organizations/integrity-marketing-org/issues/?project=5316442) used to track errors, and is also integrated into the netlify build process.

## Environments

All builds are automatically created via Netlify's out of the box CI/CD build process to the environments documented below.
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

-   Components can be easily visualized when you run the storybook through this

-   npm run storybook (windows) or yarn storybook(mac/ubuntu)

-   this command will build all the stories that you've written and build useful ui for that so you can browse them easily and it
    becomes extremely useful when you have a big code base.
