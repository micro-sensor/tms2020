# Question Management System Client

## Overview

QMS client provides the user interface for the QMS service. The service allows logged-in admin-level users to manage test questions. In particular Categories, Languages and Questions.

### User perspective

- Category has a name and description (e.g. Basic, Math Related, ORM Questions, Logical, System Design)
- Language has a name (Puthon, Java, C#)
- Question consists of title(name), level(integer difficulty 1-5), text body, answers and code-snippets
  -- Question belongs to zero to many categories
  -- Question includes zero to many languages and their related code-snippets

##### Example:

title: Explain Forloop,
level: 2,
body: How many times will be the following for-loop executed?,
categories: [Basic],
languages: [JS, Java],
code-snippets:

JS

```sh
for (var=0;var<=5;var=var+1)
{code to be executed}
```

Java

```sh
for (int i=0;i<=5;i++)
{code to be executed}
```

The test questions are generated based on the Set of questions defined with this QMS service.

### Developer perspective

This is a simple [React] project. Communicating with the QMS backend through standard [REST] api sending objects as [JSON]s. The project is build with NPM and is based on react's basic configuration https://reactjs.org/docs/create-a-new-react-app.html.

- For the UI components we use material-ui (https://v3-3-0.material-ui.com/) - a react implementation of google's material design.
- To handle back-end calls we use Axios js - Promise based HTTP client
- To handle security we use keycloak-js adapter which provides all the communication with keycloak single-sign on server and also intercepts the axios calls to include bearer token in header
- lastly, there are some smaller dependencies like UUID generator, lodash to provide debounce function, react-ionicons and react-table.

## Depoloyment Guide

### Run Locally

First, you need the [Node.js] package manager. We recommend installing it through [homebrew].

```sh
brew update
brew install node
```

Next, check this repository, cd inside and run:

```sh
npm install
npm start
```

These commands should download all dependencies and start your local development server. The project should be now running at http://localhost:3000 .
Make sure you set up correct IP addresses for Keycloak and QMS backend service at `/src/configuration.js` and update your `public/keycloak.json` according to the keycloak setup (either connect to your production keycloak, or run keycloak locally, or turn off security).

### Production deployment

If you want to create production-ready build, set-up your `configuration.js` to point to the production services. Update your keycloak configuration at `public/keycloak.js` (to find out more about keycloak configuration, check the user-management and user-authentication services) and then run:

```sh
npm run-script build
```

npm will produce the resulting App into `/build` folder. This folder can be then served via NGINX as any other static content. For more details on installing NGINX follow https://www.nginx.com/resources/wiki/start/topics/tutorials/install/ , for serving static content check https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/ .

## Developer Guide

### Configuration

The project dependencies can be configured in `package.json`. To add dependency or upgrade to newer version, just edit this file and run `npm install`.

Configuration of Keycloak and QMS backend ip addresses can be found at `/src/configuration.js`. Keycloak json confuguration file belongs to `public/keycloak.json`. In the public folder, there is the html index as well as favicon for the project.

Then the project follows simplified standard structure, `index.js` is the root component which mounts react to the html DOM. Currently, it renders `<Security />` component.

### Security

Since the whole app is accessible only after loggin-in as admin, the security component is the root. It provides the keycloak connection capabilities as well as obtaining the userName and roles. In case, user is not logged in, security will redirect to keycloak login page, after succesfull authentication the user is redirected back to the origin`. When deploying in production, make sure you add your app path to the keycloak's`Client -> Qms-frontend` realm as Web Origin and Valid Redirect URI. If you don't do that, keycloak will throw wrong redirect exception.

In case, you wish to turn off the security completely for debugging reasons, you can mount the `<TopLevelContainer />` directly at `index.js` and go around the security. You might have to comment out the logout button at `appWrap/index.js` then, since it would lack the information provided by the security.

### TopLevel Container

Our app is very small, therefore we put all the globa-scale functionality into a single root container. So, the `<TopLevelContainer />` gives us a variety of functions:

- Material UI Theme Provider - to allow CSS in JS styles across the app. (global theme can be configured in the createMuiTheme function, for now we just specify basic colors and height of the navigation bar)
- Routing - with react-router-dom we display components based on URL. This is a single-page application, the page does not refresh, so react router needs to handle the URL changes and in-app routing.
  -- currently we have 5 routes: home, category, language, questions overview (/question) and question detail (/question/edit/:id)
  -- All the routes are wrapped in common frame (menu, top bar...)
- Snack management - snacks are the small information green/red cards showing in the lower left corner, giving user direct feedback on her actions. (e.g. "Success, question was created."). Function to show a snack (`props.showSnack(message:string, isSuccess: boolean)`) can be called from anywhere in the system, that means the definition is in the top component (since we don't use any global state manager like Redux for the sake of simplicity).
- Confirm Dialogs - another globally accessible function. We want to call a function on buttonClick, but we need user to confirm. This is a convenient way, how to provide simple confirm dialog. Can be called by `this.props.showConfirmDialog(text: string, function)`.

### AppWrap Component

All the routes are wrapped in AppWrap. This component renders the application's frame which stays the same for all routes (top bar, menu). It also renders the SnackBar and confirm dialogs according to TopLevel component's state. If you wish to change the styles, add menu items, etc. this is the place to go.

### Other containers

Then the structure is similar for all remaining containers (category, language, question, questionEdit). `index.js` includes the container class itself.

Container manages the data loading, component actions etc. `api.js` specifies functions providing the API calls. These functions return Promise objects, which we use in the `index.js` for interaction with the backend. Each container has it's own `api.js` file, so that different andpoints do not end-up mixed together.

Usually, there is another subfolder with components. These are dumb functions only displaying the data from containers. We separate the data-management logic from the visual representation.

### CSS in JS

Components are wrapped with `withStyles(styles)(Component)`, function which provides them with styles. The style classes are defined in the same file as the components in `const styles = theme => ({...});`. It makes much more sense writing style together with the component rather than in a single common CSS file. The shared styles come from theme, while the component-specific ones are with the component. This way we decouple one component from each other and we do not have to worry that change in a giant CSS would affect random components somewhere else in the system. Styles are then applicable by using `className={classes.styleClassName}`. More about CSS in JS can be found at https://v3-3-0.material-ui.com/customization/css-in-js/#.

[react]: https://reactjs.org/
[rest]: https://restfulapi.net/
[json]: https://restfulapi.net/introduction-to-json/
[homebrew]: https://brew.sh/

### Video

User interface & brief deployment video https://www.youtube.com/watch?v=8-_sg0kHk1c&feature=youtu.be
