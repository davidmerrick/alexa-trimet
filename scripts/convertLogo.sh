#!/bin/bash -eu

if [[ $# -ne 1 ]]; then
    echo "Usage: convertIcons.sh inputFile"
    exit 1
fi

TARGET_FOLDER=assets
EXTENSION=jpg

set -x
mogrify -resize 108x108 -write $TARGET_FOLDER/logo108.$EXTENSION $1
mogrify -resize 512x512 -write $TARGET_FOLDER/logo512.$EXTENSION $1

