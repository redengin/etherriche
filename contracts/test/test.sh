#!/bin/bash

TESTDIR=$(dirname $(readlink -f "$0"))
echo ${TESTDIR}

# start TestRpc
docker pull harshjv/testrpc
docker run --name TestRpc -d -p 8545:8545 \
    -v ${TESTDIR}:${TESTDIR} \
    harshjv/testrpc

# run the tests
docker exec TestRpc sh -c "cd ${TESTDIR} && npm install && npm test"

docker rm -f TestRpc
