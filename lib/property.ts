/**
 * Created by ThomasP on 25.03.2016.
 */
import 'reflect-metadata';
import {setProperty, getProperties} from "./utils/set-property";


const propertyKey: string = 'model:property';
const typeKey: string = propertyKey + ':type';
const defaultKey = propertyKey + ':default';
const requiredKey: string= propertyKey + ':required';
const readOnlyKey: string= propertyKey + ':readOnly';
const enumKey: string= propertyKey+ ':enumValues';


enum allowedTypes {
    'String',
    'Boolean',
    'Date',
    'Number',
}


/**
 * convert a type string to the type constructor function
 * @param type
 * @returns {any}
 */
function typeString2Constructor(type: string):Function {
    switch (type) {
        case 'String': return String;
        case 'Boolean': return Boolean;
        case 'Date': return Date;
        case 'Number': return Number;
        default:
            return String;
    }
}




/**
 * internal function which store the key and the
 * @param metaKey
 * @param value
 * @returns {function(any, string): void}
 */
function metaData(metaKey: string, value) {
    /**
     * return the function, that will be used for the decorator
     */
    return function (target, propertyKey: string): void {
        setProperty(target, propertyKey);
        Reflect.defineMetadata(metaKey, value, target, propertyKey);
    }
}


/**
 * set a type of a model spec
 * @param type
 * @returns {function(Object, (string|symbol)=): void}
 * @constructor
 */
export function Type(type){
    if (typeof type === 'string') {
        type = typeString2Constructor(type);
    }
    if (typeof type === 'function') {
        let name: string = type.name;
        if (name in allowedTypes === false) {
            throw new Error('The set type is not allowed yet. Types are [Boolean, String, Number, Date].');
        }
    } else {
        throw new Error('You have to set a constructor function as the type.');
    }
    return metaData(typeKey, type);
}


/**
 * set enum values for a property
 * @param type
 * @returns {function(Object, (string|symbol)=): void}
 * @constructor
 */
export function Enum<T>(enumValues:Array<T>){
    return metaData(enumKey, enumValues);
}


/**
 * set a default value for a model spec
 * @param value
 * @returns {function(any, string): void}
 * @constructor
 */
export function Default(value: any) {
    return metaData(defaultKey, value);
}


/**
 * Mark a model spec as required and store the error message for this.
 * @param errMessage
 * @returns {function(any, string): void}
 * @constructor
 */
export function Required(errMessage: string) {
    return metaData(requiredKey, errMessage);
}


/**
 * Decorator to mark a property as read only
 * @type {function(any, string): void}
 */
export var ReadOnly = metaData(readOnlyKey, true);


/**
 * This is the property interface, that allowes us to
 * handle properties on a model.
 */
export class Property {

    constructor(private target) {

    }
    /**karm
     * List of Types, that are allowed for properties as a string
     * @type {allowedTypes}
     */
    public static allowedTypes = allowedTypes;


    /**
     * The method getPropertyInformation allows us to handle reflect metadata by using the meta key with target and
     * property key. This is a private method, which will used internally to gather the information of
     * the specific meta key, used in the public interface methods
     * @param metaKey
     *      defines the key under meta data should be found
     * @param target
     *      target is the class or an object of this, where meta data is represented
     * @param propertyKey
     *      the property key is the name of the property on the target object
     * @returns {any}
     *      the meta data for a property in combination with the meta key
     */
    private static getPropertyInformation<T extends { prototype: any }>(metaKey: string, target: T, propertyKey: string) {
        if (!target) {
            throw new Error('Cannot get information, if the target is not set.');
        }
        if (typeof target === 'function') {
            let prototype = target.prototype || Object.getPrototypeOf(target);
            return Property.getPropertyInformation(metaKey, prototype, propertyKey);
        }
        return Reflect.getMetadata(metaKey, target, propertyKey);
    }


    /**
     * This method works also like getPropertyInformation and checks if meta data is set or not.
     * @param metaKey
     *      defines the key under meta data should be found
     * @param target
     *      target is the class or an object of this, where meta data is represented
     * @param propertyKey
     *      the property key is the name of the property on the target object
     * @returns {boolean}
     *      true if meta data is set for a property in combination with the meta key
     */
    private static hasPropertyInformation<T extends { prototype: any }>(metaKey: string, target: T, propertyKey: string):boolean {
        if (!target) {
            throw new Error('Cannot get information, if the target is not set.');
        }
        if (typeof target === 'function') {
            let prototype = target.prototype || Object.getPrototypeOf(target);
            return Property.hasPropertyInformation(metaKey, prototype, propertyKey);
        }
        return Reflect.hasMetadata(metaKey, target, propertyKey);
    }


