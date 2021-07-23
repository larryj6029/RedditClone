#!/bin/bash


echo What should the version be?
read VERSION

docker build -t ljsn6029/redditclone:$VERSION .
docker push ljsn6029/redditclone:$VERSION
ssh root@167.99.230.92 "docker pull ljsn6029/redditclone:$VERSION && docker tag ljsn6029/redditclone:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"