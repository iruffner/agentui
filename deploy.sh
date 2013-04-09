
rsync --delete --compress --archive --partial --progress --stats client/ root@64.27.3.17:/opt/agentui/webapp/
rsync --compress --archive --partial --progress --stats proxy/src/main/webapp/ root@64.27.3.17:/opt/agentui/webapp/

