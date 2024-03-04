# DAVRA UI - SAMPLE DASHBOARDS

## Dev

copy env template into.env `cp .env.template .env`

fill env variable

run `npm i`

run `npm run dev`

## Deploy

docker build . -t myCompanydocker/org-custom-app:1.0.0

docker push myCompanydocker/org-custom-app:1.0.0
