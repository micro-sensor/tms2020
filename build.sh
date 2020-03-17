#!/bin/bash
set -xeou pipefail

export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)

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

# clean up docker compose
docker-compose down --remove-orphans
# docker volume rm tms2020_postgres_data || true

# build and run docker compose
docker-compose up --build
