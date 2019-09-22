const shellExec = require('shell-exec');

const properties = {
    any: 'LoadState,ActiveState,SubState,Description,Id,Result,UnitFileState',
    service: 'CleanResult,MainPID,Type,Restart,MemoryCurrent,Nice,RemainAfterExit',
    mount: 'Where,What,Type,LazyUnmount'
    //target: '',
    //timer: '',
    //slice: ''
};

function getProperties(type, addProps) {
    return properties.any + (properties[type] ? ',' + properties[type] : '') + (addProps ? addProps : '');
}

function convertProperty(name, value) {
    switch (name) {
    case 'MainPID':
        return parseInt(value);
    case 'MemoryCurrent':
        return parseInt(value);
    case 'Nice':
        return parseInt(value);

    case 'RemainAfterExit':
    case 'LazyUnmount':
        return (value === 'yes');

    default:
        return value;
    }
}

/**
 * A module for the server-state system
 * @returns A JSON-serializable (via `JSON.stringify()`) version information about the server state
 */
module.exports = async function (units) {
    if (!units || !units.length)
        throw new Error('No units were specified!');

    const result = {};

    for (const unit of units) {
        // clean up given unit name
        const array = unit.name.split('.');
        const type = (array[1] ? array[1] : 'service');
        unit.name = array[0] + '.' + type;

        if (result[unit.name])
            throw new Error('Unit already requested: ' + unit);

        const properties = {UnitType: type};
        // request properties to given unit
        const output = await shellExec('systemctl show ' + unit.name + ' --property ' + getProperties(type, unit.addProps));
        // parse down given properties to objects
        output.stdout.split('\n').forEach(element => {
            const def = element.split('=');
            properties[def[0]] = convertProperty(def[0], def[1]);
        });

        result[unit.name] = properties;
    }

    return result;
};