#!/usr/bin/env bash

if [ ! -e /etc/vagrant/compose ]
then

	echo ">>> setting up compose"

	# install compose
	curl -L https://github.com/docker/compose/releases/download/1.2.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
	chmod +x /usr/local/bin/docker-compose

	# only run once
	touch /etc/vagrant/compose

else

	echo ">>> compose is already setup"

fi
