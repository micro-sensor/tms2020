#!/bin/bash
set -xeou pipefail

#export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)

# build bakcends

pushd cms
mvn clean package -DskipTests
popd

pushd ems
mvn clean package -DskipTests
popd

pushd qms
mvn clean package -DskipTests
popd

pushd ums
mvn clean package -DskipTests
popd

docker-compose build
