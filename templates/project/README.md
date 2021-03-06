# About

This project was generated by the restapi tool. Its main purpose is to create and run tests against your RESTful API using a declarative descriptor as input.
The service descriptors are yaml files under the `services folder`.
YAML is a user friendly, easily writable format.
The descriptor is both a documentation of your RESTful API and the input for the test generator.

## Preprequisites

To use this project, you will need the following software installed on your machine:

- [Node.js](http://nodejs.org/),
- [NPM](https://npmjs.org/),
- [restapi](https://github.com/tombenke/restapi).

If you want to change the stylesheets of the generated documentation of the API, you will also need:

- [Sass](http://sass-lang.com/), and
- [Compass](http://compass-style.org/).

After, you have created the new project, move into the new projects folder, and install those node modules, the new project needs:

    $ cd crm-api
    $ npm install

If you want to use the mock server too, then do this also in its subfolder:

    $ cd server
    $ npm install


## Further readings

To learn more on how to setup the project, and how to use the tool visit the [restapi  project repository](https://github.com/tombenke/restapi) on GitHub.