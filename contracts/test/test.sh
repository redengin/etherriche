#!/bin/bash

TESTDIR=$(dirname $(readlink -f "$0"))
BINDIR=$(realpath ${TESTDIR}/../../bin)
IMAGE=harshjv/testrpc

# update the container
docker pull ${IMAGE}

# run the tests via NPM
docker run --rm --entrypoint="/bin/sh"        \
     -v ${TESTDIR}:${TESTDIR}                 \
     -v ${BINDIR}:${TESTDIR}/bin              \
     -t ${IMAGE} -c "cd ${TESTDIR} && npm install && npm test && rm -rf tmp-*"
