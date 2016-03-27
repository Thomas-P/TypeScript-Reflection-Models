# TypeScript-Reflection-Models [![Build Status][travis-image]][travis-url] [![Coverage Status](https://coveralls.io/repos/github/Thomas-P/TypeScript-Reflection-Models/badge.svg?branch=master)](https://coveralls.io/github/Thomas-P/TypeScript-Reflection-Models?branch=master)
This Module is a concept for exchanging models between server an client.
The model definition will be compiled on both sides, so that it is possible to have the
same information about the data that will be send between server and client.

## Demo
```TypeScript
import {Type, Default, Required, Property} from "lib/property";

class ModelClass {
    @Type(String)
    @Default('Hello World')
    @Required('is required')
    demo1: string
}
```



[travis-url]: https://travis-ci.org/Thomas-P/TypeScript-Reflection-Models
[travis-image]: https://travis-ci.org/Thomas-P/TypeScript-Reflection-Models.svg?branch=master