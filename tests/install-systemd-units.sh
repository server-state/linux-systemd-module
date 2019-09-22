#!/bin/bash
# Simple install script for systemd testing units
# ================================================
# Copyright (C) server-state

SYSTEMD_UNITS="/usr/local/lib/systemd/system"
#SYSTEMD_UNITS="./systemd/units"

GIVEN_UNITS="./tests/units"

# install given units to test system
mkdir -p "$SYSTEMD_UNITS"
cp -r "$GIVEN_UNITS/." "$SYSTEMD_UNITS"

systemctl daemon-reload