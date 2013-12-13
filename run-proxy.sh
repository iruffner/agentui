#!/bin/bash



# download a pre-built proxy server
if [ ! -f agentui-proxy-dl-1.0.0.jar ]; then
  echo "downloading a pre-build proxy jar"
  wget https://dl.dropboxusercontent.com/u/106359/agentui-proxy-1.0.0.jar
  mv agentui-proxy-1.0.0.jar agentui-proxy-dl-1.0.0.jar
fi

# make sure the symlink from the proxy server to the agentui-client exists
if [ ! -h proxy/src/main/webapp/client ]; then
  echo "creating symlink between webapp and agentui client"
  pushd proxy/src/main/webapp
  ln -s ../../../../client client
  popd
fi

cd proxy
java -jar ../agentui-proxy-dl-1.0.0.jar


