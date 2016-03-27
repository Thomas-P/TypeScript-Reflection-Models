/**
 * Created by ThomasP on 26.03.2016.
 */
import 'reflect-metadata';
import {setProperty, getProperties} from "./utils/set-property";

/**
 * This method is a placeholder for the assert function for interfaces
 * @returns {boolean}
 *      return true
 */
let noop = function () {
    return true;
};


enum MetaType {
    'class',
    'property',
    'argument',
}


/**
 * generate a key for meta data storage by using the count of arguments
 * @param key
 * @returns {function(any, string=, number=): string}
 */
function generateKey(key: string) {
    return function (target, property?: string, descriptor?: number): string {
        let type = MetaType[arguments.length-1];
        return ['meta', type, key].join(':');
    }
}

/**
 * The Meta data generator allows you to create your own decorator for a model.
 * You have to define a unique key, on which the meta data generator set the
 * configuration value. The configurator allows only one parameter for the
 * configuration object. Here you can use an interface to build a config model
 * or you use the meta as an atomic instruction, like in the example.
 * This should be the common way to handle this stuff.
 *
 * Example:
 *
 *      let Title = createMeta('title', function (value: string) {
 *          return typeof value === 'string';
 *      });
 *
 *      class Model {
 *          @Title('title of property')
 *          prop: string;
 *
 *      }
 *
 * @param key
 *      the key should be a unique identifier for storing information via reflect meta data.
 * @param assertFunction {function(value: T) => boolean}
 *      the assert function is optional, but it will allow you to
 *      check the parameter of your decorator against the interface you
 *      use for.
 * @returns {function(T): function(any, string=, number=): void}
 */
export function createMeta<T>(key: string, assertFunction?: (options: T) => boolean) {
    if (!key) {
        throw new Error('Need a key, to store meta information.');
    }

    //
    // noop function
    //
    if (!assertFunction || typeof assertFunction !== 'function') {
        assertFunction = noop;
    }


    /**
     * This part is the returned decorator function, which will be usable as an
     * class, parameter or argument decorator. they will also get unique identifier,
     * so a class decorator with a key could not overwrite a property decorator with
     * the same key
     */
    return function (value?: T) {
        if (!assertFunction(value)) {
            throw new Error('The interface assertion function failed.')
        }
        let generateMetaKey = generateKey(key);
        /**
         * This is the inner function, that will be called on decoration a class.
         * It stores the meta data for each case with an other key descriptor.
         * So it is possible to use only one meta data function to store data for
         * class, properties or arguments of methods
         */
        return function (target, property?: string, descriptor?: number) {
            if (!target || !arguments.length) {
                throw new Error('Need a target to set meta information.')
            }
            // @todo check target and descriptor
            let innerKey = generateMetaKey.apply(null, arguments);
            // if the inner key is an argument, then store the data in an array,
            // with the position, that is needed. But it is not possible to
            // store the parameter name, we get only the position of an parameter,
            // so we can store it in an array.
            if (innerKey.indexOf('meta:argument') === 0) {
                let argumentArray:Array<T> = Reflect.getMetadata(innerKey, target, property);
                if (!argumentArray || !Array.isArray(argumentArray)) {
                    argumentArray = [];
                }
                argumentArray[descriptor] = value;
                Reflect.defineMetadata(innerKey, argumentArray, target, property);
                return;
            } else if (property) {
                setProperty(target, property);
                Reflect.defineMetadata(innerKey, value, target, property);
                return;
            }
            // otherwise the meta data will be stored by key and target
            Reflect.defineMetadata(innerKey, value, target);
        }
    }
}


/**
 * The Meta class will provide an interface for getting meta data for
 * a specified element. A good way is to create a module with the
 *
 */
export class Meta<T> {
    /**
     * Generate an interface, which allows you to get the meta data
     * and check if the meta data is set. Once the interface is created,
     * @param key
     *      This is the same key you used to generate your meta data decorator.
     */
    constructor(private key) {
        if (!key || typeof key !== 'string') {
            throw new Error('Need a key, to create a meta information interface.');
        }
    }


