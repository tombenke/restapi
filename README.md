# restapi - A simple Node.js module to document, emulate and test RESTful APIs. 

TBD.

## Installation

### Preprequisites:

TBD.

### Installation steps

TBD.

## Using

### Generate a new REST API project:

    $ restapi create <project-name>

for example:

    $ restapi create crm-api

#### The REST API project layout generated by the `restapi` utility

config.yml
: The configuration parameters of the REST API project

server
: The mock server with the mock implementation of the API

docs
: The HTMl format documentation of the REST API

templates
: The customizable templates used by the documentation generator and the test case generator.

templates/docs
: Documentation templates, stylesheets, and images

templates/test
: JavaScript test-case templates to generate unit test code, which will run with mocha and supertest

test
: The test cases generated by the `restapi` utility

Makefile
: Makefile to run the test cases. Used by mocha and jenkins


### Update(/generate) documentations:

    $ restapi docs --update

### Update(/generate) test cases:

    $ restapi test --update --overwrite

### Run the mock server:

    $ cd ./server
    $ node server.js

### Run test cases:

    $ make test

or

    $ mocha

