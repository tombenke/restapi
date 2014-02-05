# Implemented
- restapi - "use strict" and try jshint

# TODO
- bugfix:
    - add .gitignore
    - default response is binary without content-type header

- Generate an index.html page for docs, that lists all the services
  - List of services:
    - Summary on Methods
        - show: params list
        - sample call
    - Link to the details page

- Use Markdown rendering for textual fields in docs, such as: description, name, etc.

- Upgrade to new modules
    - http-proxy v1.0.0 total api refactor
    - express (/connect)

- Watch the http://www.restapitutorial.com/lessons/whatisrest.html

- Set body background-color: rgb(249, 249, 249);

- Do cleansing in field names of service.yml
  - Study the communication to a REST service with FireBug (see details)
  - Ideas from the programmable web
    config.yml
    Summary: JavaScript error logging service
    Category: Tools
    Tags: tools internet cloud 
    Protocols: REST
    Data Formats: JSON
    API home: http://jslogger.com/api

        service.yml

    Security
        Authentication Model:
        SSL Support: Yes / No
        Read-only Without Login:
     
- Put a restapi online-help beside the generated docs, wih a link to it, from the Header section

- Write documentation to the service.yml
- Finish the validation of service.yml with error messages
- Write a support command to generate JSON schema and service.yml from JSON sample data file.
- Generate HTTP headers (with parameters) from default service call.
- Generate Cookies headers (with parameters) from default service call.

# ------------------
- Study RSDL, and may implement a converter to/from.
  [RSDL](https://access.redhat.com/site/documentation/en-US/Red_Hat_Enterprise_Virtualization/3.1/html/Developer_Guide/sect-Developer_Guide.entry_Point-RSDL.html)

- implement a service initiator command (generates the service.yml and schemas)
- add regexp-like 'format' or 'validator' field to request parameters
  for example:
    - [0-9][A-Z]|[A-Z][0-9]|[A-Z]{2})([0-9]{3,4})([A-Z]?)
    - [A-Z]{3}
- Description of response fields (JSON schema, data model descriptor, meta...?)
- Rename templates to use .mu postfixes, and put them onto whitelist during dir-copy of prjgen
- Read parameters for docgen and prjgen contexts (replace hardcoded objects)
- Dynamically require implementation modules into the mock server
- In service.yml change style property to stereotype: []
- Rename template files (.mustache->.js)
- Add some well-known, and useful rest api specs to examples
  - twitter,
  - select from theprogrammableweb
- Authentication!!! (OAuth example, etc.)
- restapi gui --create --type=ExtJS | JQuery | ???
- restapi cli --create --type=JavaScript|Java|Python|ClojureScript|Clojure|CLISP|PHP
- WebUI for testing embedded to doc pages, calling the mock/test server with test data
- refactor mock server to use the configuration instead of hardwired values
