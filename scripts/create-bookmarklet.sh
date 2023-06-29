#!/bin/env bash

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

SHOW_DIRECTIVES_SOURCE=$ROOT/bookmarklets/show-directives.js
BOOKMARKLET_TEXT_FILE=$ROOT/tmp/show-directives.txt

cat $SHOW_DIRECTIVES_SOURCE | tr -d '\n' | tr -s ' ' > $BOOKMARKLET_TEXT_FILE

echo "Bookmarklet URL written to $BOOKMARKLET_TEXT_FILE."
