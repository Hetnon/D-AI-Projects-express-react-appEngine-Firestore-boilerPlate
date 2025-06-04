#!/bin/sh
trap "exit 0" TERM INT

while true; do
  docker exec firestore-emulator \
    firebase emulators:export /firebase/data
  sleep 300
done
