/**
 * Created by ThomasP on 27.03.2016.
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var propertyKey;
    /**
     * add the property name to a property list on the object
     * @param target
     * @param propertyKeyValue
     */
    function setProperty(target, propertyKeyValue) {
        if (!target || typeof propertyKeyValue !== 'string') {
            throw new Error('Could not set meta information because the target is undefined or the property is not named.');
        }
        var data = Reflect.getMetadata(propertyKey, target);
        if (data) {
            if (data.indexOf(propertyKeyValue) === -1) {
                data.push(propertyKeyValue);
            }
        }
        else {
            Reflect.defineMetadata(propertyKey, [propertyKeyValue], target);
        }
    }
    exports_1("setProperty", setProperty);
    /**
     *
     * @param target
     * @param typeKey
     * @returns {any}
     */
    function getProperties(target, typeKey) {
        if (!target) {
            throw new Error('Cannot get information, if the target is not set.');
        }
        if (typeof target === 'function') {
            return getProperties(target.prototype, typeKey);
        }
        if (!Reflect.hasMetadata(propertyKey, target)) {
            return [];
        }
        var result = Reflect.getMetadata(propertyKey, target);
        if (!Array.isArray(result)) {
            result = [];
        }
        return result;
    }
    exports_1("getProperties", getProperties);
    return {
        setters:[],
        execute: function() {
            propertyKey = 'model:property-list';
        }
    }
});
//# sourceMappingURL=set-property.js.map