#!/bin/sh
rsync -rcv --exclude .git --exclude '*~' --chmod=Dugo+x,ugo+r ./ jadedresearcher@50.116.40.89:/var/www/html/farragofiction.com/public_html/CatalystsBathroomSim/EAST/SOUTH/NORTH/EAST/SOUTH/
