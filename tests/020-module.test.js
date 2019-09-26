require('./_gen-shell-exec-mock');
const constants = require('../src/constants');

const shellExec = require('shell-exec');
const serverModule = require('../src');

function generateCommand(fullName, type, addProps) {
    return 'systemctl show ' + fullName +
        ' --property ' + constants.PROPERTIES.any +
        (constants.PROPERTIES[type] ? ',' + constants.PROPERTIES[type] : '') +
        (addProps ? ',' + addProps : '');
}


// ===== BEGIN TEST =====

describe('Test simple module behaviour', () => {
    it('should reject when no systemd units are given', () => {
        expect(serverModule()).rejects.toThrow();
    });

    it('should reject when a unit are given two or more times', () => {
        expect(serverModule([{ name: 'myService.service' }, { name: 'myService.service' }])).rejects.toThrow();
    });

    it('should reject with an empty unit name', () => {
        expect(serverModule([{ name: '' }])).rejects.toThrow();
    });
});

const INVALID_OPTIONS = [
    [
        'string',
        'I am a string'
    ],
    [
        'boolean',
        true
    ],
    [
        'number',
        3.14
    ],
    [
        'object',
        { prop1: 'prop1', prop2: 'prop2' }
    ],
    [
        'empty array',
        []
    ],
    [
        'invalid array elements',
        ['string', true, 3.14]
    ],
    [
        'empty unit name',
        [{name: null}]
    ],
    [
        'whitespace unit name',
        [{name: '  '}]
    ]
];

describe('Test invalid given options', () => {
    it.each(INVALID_OPTIONS)('should reject with invalid option format %s', (_type, value) => {
        expect(serverModule(value)).rejects.toThrow();
    });
});


const PROPERTY_DEFINITIONS = [
    [
        'service',
        'plain service unit',
        'plainService.service',
        'plainService.service',
        ''
    ],
    [
        'service',
        'implied service unit',
        'impliedService',
        'impliedService.service',
        ''
    ],
    [
        'service',
        'service unit with additional properties',
        'additionalService.service',
        'additionalService.service',
        'GuessMainPID'
    ],
    [
        'mount',
        'plain mount unit',
        'plainMount.mount',
        'plainMount.mount',
        ''
    ],
    [
        'mount',
        'mount unit with additional properties',
        'additionalMount.mount',
        'additionalMount.mount',
        'Delegate'
    ],
    [
        'slice',
        'plain slice unit',
        'plainSlice.slice',
        'plainSlice.slice',
        ''
    ],
    [
        'slice',
        'slice unit with additional properties',
        'additionalSlice.slice',
        'additionalSlice.slice',
        'ControlGroup'
    ],
    [ // virtual test type
        'other',
        'other unit type',
        'otherUnit.other',
        'otherUnit.other',
        ''
    ]
];

describe('Test given properties via argument calls', () => {
    it.each(PROPERTY_DEFINITIONS)('should call with %s properties while given %s', (type, _description, name, fullName, addProps) => {
        const argument = [{ name: name, addProps: addProps }];
        expect(serverModule(argument)).resolves.toMatchSnapshot();

        expect(shellExec).toBeCalledWith(generateCommand(fullName, type, addProps));
    });
});