import {createMeta, Meta} from "../../lib/meta";
/**
 * Created by ThomasP on 26.03.2016.
 */


describe('Model::Meta', function() {

    it('should create a new Meta interface', function () {
        let titleKey = 'title';
        let Title = createMeta(titleKey, function (value: string) {
            return typeof value === 'string';
        });
        

        @Title('class or object title')
        class Model {
            @Title('property title')
            test: string;

            test1(@Title('parameter title')a, @Title('param2 title')b) {

            }
        }
    });
    
    it('should return the data for meta information in a correct way', function () {
        let titleKey = 'title';
        let Title = createMeta(titleKey, function (value: string) {
            return typeof value === 'string';
        });
        
        let getTitle = new Meta(titleKey);


        @Title('class or object title')
        class Model {
            @Title('property title')
            test: string;

            test1(@Title('parameter title')a, @Title('param2 title')b) {

            }
        }

        expect(getTitle.hasClassMeta(Model)).toBe(true);
        expect(getTitle.hasPropertyMeta(Model, 'test')).toBe(true);
        expect(getTitle.hasArgumentMeta(Model, 'test1', 0)).toBe(true);
        expect(getTitle.hasArgumentMeta(Model, 'test1', 1)).toBe(true);
        expect(getTitle.hasArgumentMeta(Model, 'test1', 2)).toBe(false);

        expect(getTitle.hasClassMeta(new Model)).toBe(true);
        expect(getTitle.hasPropertyMeta(new Model, 'test')).toBe(true);
        expect(getTitle.hasArgumentMeta(new Model, 'test1', 0)).toBe(true);
        expect(getTitle.hasArgumentMeta(new Model, 'test1', 1)).toBe(true);
        expect(getTitle.hasArgumentMeta(new Model, 'test1', 2)).toBe(false);


        expect(getTitle.getClassMeta(Model)).toBe('class or object title');
        expect(getTitle.getClassMeta(new Model)).toBe('class or object title');

        expect(getTitle.getPropertyMeta(Model, 'test')).toBe('property title');
        expect(getTitle.getPropertyMeta(new Model, 'test')).toBe('property title');

        expect(getTitle.getArgumentMeta(Model, 'test1', 0)).toBe('parameter title');
        expect(getTitle.getArgumentMeta(new Model, 'test1', 0)).toBe('parameter title');

        expect(getTitle.getArgumentMeta(Model, 'test1', 1)).toBe('param2 title');
        expect(getTitle.getArgumentMeta(new Model, 'test1', 1)).toBe('param2 title');

        expect(getTitle.getArgumentMeta(Model, 'test1', 2)).toBe(undefined);
        expect(getTitle.getArgumentMeta(new Model, 'test1', 2)).toBe(undefined);
    });

    it('should use a noop function, if no assertion is set', function () {
        let key = 'noop';
        let Noop = createMeta(key);
        let getNoop = new Meta(key);
        @Noop('class')
        class Model {
            @Noop('property')
            test: string;

            test1(@Noop('param_a')a, @Noop('param_b')b) {

            }
        }

        expect(getNoop.hasClassMeta(Model)).toBe(true);
        expect(getNoop.hasPropertyMeta(Model, 'test')).toBe(true);
        expect(getNoop.hasArgumentMeta(Model, 'test1', 0)).toBe(true);
        expect(getNoop.hasArgumentMeta(Model, 'test1', 1)).toBe(true);
        expect(getNoop.hasArgumentMeta(Model, 'test1', 2)).toBe(false);

        expect(getNoop.hasClassMeta(new Model)).toBe(true);
        expect(getNoop.hasPropertyMeta(new Model, 'test')).toBe(true);
        expect(getNoop.hasArgumentMeta(new Model, 'test1', 0)).toBe(true);
        expect(getNoop.hasArgumentMeta(new Model, 'test1', 1)).toBe(true);
        expect(getNoop.hasArgumentMeta(new Model, 'test1', 2)).toBe(false);


        expect(getNoop.getClassMeta(Model)).toBe('class');
        expect(getNoop.getClassMeta(new Model)).toBe('class');

        expect(getNoop.getPropertyMeta(Model, 'test')).toBe('property');
        expect(getNoop.getPropertyMeta(new Model, 'test')).toBe('property');

        expect(getNoop.getArgumentMeta(Model, 'test1', 0)).toBe('param_a');
        expect(getNoop.getArgumentMeta(new Model, 'test1', 0)).toBe('param_a');

        expect(getNoop.getArgumentMeta(Model, 'test1', 1)).toBe('param_b');
        expect(getNoop.getArgumentMeta(new Model, 'test1', 1)).toBe('param_b');

        expect(getNoop.getArgumentMeta(Model, 'test1', 2)).toBe(undefined);
        expect(getNoop.getArgumentMeta(new Model, 'test1', 2)).toBe(undefined);

    });

    it('should handle a incorrect key in a correct way', function () {
        expect(function () {
            createMeta(null);
        }).toThrowError('Need a key, to store meta information.');

        expect(function () {
            new Meta(null);
        }).toThrowError('Need a key, to create a meta information interface.');
    });

    it('should fail, when assert interface fails', function () {
        // allows @Test(20+)
        let Test = createMeta('test', function (int: any) {
            return typeof int === 'number' && int >= 20;
        });
        let getTest= new Meta('test');
        expect(function () {
            @Test(10)
            class Model {

            }
        }).toThrowError('The interface assertion function failed.');
        expect(function () {
            @Test('Hello World')
            class Model {

            }
        }).toThrowError('The interface assertion function failed.');
        expect(function () {
            @Test(null)
            class Model {

            }
        }).toThrowError('The interface assertion function failed.');
        //
        // This should be ok
        //
        @Test(20)
        class Model {

        }
        expect(getTest.hasClassMeta(Model)).toBe(true);
        expect(getTest.getClassMeta(Model)).toBe(20);
        expect(getTest.hasClassMeta(new Model)).toBe(true);
        expect(getTest.getClassMeta(new Model)).toBe(20);
    });


    it('should handle descructive usage for Meta.hasMeta', function () {
        let meta = new Meta('key');
        expect(function () {
            meta.hasMeta(null);
        }).toThrowError('A target is required for checking if meta data exists.');

        expect(function () {
            meta.hasMeta({}, null, 1);
        }).toThrowError('To get meta data from an argument, ' +
            'you will need to set the method name and the parameter position.');

        expect(function () {
            meta.hasMeta({}, null);
        }).toThrowError('To get meta data from a property, you will need to set the property name.');

        expect(meta.hasMeta({},'test', 1)).toBe(false);
    });

    it('should handle descructive usage for Meta.getMeta', function () {
        let meta = new Meta('key');
        expect(function () {
            meta.getMeta(null);
        }).toThrowError('A target is required for getting meta data.');

        expect(function () {
            meta.getMeta({}, null, 1);
        }).toThrowError('To get meta data from an argument, ' +
            'you will need to set the method name and the parameter position.');

        expect(function () {
            meta.getMeta({}, null);
        }).toThrowError('To get meta data from a property, you will need to set the property name.');

        expect(meta.getMeta({},'test', 1)).toBe(undefined);
    });
    
    it('should give the properties back', function () {
        let Prop= createMeta('Prop');
        let getProp= new Meta('Prop');
        let Prop2= createMeta('Prop2');
        let getProp2= new Meta('Prop2');


        class Model {
            @Prop()
            tag1;
            @Prop()
            tag2;
            @Prop2()
            tag3;
        }
        let result1 = getProp.getProperties(Model);
        let result2 = getProp2.getProperties(Model);

        expect(result1).toBeDefined();
        expect(Array.isArray(result1)).toBe(true);
        expect(result1.length).toBe(2);
        expect(result1.every((key) => ['tag1', 'tag2'].indexOf(key)!==-1));

        expect(result2).toBeDefined();
        expect(Array.isArray(result2)).toBe(true);
        expect(result2.length).toBe(1);
        expect(result2.every((key) => ['tag3'].indexOf(key)!==-1));

        let result3 = getProp.getProperties({});
        expect(result3).toBeDefined();
        expect(Array.isArray(result3)).toBe(true);
        expect(result3.length).toBe(0);
    });

    it('should handle destructive usage', function () {
        let Prop = createMeta('prop');
        expect(function () {
            Prop()(null);
        }).toThrowError('Need a target to set meta information.');

    });
});