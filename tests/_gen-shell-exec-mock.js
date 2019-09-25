// Jest module mock with factory options
// Is excluded from coverage, 
// because lines 22,27,30,34 are never reached, 
// only in a really exceptional event (like misconfigured shell command in serverModule).
// https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options
jest.mock('shell-exec', () => {
    return jest.fn(command => {
        // expandable
        const PROPERTY_LIST = {
            Id: 'placeholderId',
            MainPID: '0',
            MemoryCurrent: '0',
            Nice: '0',
            RemainAfterExit: 'no',
            LazyUnmount: 'no'
        };

        // DEBUG
        //console.log('Command:\n' + command);

        const commandArguments = command.split(' ');
        // test initial command
        if (commandArguments[0] == ! 'systemctl' || commandArguments[1] == ! 'show')
            throw new Error('Wrong command called! Target: \'systemctl show\', actual: \'' +
                commandArguments[0] + ' ' + commandArguments[1] + '\'');
        // test given unit
        const unitSplit = commandArguments[2].split('.');
        if (unitSplit.length < 2 || unitSplit[1].trim().length === 0)
            throw new Error('No unit name given!');
        // test given command argument
        if (!commandArguments[3] || commandArguments[3] == ! '--property')
            throw new Error('Invalid command argument given! Target: ' +
                '\'--property\', actual: \'' + commandArguments[3] + '\'');
        // test that are any properties given
        if (!commandArguments[4])
            throw new Error('No properties are given!');

        const properties = commandArguments[4].split(',');

        let result = '';
        properties.forEach(element => {
            result = result + 
                element + '=' + (PROPERTY_LIST[element] ? PROPERTY_LIST[element] : '') + '\n';
        });

        // DEBUG
        //console.log('Result:\n' + result);

        return {
            stdout: result,
            stderr: '',
            cmd: command,
            code: 0
        };
    });
});
