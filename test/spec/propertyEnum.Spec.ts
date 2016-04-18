import {Enum, Type, Property} from "../../lib/property";
/**
 * Created by ThomasP on 11.04.2016.
 */


describe('Model::Property::Enum', function() {

    it('should have Enums', function () {

        class Model {
            @Type(String)
            @Enum(['a', 'b'])
            property: string;
        }

        let enumValues = Property.getEnum(Model, 'property');
        expect(enumValues).toBeDefined();
        expect(Array.isArray(enumValues)).toBe(true);
        expect(enumValues.length).toBe(2);
        expect(enumValues.some((a) => a === 'a')).toBe(true);
        expect(enumValues.some((b) => b === 'b')).toBe(true);

        let hasEnum = Property.hasEnum(Model, 'property');
        expect(hasEnum).toBe(true);
        hasEnum = Property.hasEnum(Model, 'propertyNone');
        expect(hasEnum).toBe(false);

        let getEnumProperties = Property.getEnumProperties(Model);
        expect(getEnumProperties).toBeDefined();
        expect(Array.isArray(getEnumProperties)).toBe(true);
        expect(getEnumProperties.length).toBe(1);
        expect(getEnumProperties[0]).toBe('property');
    });
});

