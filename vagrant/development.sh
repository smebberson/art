#!/usr/bin/env bash

if [ ! -e /etc/vagrant/development ]
then

	echo ">>> setting up the development tools"

	# install gulp
	npm install -g gulp

	# install bower
	npm install -g bower

	# install sass
	gem install sass --no-ri --no-rdoc

	# alias docker-compose to make it quicker
	ln -s /usr/local/bin/docker-compose /usr/local/bin/dc

	# only run once
    touch /etc/vagrant/development

else

	echo ">>> development tools already development..."

fi
