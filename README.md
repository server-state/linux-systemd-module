# systemd module

[![Build Status](https://travis-ci.com/server-state/systemd-module.svg?branch=master)](https://travis-ci.com/server-state/systemd-module)
![GitHub](https://img.shields.io/github/license/server-state/systemd-module)
[![npm version](https://badge.fury.io/js/%40server-state%2Fsystemd-module.svg)](https://badge.fury.io/js/%40server-state%2Fsystemd-module)
[![Coverage Status](https://coveralls.io/repos/github/server-state/systemd-module/badge.svg?branch=master)](https://coveralls.io/github/server-state/systemd-module?branch=master)
![module type: official](https://img.shields.io/badge/module%20type-official-%23015ba0)

### Description

A module to view the current status of your systemd services. Its response is a object containing keys named as given unit names in [SMF](https://github.com/server-state/specs/blob/master/terminology/server-module-function.md) options with another object as value.
This object contains the properties of the given unit as key/value pairs, for example:
```json
{
  "lightdm.service": {
    "UnitType": "service",
    "Type": "dbus",
    "Restart": "always",
    "RemainAfterExit": false,
    "MainPID": 759,
    "Result": "success",
    "CleanResult": "success",
    "MemoryCurrent": 197627904,
    "TasksCurrent": 6,
    "Nice": 0,
    "Id": "lightdm.service",
    "Description": "Light Display Manager",
    "LoadState": "loaded",
    "ActiveState": "active",
    "SubState": "running",
    "UnitFileState": "enabled",
    "ActiveEnterTimestamp": "Fri 2019-09-27 18:25:59 CEST",
    "ActiveEnterTimestampMonotonic": 86125951
  }
}
```
The output is parsed down from the console command: `systemctl show lightdm.service --property Type,Restart,...`

You can simply add it with the [server-base](https://github.com/server-state/server-base) function, for example:
```js
server.addModule('systemd', require('@server-state/systemd-module'), [
    {
        name: 'apache2'
    },
    {
        name: 'home.mount',
        addProps: 'Options'
    },
    {
        name: 'user.slice',
        addProps: 'TasksCurrent',
        defaults: false
    }
]);
```
to your current api server.
This results in the following output:
```json
{
  "apache2.service": {
    "UnitType": "service",
    "Type": "",
    "Restart": false,
    "RemainAfterExit": false,
    "MainPID": 0,
    "Result": "success",
    "CleanResult": "success",
    "MemoryCurrent": "[not set]",
    "TasksCurrent": "[not set]",
    "Nice": 0,
    "Id": "apache2.service",
    "Description": "apache2.service",
    "LoadState": "not-found",
    "ActiveState": "inactive",
    "SubState": "dead",
    "UnitFileState": "",
    "ActiveEnterTimestamp": "",
    "ActiveEnterTimestampMonotonic": 0
  },
  "home.mount": {
    "UnitType": "mount",
    "Where": "/home",
    "What": "/dev/sda3",
    "Options": "rw,relatime",
    "Type": "ext4",
    "LazyUnmount": false,
    "Result": "success",
    "Id": "home.mount",
    "Description": "/home",
    "LoadState": "loaded",
    "ActiveState": "active",
    "SubState": "mounted",
    "UnitFileState": "generated",
    "ActiveEnterTimestamp": "Fri 2019-09-27 18:25:58 CEST",
    "ActiveEnterTimestampMonotonic": 84831816
  },
  "user.slice": {
    "UnitType": "slice",
    "TasksCurrent": 647
  }
}
```

### Options

You can adjust the properties from the results in the options array.

The `name` key is mandatory and defines the systemd unit. 
For different unit types, use the unit extension from systemd, for example `system.slice` or `boot.mount`.
If no extension is specified, a `service` unit is assumed (systemd default).

There are default preset properties for different unit types you can use or disable them with the `defaults` key set to `false`.
(See [constants.js](https://github.com/server-state/systemd-module/blob/master/src/constants.js))

You also can give your own properties (comma separated) to add to the resulting object, for example `Requires,After`.

### About

This output generates a straight base to provide other applications useful information like server-state example [client-base](https://github.com/server-state/client-base).

This official module belongs to the organization [server-state](https://github.com/server-state).
