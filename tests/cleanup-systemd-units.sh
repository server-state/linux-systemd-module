#!/bin/bash
# Cleanup script for previously installed systemd
# unit files
# ================================================
# Copyright (C) server-state

SYSTEMD_UNITS="/usr/local/lib/systemd/system"
#SYSTEMD_UNITS="./systemd/units"

GIVEN_UNITS="./tests/units"

# $1 - search dir
# $2 - del dir
# $3 - current inside dir
function removeFiles() {
    # go through node list
    for node in $(ls "$1/$3"); do
        if [ -f "$1/$3/$node" ]; then
            # if file, then delete
            rm "$2/$3/$node"
        elif [ -d "$1/$3/$node" ]; then
            # if directory, recurse into
            removeFiles $1 $2 "$3/$node"
        fi
    done
    return
}

# $1 - dir with empty dirs
# $2 - current inside dir
function removeEmptyDirs() {
    for node in $(ls "$1/$2"); do
        if [ -d "$1/$2/$node" ]; then
            if [ -z "$(ls -A $1/$2/$node)" ]; then
                rm -r "$1/$2/$node"
            else
                removeEmptyDirs $1 "$2/$node"
            fi
        fi
    done
}

# remove any previously installed systemd units
removeFiles "$GIVEN_UNITS" "$SYSTEMD_UNITS" "."
removeEmptyDirs "$SYSTEMD_UNITS" "."

systemctl daemon-reload