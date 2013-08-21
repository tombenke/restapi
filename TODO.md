# TODO
- Generate an index.html page for docs, that lists all the services
  - List of services:
    - Summary on Methods
        - show: params list
        - sample call
    - Link to the details page
- Set body background-color: rgb(249, 249, 249);
- Correct the file references in doc pages (test data, validation schemas, etc.)
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
        SSL Support: Yes  / No
        Read-only Without Login:
     
- Put a restapi online-help beside the generated docs, wih a link to it, from the Header section

- Write documentation to the service.yml
- Finish the validation of service.yml with error messages
- Write a support command to generate JSON schema and service.yml from JSON sample data file.
- Generate HTTP headers (with parameters) from default service call.
- Generate Cookies headers (with parameters) from default service call.

# ------------------
- Use Markdown rendering for textual fields in docs, such as: description, name, etc.
- Known BUG: Schema validation does not work properly (see examples/crm-api)
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
