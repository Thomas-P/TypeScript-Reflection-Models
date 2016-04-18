import {Collection, Model} from "../../lib/model";
/**
 * Created by ThomasP on 18.04.2016.
 */

describe('Model::Collection', function() {

    it('should be possible to leave a collection empty', function () {
       class TestModel {

       }

        expect(Model.hasCollection(TestModel)).toBe(false, 'TestModel must not have a collection');
        expect(Model.getCollection(TestModel)).toBe(null, 'The collection ' +
            'of the TestModel must be unnamed.');

        expect(Model.hasCollection(new TestModel)).toBe(false, 'TestModel must not have a collection');
        expect(Model.getCollection(new TestModel)).toBe(null, 'The collection ' +
            'of the TestModel must be unnamed.');


    });

    it('should able to set a collection to a model', function () {

        const collectionString: string=`Collection1-${Math.random()}`;

        @Collection(collectionString)
        class TestModel {

        }

        expect(Model.hasCollection(TestModel)).toBe(true, 'TestModel must have a collection');
        expect(Model.getCollection(TestModel)).toBe(collectionString, 'The collection ' +
            'of the TestModel must be named.');

        expect(Model.hasCollection(new TestModel)).toBe(true, 'TestModel must have a collection');
        expect(Model.getCollection(new TestModel)).toBe(collectionString, 'The collection ' +
            'of the TestModel must be named.');

    });

    it('should not be able to set a collection to more than one model', function () {

        const collectionString: string=`Collection2-${Math.random()}`;

        @Collection(collectionString)
        class TestModel {

        }

        expect(() =>{
            @Collection(collectionString)
            class TestModel2 {

            }
        }).toThrowError('Cannot set a collection to more than one class.');

    });


    it('should be able to set a collection, that equals with the collection of the parent class', function () {
        const collectionString: string=`Collection3-${Math.random()}`;

        @Collection(collectionString)
        class TestModel {

        }

        expect(Model.hasCollection(TestModel)).toBe(true, 'TestModel must have a collection');
        expect(Model.getCollection(TestModel)).toBe(collectionString, 'The collection ' +
            'of the TestModel must be named.');

        expect(Model.hasCollection(new TestModel)).toBe(true, 'TestModel must have a collection');
        expect(Model.getCollection(new TestModel)).toBe(collectionString, 'The collection ' +
            'of the TestModel must be named.');

        @Collection(collectionString)
        class TestModel2 extends TestModel {

        }

        expect(Model.hasCollection(TestModel2)).toBe(true, 'TestModel2 must have a collection');
        expect(Model.getCollection(TestModel2)).toBe(collectionString, 'The collection ' +
            'of the TestModel2 must be named.');

        expect(Model.hasCollection(new TestModel2)).toBe(true, 'TestModel2 must have a collection');
        expect(Model.getCollection(new TestModel2)).toBe(collectionString, 'The collection ' +
            'of the TestModel2 must be named.');
    });

    /**
     * this means, that only the parents could have a collection,
     * otherwise it is not consistent for building a good data model
     */
    it('is possible to set a collection to a child,' +
        'but than it will be set on the parent element', function () {
        const collectionString: string=`Collection4-${Math.random()}`;

        class TestModel {

        }


        @Collection(collectionString)
        class TestModel2 extends TestModel {

        }

        expect(Model.hasCollection(TestModel2)).toBe(true, 'TestModel2 must have a collection');
        expect(Model.getCollection(TestModel2)).toBe(collectionString, 'The collection ' +
            'of the TestModel2 must be named.');

        expect(Model.hasCollection(new TestModel2)).toBe(true, 'TestModel2 must have a collection');
        expect(Model.getCollection(new TestModel2)).toBe(collectionString, 'The collection ' +
            'of the TestModel2 must be named.');

        expect(Model.hasCollection(TestModel)).toBe(true, 'TestModel must have a collection');
        expect(Model.getCollection(TestModel)).toBe(collectionString, 'The collection ' +
            'of the TestModel must be named.');

        expect(Model.hasCollection(new TestModel)).toBe(true, 'TestModel must have a collection');
        expect(Model.getCollection(new TestModel)).toBe(collectionString, 'The collection ' +
            'of the TestModel must be named.');

    });


});


