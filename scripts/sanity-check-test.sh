#!/bin/bash -ex

# check NYU_DEV view
testview=01NYU_INST-NYU_DEV 
VIEW=$testview docker compose up -d primo-explore-devenv

# make test urls for devenv and cdn based on testview
testvid=${testview//-/:}
devenv_url="http://localhost:8003/discovery/search?vid=$testvid"
customcss_url="http://localhost:3000/primo-customization/$testview/css/custom.css"

# wait for services to load
timeout 60 sh -c "while ! curl -f $devenv_url -o /dev/null; do sleep 3; done"
echo "Local devenv is up!"
timeout 60 sh -c "while ! curl -f $customcss_url -o /dev/null; do sleep 3; done"
echo "Local CDN is up"

# check that discovery view loads
devenv_matchstring="primoExploreRoot"
devenv_html=`curl $devenv_url`
if [[ "$devenv_html" != *"$devenv_matchstring"* ]]; then
  echo "Devenv HTML:"
  echo $devenv_html
  echo "'$devenv_matchstring' not found in local devenv; failure!"
  exit 1
fi
echo "Local devenv has $devenv_matchstring!"

# check that CDN loads
customcss_matchstring="logo-image"
customcss_html=`curl $customcss_url`
if [[ "$customcss_html" != *"$customcss_matchstring"* ]]; then
  echo "Devenv HTML:"
  echo $customcss_html
  echo "'$customcss_matchstring' not found in local CDN customcss; failure!"
  exit 1
fi
echo "Local CDN has $customcss_matchstring!"

