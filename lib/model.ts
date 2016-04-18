/**
 * Created by ThomasP on 11.04.2016.
 */
import 'reflect-metadata';
import {getConstructorChain} from "./utils/get-constructor";

const modelKey: string = 'model';
const collectionKey: string = `${modelKey}:collection`;
const namespaceKey: string =  `${modelKey}:namespace`;
const routeKey: string =  `${modelKey}:route`;


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
    return function (target): void {
        Reflect.defineMetadata(metaKey, value, target);
    }
}


/**
 *
 * @param collectionName
 * @returns {function(any): void}
 */
export function Collection(collectionName: string): (target: any) => void {

    return function (target): void {
        let targetChain = getConstructorChain(target);
        if (targetChain.length === 0) {
            return;
        }
        let newTarget= targetChain.pop();

        Reflect.defineMetadata(collectionKey, collectionName, newTarget);
    }
}


/**
 *
 * @param namespaceName
 * @returns {function(any): void}
 * @constructor
 */
export function Namespace(namespaceName: string): (target: any) => void {
    return metaData(namespaceKey, namespaceName);
}


/**
 *
 * @param route
 * @constructor
 */
export function Route(route: string): (target: any) => void {
    return metaData(routeKey, route);
}


export class Model {


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
    static getModelInformation<T extends { prototype: any }>(metaKey: string, target: T) {
        if (!target) {
            throw new Error('Cannot get information, if the target is not set.');
        }
        if (typeof target === 'function') {
            let prototype = target.prototype || Object.getPrototypeOf(target);
            return Model.getModelInformation(metaKey, prototype);
        }
        return Reflect.getMetadata(metaKey, target);
    }


    /**
     *
     * @param metaKey
     * @param target
     * @returns {any}
     */
    static hasModelInformation<T extends { prototype: any }>(metaKey: string, target: T) {
        if (!target) {
            throw new Error('Cannot get information, if the target is not set.');
        }
        if (typeof target === 'function') {
            let prototype = target.prototype || Object.getPrototypeOf(target);
            return Model.getModelInformation(metaKey, prototype);
        }
        return Reflect.getMetadata(metaKey, target);
    }


    /**
     *
     * @param target
     */
    static getCollection(target): string {

        return;
    }


    /**
     *
     * @param target
     */
    static hasCollection(target): boolean {
        
        return;
    }


    /**
     *
     * @param target
     */
    static getNamespace(target): string {

        return;
    }


    /**
     *
     * @param target
     */
    static hasNamespace(target): boolean {

        return;
    }


    /**
     *
     * @param target
     */
    static getRoute(target): string {

        return;
    }


    /**
     *
     * @param target
     */
    static hasRoute(target): boolean {

        return;
    }
}