    /**
     * Check if the meta data exists on a class, a property or a parameter for the specific meta key
     * This allows you to generate a meta data check method for your meta data decorator function.
     * @param target
     *      The specific target object to get meta data
     * @param property
     *      The specific property name. It is an optional parameter and when it is set, it will
     *      look for meta data on this property
     * @param descriptor
     *      This parameter allows you to specified an argument position. For this, the property name is
     *      the name of the method.
     * @returns {boolean}
     *      returns true, if meta data is set
     */
    hasMeta(target, property?: string, descriptor?: number):boolean {
        if (!target) {
            throw new Error('A target is required for checking if meta data exists.');
        }
        // get the prototype of the constructor only if a property is set
        // @todo Issue to Reflect on Github
        if (arguments.length>1 && typeof target==='function') {
            let args = Array.prototype.slice.call(arguments);
            args[0] = target.prototype;
            return this.hasMeta.apply(this, args);
        } else if (arguments.length===1 && typeof target!=='function') {
            let args = Array.prototype.slice.call(arguments);
            target = Object.getPrototypeOf(target);
            if (target && target.constructor) {
                args[0] = target.constructor;
            }
            return this.hasMeta.apply(this, args);
        }
        let generatedKey: string = generateKey(this.key).apply(null, arguments);
        switch (arguments.length) {
            case 3:
                //
                // method arguments
                //
                if (!property || typeof property !== 'string' || typeof descriptor !== 'number') {
                    throw new Error('To get meta data from an argument, ' +
                        'you will need to set the method name and the parameter position.');
                }
                let result:Array<T> = Reflect.getMetadata(generatedKey, target, property);
                if (!Array.isArray(result)) {
                    result = [];
                }
                return result.hasOwnProperty(Number(descriptor).toString(10));
            case 2:
                //
                // has target and property
                //
                if (!property || typeof property !== 'string') {
                    throw new Error('To get meta data from a property, you will need to set the property name.');
                }
                return Reflect.hasMetadata(generatedKey, target, property);
            default:
                //
                // default class decorator
                //
                return Reflect.hasMetadata(generatedKey, target);
        }
    }


    /**
     * Check if the meta data exists on a class, a property or a parameter for the specific meta key
     * This allows you to generate a meta data check method for your meta data decorator function.
     * @param target
     *      The specific target object to get meta data
     * @param property
     *      The specific property name. It is an optional parameter and when it is set, it will
     *      look for meta data on this property
     * @param descriptor
     *      This parameter allows you to specified an argument position. For this, the property name is
     *      the name of the method.
     * @returns {boolean}
     *      returns the meta data if this is set
     */
    getMeta(target, property?: string, descriptor?: number):T {
        if (!target) {
            throw new Error('A target is required for getting meta data.');
        }
        // get the prototype of the constructor only if a property is set
        if (arguments.length>1 && typeof target==='function') {
            let args = Array.prototype.slice.call(arguments);
            args[0] = target.prototype;
            return this.getMeta.apply(this, args);
        } else if (arguments.length===1 && typeof target!=='function') {
            let args = Array.prototype.slice.call(arguments);
            target = Object.getPrototypeOf(target);
            if (target && target.constructor) {
                args[0] = target.constructor;
            }
            return this.getMeta.apply(this, args);
        }
        let generatedKey: string = generateKey(this.key).apply(null, arguments);
        switch (arguments.length) {
            case 3:
                //
                // method arguments
                //
                if (!property || typeof property !== 'string' || typeof descriptor !== 'number') {
                    throw new Error('To get meta data from an argument, ' +
                        'you will need to set the method name and the parameter position.');
                }
                let result:Array<any> = Reflect.getMetadata(generatedKey, target, property);
                if (!Array.isArray(result)) {
                    result = [];
                }
                return result[descriptor];
            case 2:
                //
                // has target and property
                //
                if (!property || typeof property !== 'string') {
                    throw new Error('To get meta data from a property, you will need to set the property name.');
                }
                return Reflect.getMetadata(generatedKey, target, property);
            default:
                //
                // default class decorator
                //
                return Reflect.getMetadata(generatedKey, target);
        }
    }


    /**
     * Get the meta data for a specific object or class
     * @param target
     *      object or constructor method
     * @returns {T}
     *      meta data
     */
    getClassMeta(target):T {
        return this.getMeta(target);
    }


    /**
     * Get the meta data for a specified property on an object
     * @param target
     *      object or constructor method
     * @param property
     *      property of the object
     * @returns {T}
     *      meta data
     */
    getPropertyMeta(target, property: string):T {
        return this.getMeta(target, property);
    }


    /**
     * Gives meta data for a specific argument of a method on an object.
     * @param target
     *      object or constructor method
     * @param methodName
     *      method name of an object
     * @param position
     *      position of the parameter
     * @returns {T}
     */
    getArgumentMeta(target, methodName: string, position: number):T {
        return this.getMeta(target, methodName, position);
    }


    /**
     * This method will check if meta data is set on an object or a constructor function
     * @param target
     *      object or constructor method
     * @returns {boolean}
     */
    hasClassMeta(target): boolean {
        return this.hasMeta(target);
    }


    /**
     * This method will check if meta data is set for a property on an object or a constructor function
     * @param target
     *      object or constructor method
     * @param property
     *      property of the object
     * @returns {boolean}
     */
    hasPropertyMeta(target, property: string): boolean {
        return this.hasMeta(target, property);
    }


    /**
     * This method will check if meta data is set for an argument of a method on an object or a constructor function
     * @param target
     *      object or constructor method
     * @param methodName
     *      method name of an object
     * @param position
     *      position of the parameter
     * @returns {boolean}
     */
    hasArgumentMeta(target, methodName: string, position: number): boolean {
        return this.hasMeta(target, methodName, position);
    }


    /**
     * Returns a list of properties with set meta data
     * @param target
     *      object or constructor method
     * @returns {Array<string>}
     *      List of property strings
     */
    getProperties(target): Array<string> {
        let result= getProperties(target, this.key);
        return result.filter((key: string) => this.hasPropertyMeta(target, key));
    }
}