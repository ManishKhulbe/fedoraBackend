#!/bin/bash

# any future command that fails will exit the script
set -e

#source the nvm file. In an non
#If you are not using nvm, add the actual path like
# PATH=/home/ubuntu/node/bin:$PATH
#sudo su

cd /var/www/html/fedoraindia-backend
# Making virtual environment
#python3 -m venv env
# for activating virtual environment
#source env/bin/activate
# Pull the code from Dveeloper branch..
#cd syn/

git pull

npm i

pm2 restart all

pm2 save

#sudo pkill -f "celery"
#echo "celery is running"
#nohup celery -A Syn  worker -l INFO 1>/dev/null 2>/dev/null &
echo "server is running on 9001"
#nohup python3 manage.py runserver 8001 1>/dev/null 2>/dev/null &
# nohup python3 Syn/manage.py runserver > syn.log & exit 0
