const constants = require('./constants');
const shellExec = require('shell-exec');

function getProperties(type, addProps) {
    return constants.PROPERTIES.any + 
        (constants.PROPERTIES[type] ? ',' + constants.PROPERTIES[type] : '') + 
        (addProps ? ',' + addProps : '');
}

function convertProperty(value) {
    if (value === 'yes' || value === 'no')
        return (value === 'yes');
    
    //if (/^[-+]?\d+$/.test(value))
    //if (Number.isSafeInteger(value))
    //    return parseInt(value);

    //if (/[-+]?([0-9]*\.[0-9]+|[0-9]+)/.test(value))
    const conv = parseFloat(value);
    if (!Number.isNaN(conv))
        return conv;
    
    return value;
}

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
        throw new Error('No units were specified!');

    const result = {};

    for (const unit of units) {
        // clean up given unit name
        unit.name = (unit.name ? unit.name.trim() : '');
        if (!unit.name)
            throw new Error('Missing or empty unit name!');

        let array = unit.name.split('.');
        if (array.length < 2) {
            unit.name = unit.name  + '.service';
            array.push('service');
        }        

        if (result[unit.name])
            throw new Error('Unit already requested: ' + unit);

        const properties = {UnitType: array[1]};
        // request properties to given unit
        const output = await shellExec('systemctl show ' + unit.name + ' --property ' + getProperties(array[1], unit.addProps));
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