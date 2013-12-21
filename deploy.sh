

# agentui-dev
SERVER=ubuntu@ec2-54-212-15-76.us-west-2.compute.amazonaws.com:/opt/agentui/webapp/client/

# agentui-test
#SERVER=ubuntu@ec2-54-214-229-124.us-west-2.compute.amazonaws.com:/opt/agentui/webapp/client/


rsync --delete --compress --links --recursive --partial --progress --stats client/ ${SERVER}

