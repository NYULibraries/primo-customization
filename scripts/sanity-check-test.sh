#!/bin/bash -ex

# check NYU_DEV view
testview=01NYU_INST-NYU_DEV
VIEW=$testview docker compose up -d primo-explore-devenv

# use docker compose curl so we're inside primo-customization-net
curl='docker compose run curl'

# make test urls for devenv and cdn based on testview
testvid=${testview//-/:}
devenv_url="http://primo-explore-devenv:8003/discovery/search?vid=$testvid"
external_css_url="http://cdn-server:3000/primo-customization/$testview/css/external.css"

# wait for services to load
# timeout logic thanks to https://stackoverflow.com/a/70362046
start_time="$(date -u +%s)"
timeout_limit=60
while ! $curl -f $devenv_url -o /dev/null
do
  current_time="$(date -u +%s)"
  elapsed_seconds=$(($current_time-$start_time))
  if [ $elapsed_seconds -gt $timeout_limit ]; then
    echo "timeout of $timeout_limit sec"
    exit 1
  fi
  sleep 3
done
echo "Local devenv is up!"

# check that discovery view loads
devenv_matchstring="primoExploreRoot"
devenv_html=`$curl $devenv_url`
if [[ "$devenv_html" != *"$devenv_matchstring"* ]]; then
  echo "Devenv HTML:"
  echo $devenv_html
  echo "'$devenv_matchstring' not found in local devenv; failure!"
  exit 1
fi
echo "Local devenv has $devenv_matchstring!"

# check that CDN loads
#external_css_matchstring="logo-image"
external_css_matchstring=`cat test/e2e/fixtures/cdn/primo-customization/$testview/css/external.css`
external_css_actual=`$curl $external_css_url`
if [[ "$external_css_actual" != *"$external_css_matchstring"* ]]; then
  echo "Devenv CSS:"
  echo $external_css_actual
  echo "'$external_css_matchstring' not found in local CDN external.css; failure!"
  exit 1
fi
echo "Local CDN has $external_css_matchstring!"

