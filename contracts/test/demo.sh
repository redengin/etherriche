#!/bin/bash

IMAGE=harshjv/testrpc

# update the container
docker pull ${IMAGE}

# run the tests via NPM
docker run --rm -it -p8545:8545 ${IMAGE}
