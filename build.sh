#!/bin/sh

npm install
npm run build

mkdir -p output
cp -R dist/* ./output
