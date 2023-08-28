#!/bin/sh

ROOT=$( cd "$(dirname "$0")" || exit 1; cd ..; pwd -P )

VIEW=$1

if [ -z $VIEW ]; then
    echo >&2 "Please specify a view to test."
    exit 1
fi

TEST_VIEW_DIR=$ROOT/tests
ACTUAL_DIR=$TEST_VIEW_DIR/actual/$VIEW
DIFFS_DIR=$TEST_VIEW_DIR/diffs/$VIEW

if [ ! -d $ACTUAL_DIR ]; then
    echo >&2 "Actual dir $ACTUAL_DIR/ does not exist."
    exit 1
fi

if [ ! -d $DIFFS_DIR ]; then
    echo >&2 "Diffs dir $DIFFS_DIR/ does not exist."
    exit 1
fi

# Clean
rm -rf ${ACTUAL_DIR:?}/*
rm -rf ${DIFFS_DIR:?}/*

# Run tests
VIEW=$VIEW yarn playwright test
