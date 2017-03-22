# PubSub event using parser

[![Build Status](https://travis-ci.org/shamcode/pubsub-event-parser.svg?branch=master)](https://travis-ci.org/shamcode/pubsub-event-parser)

A simple search using events [PubSubJs library](https://github.com/mroderick/PubSubJS)

### Setup
```
npm install pubsub-event-parser
```

### Usage
From command line 
```
node node_modules/pubsub-event-parser/main.js path/to/source/file/or/directory
```
As node.js module:
```js
var pubsubParser = require( "pubsub-event-parser" );

// Parse directory or file
pubsubParser.processPath( {
  path: "path/to/your/code",
  finishCallback: function( store ) {
      Object.keys( store.byName ).forEach( function( eventName ) {
        console.log( eventName );  
      } )
  }
} )

// Parse code string
var store = new pubsubParser.Store()
pubsubParser.procecCode( 
  "( function() { PubSub.publish( 'foo', { 'bar': 1 } ); } )", 
  "", 
  store 
);
console.log( store.byName.foo.publish[ 0 ].code );
```

### Documentation
See generated JSDoc on [site](http://shamcode.github.io/pubsub-event-parser/docs/index.html)

### License
The MIT License (MIT)

Copyright (c) 2016  Eugene Burnashov <shamcode@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
