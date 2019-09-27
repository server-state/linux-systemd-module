require('./_gen-shell-exec-mock');
const constants = require('../src/constants');

const shellExec = require('shell-exec');
const serverModule = require('../src');

function generatePropertyString(type, addProps) {
    return constants.PROPERTIES.any +
        (constants.PROPERTIES[type] ? ',' + constants.PROPERTIES[type] : '') +
        (addProps ? ',' + addProps : '');
}

function generateCommand(fullName, type, addProps) {
    return 'systemctl show ' + fullName +
        ' --property ' + generatePropertyString(type, addProps);
}

function generatePropertyArray(type, addProps) {
    return generatePropertyString(type, addProps).split(',');
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
        [{ name: null }]
    ],
    [
        'whitespace unit name',
        [{ name: '  ' }]
    ]
];

describe('Test invalid given options', () => {
    it.each(INVALID_OPTIONS)('should reject with invalid option format %s', (_type, value) => {
        expect(serverModule(value)).rejects.toThrow();
    });
});


const TYPES_PROPERTIES = [
    [
        'service',
        'GuessMainPID'
    ],
    [
        'mount',
        'Delegate'
    ],
    [
        'slice',
        'ControlGroup'
    ],
    [
        'automount',
        'Where'
    ],
    [
        'timer',
        'TimersCalendar'
    ],
    [
        'swap',
        'ExecActivate'
    ],
    [
        'path',
        'additionalPath'
    ]
];

describe('Test given properties via argument calls', () => {
    it('should call and resolves with given implied service unit', async () => {
        const name = 'impliedservice';
        const fullName = name + '.service';
        const result = await serverModule([{ name: name }]);

        expect(result[fullName]).toBeDefined();
        for (const property of generatePropertyArray('service')) {
            expect(result[fullName]).toHaveProperty(property);
        }

        expect(shellExec).toBeCalledWith(generateCommand(fullName, 'service'));
    });

    it.each(TYPES_PROPERTIES)('should call and resolves with given plain unit of type %s', async (type) => {
        const fullName = 'plain' + type + '.' + type;
        const result = await serverModule([{ name: fullName }]);

        expect(result[fullName]).toBeDefined();
        for (const property of generatePropertyArray(type)) {
            expect(result[fullName]).toHaveProperty(property);
        }

        expect(shellExec).toBeCalledWith(generateCommand(fullName, type));
    });

    it.each(TYPES_PROPERTIES)('should call and resolves with given unit of type %s and additional properties %s', async (type, addProps) => {
        const fullName = 'additional' + type + '.' + type;
        const result = await serverModule([{ name: fullName, addProps: addProps }]);

        expect(result[fullName]).toBeDefined();
        for (const property of generatePropertyArray(type, addProps)) {
            expect(result[fullName]).toHaveProperty(property);
        }

        expect(shellExec).toBeCalledWith(generateCommand(fullName, type, addProps));
    });

    it('should call and resolves with any other unit', async () => {
        const fullName = 'other.other';
        const result = await serverModule([{ name: fullName }]);

        expect(result[fullName]).toBeDefined();
        for (const property of generatePropertyArray('other')) {
            expect(result[fullName]).toHaveProperty(property);
        }

        expect(shellExec).toBeCalledWith(generateCommand(fullName, 'other'));
    });
});
