#!/bin/bash -eux

# Todo: something is still wrong with this script. Not sure what. Lambda seems to have trouble importing the archive.

SCRIPT_DIR=${0%/*}

zip -r $SCRIPT_DIR/../Archive.zip $SCRIPT_DIR/../src/*