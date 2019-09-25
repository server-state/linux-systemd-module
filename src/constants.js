module.exports = Object.freeze({
    PROPERTIES: {
        any: 'LoadState,ActiveState,SubState,Description,Id,Result,UnitFileState,ActiveEnterTimestamp,ActiveEnterTimestampMonotonic',
        service: 'CleanResult,MainPID,Type,Restart,MemoryCurrent,Nice,RemainAfterExit,TasksCurrent',
        mount: 'Where,What,Type,LazyUnmount',
        slice: 'TasksCurrent'
        //target: '',
        //timer: '',
        //device: '', // no more interesting default properties
        //scope: ''  // no more interesting default properties
    }
});