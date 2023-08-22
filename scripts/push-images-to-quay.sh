#!/bin/sh -ex

docker tag primo-customization-devenv quay.io/nyulibraries/primo-customization-devenv:latest
docker tag primo-customization-devenv quay.io/nyulibraries/primo-customization-devenv:${BRANCH_NO_SLASH}
docker tag primo-customization-devenv quay.io/nyulibraries/primo-customization-devenv:${BRANCH_NO_SLASH}-${CIRCLE_SHA1}

docker push quay.io/nyulibraries/primo-customization-devenv:latest
docker push quay.io/nyulibraries/primo-customization-devenv:${BRANCH_NO_SLASH}
docker push quay.io/nyulibraries/primo-customization-devenv:${BRANCH_NO_SLASH}-${CIRCLE_SHA1}

docker tag primo-customization-cdn-server quay.io/nyulibraries/primo-customization-cdn-server:latest
docker tag primo-customization-cdn-server quay.io/nyulibraries/primo-customization-cdn-server:${BRANCH_NO_SLASH}
docker tag primo-customization-cdn-server quay.io/nyulibraries/primo-customization-cdn-server:${BRANCH_NO_SLASH}-${CIRCLE_SHA1}

docker push quay.io/nyulibraries/primo-customization-cdn-server:latest
docker push quay.io/nyulibraries/primo-customization-cdn-server:${BRANCH_NO_SLASH}
docker push quay.io/nyulibraries/primo-customization-cdn-server:${BRANCH_NO_SLASH}-${CIRCLE_SHA1}
