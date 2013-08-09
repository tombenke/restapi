# TODO

- Known BUG: Schema validation does not work properly (see examples/crm-api)
- Rename templates to use .mu postfixes, and put them onto whitelist during dir-copy of prjgen
- Read parameters for docgen and prjgen contexts (replace hardcoded objects)
- Implement the docgen
- Dynamically require implementation modules into the mock server
- Rename server/app.js to server/server.js
- Eliminate the central config.yml, and put each common service related paarmeters under services/config.yml
- In service.yml change style property to stereotype: []
- Rename template files (.mustache->.js)
- Add some well-known, and useful rest api specs to examples
  - twitter,
  - select from theprogrammableweb
- Authentication!!! (OAuth example, etc.)
- restapi gui --create --type=ExtJS | JQuery | ???
- restapi cli --create --type=JavaScript|Java|Python|ClojureScript|Clojure|CLISP|PHP
- WebUI for testing embedded to doc pages, calling the mock/test server with test data