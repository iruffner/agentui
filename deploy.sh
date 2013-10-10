
# calpop
#SERVER=root@64.27.3.17:/opt/agentui/webapp/

# agentui-dev
SERVER=ubuntu@ec2-54-212-15-76.us-west-2.compute.amazonaws.com:/opt/agentui/webapp/


rsync --delete --compress --archive --partial --progress --stats client/ ${SERVER}
rsync --compress --archive --partial --progress --stats proxy/src/main/webapp/ ${SERVER}

