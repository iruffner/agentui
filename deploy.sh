
# calpop
#SERVER=root@64.27.3.17:/opt/agentui/webapp/

# agentui-dev
SERVER=ubuntu@ec2-54-212-15-76.us-west-2.compute.amazonaws.com:/opt/agentui/webapp/

# agentui-test
#SERVER=ubuntu@ec2-54-214-229-124.us-west-2.compute.amazonaws.com:/opt/agentui/webapp/


rsync --delete --compress --links --recursive --partial --progress --stats client/ ${SERVER}
rsync --compress --links --recursive --partial --progress --stats proxy/src/main/webapp/ ${SERVER}

