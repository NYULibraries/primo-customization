#!/bin/bash

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
# NetIDs are only used for sandbox work.  Each developer has their own S3 bucket
# and CloudFront distribution pair.  The S3 buckets are named `cdn-local-[NETID]`.
# The CloudFront distributions are arbitrarily named.  Currently the sandbox
# distributions have caching disabled, so there's no need for a scripted invalidation
# step.
NETID=$2

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
    if [ -z "$NETID" ]
    then
        echo >&2 "Please specify the NetID associated with the sandbox S3 bucket."
        echo >&2 'Example:'
        echo >&2
        echo >&2 "    $0 $AWS_PROFILE_SANDBOX [NetID]"
        echo >&2

        exit 1
    fi

    # We only check that the NetID value has the correct form.  If there is no
    # S3 bucket associated with the NetID, the AWS CLI commands will error out.
    if [[ "$NETID" =~ ^[a-z]+[0-9]+$ ]]
    then
        CDN_HOST="cdn-local-${NETID}.library.nyu.edu"
    else
        echo >&2 "\"$NETID\" is not a valid NetID."
        exit 1
    fi
else
    echo >&2 "Unknown AWS profile \"$AWS_PROFILE\".  Please choose from the following: $AWS_PROFILE_CDN_DEV, $AWS_PROFILE_SANDBOX"
    exit 1
fi

# The only way to guarantee a true sync/overwrite is to delete everything first
# and do a brand new `sync` (`cp` would work too).  See GitHub issue:
#     "s3 sync --exact-timestamps flag ignored for uploads #4460"
#     https://github.com/aws/aws-cli/issues/4460
aws s3 rm --recursive --profile $AWS_PROFILE s3://$CDN_HOST/primo-customization/
aws s3 sync --profile $AWS_PROFILE --exclude '*/.gitkeep' $ROOT/cdn/primo-customization/ s3://$CDN_HOST/primo-customization/

