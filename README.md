# electron-designer

### Prerequisites
-   nodejs
-   jsttojs


## Usage

Install the project dependencies:
```
npm install
```

Start the application:
```
npm start
```

Pre-compile mustache templates:
```
jsttojs . views/compiled_views.js --ext mustache
```

## Notes

-   When copying new mustache templates into this project, ensure that references to partial templates **do not** start with a "/".  The proper format for this project is: ```views/v2/my_template.mustache```
