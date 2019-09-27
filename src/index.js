const constants = require('./constants');
const shellExec = require('shell-exec');

function getProperties(type, addProps, defaults) {
    return (defaults ? constants.PROPERTIES.any : '') + 
        (defaults && constants.PROPERTIES[type] ? ',' + constants.PROPERTIES[type] : '') + 
        (addProps ? ',' + addProps : '');
}

function convertProperty(value) {
    if (value === 'yes' || value === 'no')
        return (value === 'yes');
    
    const conv = parseFloat(value);
    if (!Number.isNaN(conv))
        return conv;
    
    return value;
}

const DEFAULT_UNIT_DEF = {
    name: '',
    addProps: '',
    defaults: true
};

/**
 * A module for the server-state system
 * 
 * A module to view the current status of your systemd services
 * 
 * @throws if no units get passed to the function
 * @throws if a unit gets passed two or more times
 * 
 * @argument options array of systemd units to check
 * @returns {object|array|string|number|boolean} A JSON-serializable (via `JSON.stringify()`) version information about the server state
 */
module.exports = async function (units) {
    if (!units || !units.length)
        throw new Error('No units were specified. ' + 
            'Expected argument to be of type object[], with required member \'name\' and a optional member \'addProps\' both type of string.');

    const result = {};

    for (let unit of units) {
        // apply defaults
        unit = Object.assign(DEFAULT_UNIT_DEF, unit);

        // test for key types
        if (typeof unit.name !== 'string')
            throw new Error('Key \'name\' from unit ' + unit.name + ' has an invalid type. ' + 
                'Expected: string, Given: ' + typeof unit.addProps);

        unit.name = unit.name.trim();
        if (!unit.name)
            throw new Error('Missing or empty unit name. The unit name must at least contain one regular character.');

        let array = unit.name.split('.');
        if (array.length < 2) {
            unit.name = unit.name  + '.service';
            array.push('service');
        }

        if (typeof unit.addProps !== 'string')
            throw new Error('Key \'addProps\' from unit ' + unit.name + ' has an invalid type. ' + 
                'Expected: undefined|string, Given: ' + typeof unit.addProps);

        if (typeof unit.defaults !== 'boolean')
            throw new Error('Key \'defaults\' from unit ' + unit.name + ' has an invalid type. ' + 
                'Expected: boolean, Given: ' + typeof unit.addProps);

        if (result[unit.name])
            throw new Error('Unit with name \'' + unit.name + '\' already requested.');

        const properties = {UnitType: array[1]};
        // request properties to given unit
        const output = await shellExec('systemctl show ' + unit.name + ' --property ' + getProperties(array[1], unit.addProps, unit.defaults));
        // parse down given properties to objects
        output.stdout.split('\n').forEach(element => {
            // skip empty new lines
            if (element.length > 0) {
                const def = element.split('=');
                properties[def[0]] = convertProperty(def[1]);
            }
        });

        result[unit.name] = properties;
    }

    return result;
};