module.exports = Object.freeze({
    PROPERTIES: {
        any: 'LoadState,ActiveState,SubState,Description,Id,Result,UnitFileState,ActiveEnterTimestamp,ActiveEnterTimestampMonotonic',
        service: 'CleanResult,MainPID,Type,Restart,MemoryCurrent,Nice,RemainAfterExit,TasksCurrent',
        mount: 'Where,What,Type,LazyUnmount',
        slice: 'TasksCurrent',
        automount: 'Triggers',
        timer: 'NextElapseUSecRealtime,Triggers',
        swap: 'What',
        path: 'Triggers'
        //target: '', // no more interesting default properties
        //device: '', // no more interesting default properties
        //scope: '', // no more interesting default properties
        //socket: '', // no more interesting default properties
    }
});