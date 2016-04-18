import {Type, Default, Required, Property, ReadOnly} from "../../lib/property";
/**
 * Created by ThomasP on 25.03.2016.
 */

describe('Model::Property', function() {
    let _ModelClass;
    let _property = 'demo1';
    /**
     * setup test models
     */
    beforeAll(function () {
        class ModelClass {
            @Type(String)
            @Default('Hello World')
            @Required('is required')
            demo1: string
        }
        _ModelClass = ModelClass;
    });

    it('should have a property interface class', function () {
        expect(Property).toBeDefined();
    });

    it('should have the right interface', function () {

        let property = new Property({});
        expect(property).toBeDefined();

        expect(Property.getProperties).toBeDefined();
        expect(typeof Property.getProperties).toBe('function');


        expect(Property.getType).toBeDefined();
        expect(typeof Property.getType).toBe('function');


        expect(Property.hasType).toBeDefined();
        expect(typeof Property.hasType).toBe('function');


        expect(Property.hasDefault).toBeDefined();
        expect(typeof Property.hasDefault).toBe('function');


        expect(Property.getDefault).toBeDefined();
        expect(typeof Property.getDefault).toBe('function');


        expect(Property.isReadOnly).toBeDefined();
        expect(typeof Property.isReadOnly).toBe('function');


        expect(Property.isRequired).toBeDefined();
        expect(typeof Property.isRequired).toBe('function');


        expect(Property.getRequiredErrorMessage).toBeDefined();
        expect(typeof Property.getRequiredErrorMessage).toBe('function');


        expect(Property.getReadOnlyProperties).toBeDefined();
        expect(typeof Property.getReadOnlyProperties).toBe('function');


        expect(Property.getDefaultProperties).toBeDefined();
        expect(typeof Property.getDefaultProperties).toBe('function');


        expect(Property.getTypeProperties).toBeDefined();
        expect(typeof Property.getTypeProperties).toBe('function');


        expect(Property.getRequiredProperties).toBeDefined();
        expect(typeof Property.getRequiredProperties).toBe('function');
    });

    it('model class should exists', function () {

        expect(_ModelClass).toBeDefined();
    });


    it('should have meta data for @Type', function () {
        expect(Property.hasType(_ModelClass, _property)).toBe(true);
        expect(Property.hasType(new _ModelClass(), _property)).toBe(true);

        expect(Property.getType(_ModelClass, _property)).toBe(String);
        expect(Property.getType(new _ModelClass(), _property)).toBe(String);

        Property.getProperties(_ModelClass.prototype);
    });
    
    
    it('should check @Type deeply', function () {
        class M {
            @Type(String)
            str: string;
            
            @Type(Number)
            num: number;
            
            @Type(Boolean)
            bool: boolean;
            
            @Type(Date)
            date: Date;
        }
        let model = new M();
        
        let properties = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(4);

        let check= ['str', 'num', 'bool', 'date'].every((key) => properties.indexOf(key) !== -1);
        expect(check).toBe(true);

        expect(Property.getType(model, 'str')).toBe(String);
        expect(Property.getType(model, 'num')).toBe(Number);
        expect(Property.getType(model, 'bool')).toBe(Boolean);
        expect(Property.getType(model, 'date')).toBe(Date);
    });
    
    
    
    it('should have properties', function () {
        let check = function (target) {
            let result = Property.getProperties(target);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0]).toBe(_property);
        };
        check(new _ModelClass());
        check(_ModelClass);
    });


    it('should have meta data for @Default', function () {
        expect(Property.hasDefault(_ModelClass, _property)).toBe(true);
        expect(Property.getDefault(_ModelClass, _property)).toBe('Hello World');
    });


    it('should check @Default deeply', function () {
        class M {
            @Default('abc')
            str: string;

            @Default(123)
            num: number;

            @Default(true)
            bool: boolean;

            @Default(function () {
                return new Date();
            })
            date: Date;
        }
        let model = new M();

        let properties = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(4);

        let check= ['str', 'num', 'bool', 'date'].every((key) => properties.indexOf(key) !== -1);
        expect(check).toBe(true);

        expect(Property.getDefault(model, 'str')).toBe('abc');
        expect(Property.getDefault(model, 'num')).toBe(123);
        expect(Property.getDefault(model, 'bool')).toBe(true);
        expect(typeof Property.getDefault(model, 'date')).toBe('function');
    });


    it('should check @Required deeply', function () {
        class M {
            @Required('Error message')
            str: string;

            @Required('Error message2')
            num: number;

            notRequired: string;

        }
        let model = new M();

        let properties = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(2);

        let check= ['str', 'num'].every((key) => properties.indexOf(key) !== -1);
        expect(check).toBe(true);

        expect(Property.isRequired(model, 'str')).toBe(true);
        expect(Property.isRequired(model, 'num')).toBe(true);

        expect(Property.isRequired(model, 'notRequired')).toBe(false);

        expect(Property.getRequiredErrorMessage(model, 'str')).toBe('Error message');
        expect(Property.getRequiredErrorMessage(model, 'num')).toBe('Error message2');
    });


    it('should check @ReadOnly deeply', function () {
        class M {
            @ReadOnly
            str: string;

            @Type(Number)
            num: number;
        }
        let model = new M();

        let properties = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(2);

        let check= ['str', 'num'].every((key) => properties.indexOf(key) !== -1);
        expect(check).toBe(true);

        expect(Property.isReadOnly(model, 'str')).toBe(true);
        expect(Property.isReadOnly(model, 'num')).toBe(false);
    });


    it('should check filter properties correctly', function () {
        class M {
            @Default('Hello World')
            @ReadOnly
            str: string;

            @Required('')
            @Type(Number)
            num: number;


        }
        let model = new M();


        let properties = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(2);

        let check= ['str', 'num'].every((key) => properties.indexOf(key) !== -1);
        expect(check).toBe(true);

        let checkDefault = Property.getDefaultProperties(model);
        expect(checkDefault).toBeDefined();
        expect(Array.isArray(checkDefault)).toBe(true);
        expect(checkDefault.length).toBe(1);
        expect(checkDefault[0]).toBe('str');

        let checkReadOnly = Property.getReadOnlyProperties(model);
        expect(checkReadOnly).toBeDefined();
        expect(Array.isArray(checkReadOnly)).toBe(true);
        expect(checkReadOnly.length).toBe(1);
        expect(checkReadOnly[0]).toBe('str');

        let checkRequired = Property.getRequiredProperties(model);
        expect(checkRequired).toBeDefined();
        expect(Array.isArray(checkRequired)).toBe(true);
        expect(checkRequired.length).toBe(1);
        expect(checkRequired[0]).toBe('num');

        let checkTypes = Property.getTypeProperties(model);
        expect(checkTypes).toBeDefined();
        expect(Array.isArray(checkTypes)).toBe(true);
        expect(checkTypes.length).toBe(1);
        expect(checkTypes[0]).toBe('num');
    });

    it('should possible to have no properties', function () {
        class M {

        }
        let model = new M();
        let properties: Array<string> = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(0);
    });

    it('should handle string parameter', function () {
        class M {
            @Type('String')
            str: string;

            @Type('Number')
            num: number;

            @Type('Boolean')
            bool: boolean;

            @Type('Date')
            date: Date;

            @Type('undefined')
            undef: any;

        }
        let model = new M();

        let properties = Property.getProperties(model);
        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBe(5);

        let check= ['str', 'num', 'bool', 'date', 'undef'].every((key) => properties.indexOf(key) !== -1);
        expect(check).toBe(true);

        expect(Property.getType(model, 'str')).toBe(String);
        expect(Property.getType(model, 'num')).toBe(Number);
        expect(Property.getType(model, 'bool')).toBe(Boolean);
        expect(Property.getType(model, 'date')).toBe(Date);
        expect(Property.getType(model, 'undef')).toBe(String);


    });

    it('should handle descructable use with @Type and others', function () {

        expect(function () {
            class M {
                @Type(undefined)
                test;
            }
        }).toThrowError('You have to set a constructor function as the type.');

        expect(function () {
            class T {

            }

            class M {
                @Type(T)
                test;
            }

        }).toThrowError('The set type is not allowed yet. Types are [Boolean, String, Number, Date].');

        expect(function () {
            class T {

            }

            class M {
                @Type({})
                test;
            }

        }).toThrowError('You have to set a constructor function as the type.');

        expect(function () {
            Type(String)(null, null);
        }).toThrowError('Could not set meta information because the target is undefined or the property is not named.');

        expect(function () {
            Property.getDefault(null, 'key');
        }).toThrowError('Cannot get information, if the target is not set.');

        expect(function () {
            Property.hasDefault(null, 'key');
        }).toThrowError('Cannot get information, if the target is not set.');

        expect(function () {
            Property.getDefaultProperties(null);
        }).toThrowError('Cannot get information, if the target is not set.');
    });
});