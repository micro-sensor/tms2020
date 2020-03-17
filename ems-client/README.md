# BaseApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Styles

Using [Bulma]() for styling. Including Bulma as described [here](https://scotch.io/courses/build-your-first-angular-website/adding-bulma-css-to-an-angular-app). Run `npm install --save bulma` and then add `"../node_modules/bulma/css/bulma.css"` in `angular.json` or `@import 'bulma/css/bulma.css';` in `styles.scss`.

## Page setup

All code is wrapped inside:

```
<div id="wrapper" class="content">
 
</div>
```
This ensure styles rendering, applying bulma.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
