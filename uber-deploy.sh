#!/bin/bash

# make sure you have a trailing slash
SERVER=root@64.27.3.17:/opt/agentui/
#SERVER=agentui-dev:/opt/agentui/

set -e

pushd proxy
  mvn clean install
popd

set +e
  rm -rf target/dist
  mkdir -p target/dist/webapp
set -e

cp -r client/ target/dist/webapp/
cp -r proxy/src/main/webapp/ target/dist/webapp/
cp -r proxy/target/agentui-proxy-1.0-SNAPSHOT-jar-with-dependencies.jar target/dist/
cp -r proxy/src/main/dist/ target/dist/

# some anal retentive cleanup
rm -rf target/dist/webapp/WEB-INF/source-jsp
rm target/dist/webapp/{*.xml,*.hxml,*.txt,*.sublime*}
rm -rf target/dist/webapp/haxe_src/

rsync --delete --compress --recursive --partial --progress --stats target/dist/ ${SERVER}

