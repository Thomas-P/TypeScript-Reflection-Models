# TypeScript-Reflection-Models [![Build Status][travis-image]][travis-url] [![Coverage Status](https://coveralls.io/repos/github/Thomas-P/TypeScript-Reflection-Models/badge.svg?branch=master)](https://coveralls.io/github/Thomas-P/TypeScript-Reflection-Models?branch=master)
This Module is a concept for exchanging models between server an client.
The model definition will be compiled on both sides, so that it is possible to have the
same information about the data that will be send between server and client.
You could have properties an methods on the model, while the exchange of the properties could be handled with JSON.
So you are able to check if a transferred model have the right amount of properties an check them against other
validation steps.

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

## Possible meta tags
There are some meta tags, which are defined by default for model handling

### @Type
The **@Type** tag could handle the type definition for the tags. JavaScript does not implement static type checks,
so this tag allows you to add a type for a model property. Actually there are only a limit types allowed.
 * String
 * Boolean
 * Number
 * Date

More types will be come soon.

### Example
```TypeScript
import {Type} from "lib/property";

class ModelClass {
    @Type(String)
    propString: string;
    @Type(Date)
    propDate: string;
    @Type(Number)
    propNumber: string;
    @Type(Boolean)
    propBoolean: string
}
```

### @Default
**@Default** will tag a property with a default value. If a value is not set on the model at the transfer it will be set
could be set by getting the default value on the meta data.

### Example
```TypeScript
import {Default} from "lib/property";

class ModelClass {
    @Default('String1')
    propString: string = 'String1';

}

let m = new ModelClass();
console.log(m.propString); // String1
```

### @Required
**@Required** marks a property as a required property. The idea is, to check if a required property is empty with the
model adapter.

### Example
```TypeScript
import {Required} from "lib/property";

class ModelClass {
    @Required
    propString: string;

}
```





[travis-url]: https://travis-ci.org/Thomas-P/TypeScript-Reflection-Models
[travis-image]: https://travis-ci.org/Thomas-P/TypeScript-Reflection-Models.svg?branch=master