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


const TEST_ARGUMENTS = [
    [
        'service',
        'simple service unit',
        'simpleService.service',
        'simpleService.service',
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
        'simple mount unit',
        'simpleMount.mount',
        'simpleMount.mount',
        ''
    ],
    [
        'mount',
        'mount unit with additional properties',
        'additionalMount.mount',
        'additionalMount.mount',
        'Delegate'
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
    it.each(TEST_ARGUMENTS)('should call with %s properties while given %s', (type, _description, name, fullName, addProps) => {
        const argument = [{ name: name, addProps: addProps }];
        expect(serverModule(argument)).resolves.toMatchSnapshot();

        expect(shellExec).toBeCalledWith(generateCommand(fullName, type, addProps));
    });
});