    /**
     * returns a list of properties, which will be set on the model object
     * @param target
     * @param typeKey {string}
     * @returns {Array<string>}
     */
    static getProperties(target, typeKey?: string): Array<string> {
        let result: Array<string> = getProperties(target, typeKey);
        if (typeKey) {
            return result.filter((key:string) => Property.hasPropertyInformation(typeKey, target, key));
        }
        return result;
    }


    /**
     * get the type for a property on a specified target.
     * it will return the type if it is set.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {any}
     *      returns the type for the property
     */
    static getType(target, propertyKey: string) {
        return Property.getPropertyInformation(typeKey, target, propertyKey);
    }


    /**
     * The method hasType allows us to check if a model already has a
     * type set.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {boolean}
     *      true if the type is set
     */
    static hasType(target, propertyKey: string): boolean {
        return Property.hasPropertyInformation(typeKey, target, propertyKey);
    }


    /**
     * returns the keys where a type is set
     * @param target
     * @returns {Array<string>}
     */
    static getTypeProperties(target): Array<string> {
        return Property.getProperties(target, typeKey);
    }


    /**
     * get the type for a property on a specified target.
     * it will return the type if it is set.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {any}
     *      returns the type for the property
     */
    static getDefault(target, propertyKey: string) {
        return Property.getPropertyInformation(defaultKey, target, propertyKey);
    }


    /**
     * The method hasType allows us to check if a model already has a
     * default value for the property.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {boolean}
     *      true if the default value is set
     */
    static hasDefault(target, propertyKey: string): boolean {
        return Property.hasPropertyInformation(defaultKey, target, propertyKey);
    }


    /**
     * get a list of properties where the default is set
     * @param target
     * @returns {Array<string>}
     */
    static getDefaultProperties(target): Array<string> {
        return Property.getProperties(target, defaultKey);
    }


    /**
     * get the enum for a property on a specified target.
     * it will return the type if it is set.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {any}
     *      returns the type for the property
     */
    static getEnum(target, propertyKey: string) {
        return Property.getPropertyInformation(enumKey, target, propertyKey);
    }


    /**
     * The method hasType allows us to check if a model already has a
     * enum value for the property.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {boolean}
     *      true if the default value is set
     */
    static hasEnum(target, propertyKey: string): boolean {
        return Property.hasPropertyInformation(enumKey, target, propertyKey);
    }


    /**
     * get a list of properties where the default is set
     * @param target
     * @returns {Array<string>}
     */
    static getEnumProperties(target): Array<string> {
        return Property.getProperties(target, enumKey);
    }


    /**
     * get the type for a property on a specified target.
     * it will return the type if it is set.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {any}
     *      returns the error message for the property, if it is required
     */
    static getRequiredErrorMessage(target, propertyKey: string): boolean {
        return Property.getPropertyInformation(requiredKey, target, propertyKey);
    }


    /**
     * The method isRequired allows us to check if a model already has a
     * default value for the property.
     * @param target
     *      target class or object
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {boolean}
     *      true if the required value is set
     */
    static isRequired(target, propertyKey: string): boolean {
        return Property.hasPropertyInformation(requiredKey, target, propertyKey);
    }


    /**
     * get a list of required properties
     * @param target
     * @returns {Array<string>}
     */
    static getRequiredProperties(target): Array<string> {
        return Property.getProperties(target, requiredKey);
    }


    /**
     * This method allows us to check if a property should be read only
     * @param target
     *      target class or objet
     * @param propertyKey
     *      name of the property, where the meta data is set
     * @returns {boolean}
     *      returns true, if the property is read only
     */
    static isReadOnly(target, propertyKey: string): boolean {
        return Property.hasPropertyInformation(readOnlyKey, target, propertyKey);
    }


    /**
     * get a list of required properties
     * @param target
     * @returns {Array<string>}
     */
    static getReadOnlyProperties(target): Array<string> {
        return Property.getProperties(target, readOnlyKey);
    }
}
// @todo -> single and list references