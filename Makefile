.PHONY: distro

name=console
local-tx1-host=10.0.1.14

init:
	bower install
	npm install

clean:
	grunt clean

build:
	grunt build

stage:
	-rm -rf app/bower_components
	ln -s $(PWD)/bower_components app/bower_components

distro-clean:
	rm -rf distro

distro: distro-clean
	# Make sure the package is built
	ls dist
	# Ensure the distro dir exist
	-mkdir distro
	# Change the name of the folder to root to match required package structure
	-mv dist root
	# zip the dist dir and and place the zip in the distro folder
	-zip -r ./distro/$(name).zip ./root > /dev/null
	# Change the name back to dist
	-mv root dist

deploy: distro
	# Ensure the distro exist
	ls distro/$(name).zip
	# Copy the distro to production
	scp distro/$(name).zip root@digitalocean-prod-0:/var/lib/skyraid/packages/$(name).zip

tx1deploy: distro
	# Ensure the distro exist
	ls distro/$(name).zip
	scp distro/$(name).zip skyraid@$(local-tx1-host):~
	# Unzip the new release
	ssh skyraid@$(local-tx1-host) 'unzip $(name) -d $(name)' > /dev/null
	# TODO need to symlink this one

devdeploy: build distro
	-rm /var/lib/skyraid/packages/$(name).zip
	-mkdir /var/lib/skyraid/packages
	cp distro/$(name).zip /var/lib/skyraid/packages/$(name).zip