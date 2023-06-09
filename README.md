# Primo Customization for NYU

## ESLint configuration

ESLint is transitioning to a new configuration system:
[Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)

> Warning
> We are transitioning to a new config system in ESLint v9.0.0. The config system shared on this page is
> currently the default but will be deprecated in v9.0.0. You can opt-in to the new config system by
> following the instructions in the [documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new).

We are opting-in to the new system by putting our configuration in _eslint.config.js_.
JetBrains does not appear to support the new system yet, and VS Code might not either (not confirmed).
To enable seamless linting in IDEs, we also have a script that generates and old style
_.eslintrc.cjs_ file from the new style _eslint.config.js_ config file, which will
be automatically detected by the JetBrain IDEs.

To regenerate _.eslintc.cjs_:

```shell
node scripts/write-eslintrc-cjs-file.js
```

Note that it is not really possible to have _.eslintrc.cjs_ import the rules directly
from _eslint.config.js_ because the former uses the CommonJS style module system
and the latter uses ESM.  Moreover, the _eslint.config.js_ spec specifies returning
an array and not an object, making import by CommonJS module _.eslintrc.cjs_ not
feasible.

## CDNs

### Dev

* S3: [cdn\-dev\.library\.nyu\.edu > primo\-customization](https://s3.console.aws.amazon.com/s3/buckets/cdn-dev.library.nyu.edu?region=us-east-1&prefix=primo-customization/)
* CloudFront: [EVU6BD0HLH9MH](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/EVU6BD0HLH9MH)
  * Domain name: cdn-dev.library.nyu.edu
  
### Sandbox      

There is one S3 bucket + CloudFront distribution pair for each developer for use
in local development.

* S3 bucket for individual developer: cdn-local-[NetID].library.nyu.edu 
* CloudFront distribution: CloudFront distribution names are arbitrary and are
set at creation time.
  * Domain name: see "Distribution domain name" under the General tab in the console

To update the CDNs, run `scripts/update-cdn.sh`:

```shell
# Update cdn-dev
scripts/update-cdn.sh cdn-dev

# Update sandbox S3/CloudFront pair associated with your NetID
scripts/update-cdn.sh sandbox [your NetID]
```

## Archived code

### Alternative approach to getting the CDN HTML files manifest: call a Lambda@Edge function which fetches the list of HTML files in the S3 bucket

The code for an alternative approach to fetching the list of CDN HTML files basenames
using a Lambda@Edge function can be retrieved through git tag
[archived_fetch-cdn-html-files-list-via-lambda-at-edge](https://github.com/NYULibraries/primo-customization/releases/tag/archived_fetch-cdn-html-files-list-via-lambda-at-edge)

### Autogenerate every possible custom directive

The script for generating
_custom/01NYU_INST-TESTWS01/js/02-autogenerated-backup-custom-directives-function.js_
which contains a function that can automatically generate every possible custom directive
can be retrieved through git tag
[archived_autogenerated-backup-custom-directives-function](https://github.com/NYULibraries/primo-customization/releases/tag/archived_autogenerated-backup-custom-directives-function).

### Previous experiments in CDN-based customization

The current approach being used for CDN-based customization was one of six that
we experimented with in anticipation of migration to Primo VE.  All the POCs in
their final form can be retrieved through git tag
[archived_customization-approaches-proofs-of-concept](https://github.com/NYULibraries/primo-customization/releases/tag/archived_customization-approaches-proofs-of-concept).

## References

* ExLibrisGroup/primo-explore-package: [The Primo New UI Customization Workflow Development Environment](https://github.com/ExLibrisGroup/primo-explore-package)
