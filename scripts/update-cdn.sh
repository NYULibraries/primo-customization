#!/usr/bin/env bash

# ~/.aws/credentials should have the following profiles:
#
# [cdn-dev]
# aws_access_key_id = ****
# aws_secret_access_key = ****
#
# [sandbox]
# aws_access_key_id = ****
# aws_secret_access_key = ****

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

# Valid profile names for first argument.
AWS_PROFILE_CDN_DEV='cdn-dev'
AWS_PROFILE_SANDBOX='sandbox'

AWS_PROFILE=$1

if [ -z $AWS_PROFILE ]
then
    echo >&2 "Please specify an AWS profile: $AWS_PROFILE_CDN_DEV, $AWS_PROFILE_SANDBOX"
    exit 1
fi

# No default.  If this doesn't get set properly, just let AWS CLI commands error out.
CDN_HOST=''

if [ "$AWS_PROFILE" == "$AWS_PROFILE_CDN_DEV" ]
then
    CDN_HOST='cdn-dev.library.nyu.edu'
elif [ "$AWS_PROFILE" == "$AWS_PROFILE_SANDBOX" ]
then
    CDN_HOST='cdn-sandbox.library.nyu.edu'
else
    echo >&2 "Unknown AWS profile \"$AWS_PROFILE\".  Please choose from the following: $AWS_PROFILE_CDN_DEV, $AWS_PROFILE_SANDBOX"
    exit 1
fi

# Note that `aws s3 sync ... --exact-timestamps` only works for downloads from S3,
# not uploads: https://github.com/aws/aws-cli/issues/4460.  The only safe way
# to update is to upload absolutely everything.
aws s3 sync --profile $AWS_PROFILE --delete --exclude '*/.gitkeep' $ROOT/cdn/primo-customization/ s3://$CDN_HOST/primo-customization/
