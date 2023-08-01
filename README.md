# Primo Customization for NYU

## Prerequisites

* Node 16.17.0 or higher ([nvm](https://github.com/nvm-sh/nvm) recommended)
* yarn

---

## Getting started

* [Install](https://github.com/NYULibraries/primo-customization#install)
* [Start local CDN server](https://github.com/NYULibraries/primo-customization#start-local-cdn-server)
* [Start local Primo (primo-explore-devenv)](https://github.com/NYULibraries/primo-customization#start-local-primo-primo-explore-devenv)
* Open new browser tab to http://localhost:8003/discovery/search?vid=[VIEW] 
* Edit files in _cdn/primo-customization/[VIEW]/_ and/or (more rarely) _custom/[VIEW]/_
* Reload browser tab to see the changes
* Deploy changes
  * CDN: follow instructions in [CDNs](https://github.com/NYULibraries/primo-customization#cdns) 
  * Primo customization package: follow instructions in [Primo customization package](https://github.com/NYULibraries/primo-customization#primo-customization-package) 

---

## Install

```shell
 git clone git@github.com:NYULibraries/primo-customization.git
 cd primo-customization/
 yarn
 # See section "Where does primo-explore-devenv/ come from?"
 # https://github.com/NYULibraries/primo-customization#where-does-primo-explore-devenv-come-from
 cd primo-explore-devenv/
 yarn
```

---

## Start local CDN server

To run the CDN server in the foreground, printing log messages to the screen:

```shell
# http://localhost:3000/
yarn cdn-server
```

Using Docker Compose (automatically started by `primo-explore-devenv` service):

```shell
docker compose up cdn-server
```

---

## Start local Primo (_primo-explore-devenv/_)

Local Primo: http://localhost:8003/discovery/search?vid=[VIEW]

```shell
# http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn primo-explore-devenv:run:dev
# http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn primo-explore-devenv:run:prod
# http://localhost:8003/discovery/search?vid=01NYU_INST:TESTWS01
yarn primo-explore-devenv:run:testws01
# http://localhost:8003/discovery/search?vid=[VID]
yarn primo-explore-devenv:run [VIEW]
```

Using Docker Compose (starts `cdn-server` service automatically):

```shell
VIEW=[VIEW] docker compose up primo-explore-devenv
```
---

### Where does _primo-explore-devenv/_ come from?
_primo-explore-devenv/_ is a customized snapshot of ExLibris's [primo\-explore\-devenv](https://github.com/ExLibrisGroup/primo-explore-devenv)
("The Primo New UI Customization Workflow Development Environment").

This subdirectory was created using script _scripts/set-up-primo-explore-devenv.sh_:

```shell
nvm use 16.17.0
./scripts/set-up-primo-explore-devenv.sh
```

This is an updated version of the convenience script that was written during
our prototyping phase for setting up _primo-explore-devenv/_ as an external
dependency, before we decided to simply have it be a part of this repo.  It can
serve as a reference when/if we need to update _primo-explore-devenv/_.  Depending
on what changed in the upstream, it could with some minor updates be used to
refresh the directory.

---

## Primo customization package

### Create new Primo customization package

This command will create a new package in _primo-explore-devenv/packages/_:

```shell
# Creates ./primo-explore-devenv/packages/01NYU_INST-NYU_DEV.zip
yarn primo-explore-devenv:create-package:dev
# Creates ./primo-explore-devenv/packages/01NYU_INST-NYU.zip
yarn primo-explore-devenv:create-package:prod
# Creates ./primo-explore-devenv/packages/01NYU_INST-TESTWS01.zip
yarn primo-explore-devenv:create-package:testws01
# Creates ./primo-explore-devenv/packages/[VIEW].zip
yarn primo-explore-devenv:create-package [VIEW]
```

Using Docker Compose:

```shell
VIEW=[VIEW] docker compose up create-package
```

### Deploy new Primo customization package

* For Primo VE sandbox, upload to https://sandbox02-na.primo.exlibrisgroup.com/
* For https://nyu.primo.exlibrisgroup.com/, ask Mike to upload the package

---

## Primo customization: "css Recipe 1 - Color Scheme (Starting from August 2016 Release)"

See [primo-explore-package/VIEW_CODE/css/README.md](https://github.com/ExLibrisGroup/primo-explore-package/blob/436df785f0d683785660d23488539bcdc2e37ead/VIEW_CODE/css/README.md)

This command will create from _custom/[VIEW]/colors.json_:
* _custom/[VIEW]/css/app-colors.css_
* _custom/[VIEW]/scss/_

Note that currently we use CDN CSS files to customize colors.  The generated
_app-colors.css_ files should be moved from the customization package to the
appropriate paths in the CDN.  The _scss/_ directories can simply be deleted.

```shell
yarn primo-explore-devenv:app-css:dev
yarn primo-explore-devenv:app-css:prod
yarn primo-explore-devenv:app-css:testws01
```

Using Docker Compose:

```shell
VIEW=[VIEW] docker compose up app-css
```

### Deploy new Primo customization package

* For Primo VE sandbox, upload to https://sandbox02-na.primo.exlibrisgroup.com/
* For https://nyu.primo.exlibrisgroup.com/, ask Mike to upload the package

---

## Customized version of ExLibris "showDirectives" bookmarklet

To generate our custom version of the ExLibris
"showDirectives" bookmarklet [primo\-explore\-package/VIEW\_CODE /showDirectives\.txt](https://github.com/ExLibrisGroup/primo-explore-package/blob/1b43a8fff46f3fec58bf4ea36bb4ec658e5a3d93/VIEW_CODE/showDirectives.txt):
in _tmp/show-directives.txt_:

```shell
yarn bookmarklet
```

Using Docker Compose:

```shell
docker compose up bookmarklet
```

---

## ESLint

### Fix ESLint errors

To fix all ESLint errors in files for which we enforce ESLint rules:

```shell
yarn eslint:fix
```

Using Docker Compose:

```shell
docker compose up eslint-fix
```

### New configuration system

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
yarn eslint:cjs-file
# The script currently does not generate an ESLint-compliant file, so we need to fix it.
yarn eslint:fix
```

Using Docker Compose:

```shell
docker compose up eslint-cjs-file
# The script currently does not generate an ESLint-compliant file, so we need to fix it.
yarn eslint-fix
```

Note that it is not really possible to have _.eslintrc.cjs_ import the rules directly
from _eslint.config.js_ because the former uses the CommonJS style module system
and the latter uses ESM.  Moreover, the _eslint.config.js_ spec specifies returning
an array and not an object, making import by CommonJS module _.eslintrc.cjs_ not
feasible.

---

## CDNs

To update CDN content, run `scripts/update-cdn.sh`:

```shell
# Update cdn-dev
scripts/update-cdn.sh cdn-dev

# Update sandbox S3/CloudFront pair associated with your NetID
scripts/update-cdn.sh sandbox [your NetID]
```

### Dev

* S3: [cdn\-dev\.library\.nyu\.edu > primo\-customization](https://s3.console.aws.amazon.com/s3/buckets/cdn-dev.library.nyu.edu?region=us-east-1&prefix=primo-customization/)
* CloudFront: [EVU6BD0HLH9MH](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/EVU6BD0HLH9MH)
  * Domain name: cdn-dev.library.nyu.edu
  
### Sandbox

* S3: [cdn\-sandbox\.library\.nyu\.edu > primo\-customization](https://s3.console.aws.amazon.com/s3/buckets/cdn-sandbox.library.nyu.edu?region=us-east-1&prefix=primo-customization/)
* CloudFront: [EAMNC3TE74MCS](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/EAMNC3TE74MCS)
  * Domain name: https://d290kawcj1dea9.cloudfront.net

### Local

See [Start local CDN server](https://github.com/NYULibraries/primo-customization#start-local-cdn-server).

---

## Archived code

### Have CloudFront server a custom empty 403 error page when a non-existent templateUrl file is requested

Ideally, we would not want to be generating empty `templateUrl` files in S3 for
all custom directives that haven't been customized.  We set up our S3 bucket and
CloudFront instance in AWS `nyulibraries-webservices` to serve and empty HTML
page whenever S3 returned a 403 error to CloudFront for a request for a non-existing
file, then deleted all HTML files that had no customization content.  It works
well, but we can't necessarily make the same changes in `nyulibraries` and
`nyulits` dev and prod S3/CloudFront setups right away.  We would first have to
create separate S3 buckets and CloudFront distributions because the CloudFront
custom error page feature is global, and CDN and dev CDN are shared with other
websites and applications.
[archived\_use\-custom\-403\-response\-html\-file\-for\-empty\-custom\-directives](https://github.com/NYULibraries/primo-customization/releases/tag/archived_use-custom-403-response-html-file-for-empty-custom-directives)

### Only generate components for HTML files listed in a manifest

We originally thought we could limit the generation of customizable AngularJS
components to only those which had corresponding template files in _cdn/primo-customization/01NYU_INST-TESTWS01/html/_,
but unfortunately this proved to not be viable due to a race condition which
sometimes led to the fetching of the manifest to occur after the AngularJS
application had already been bootstrapped.  There seemed to be no way to guarantee
a proper execution sequence.  Both fetching a static file from the CDN and making
a request to a Lambda@Edge function that provided a realtime manifest were prone
to the timing bug.  It's possible that any async calls made in the customization
package create race conditions, even when using `async/await`.

* Fetch list of HTML files from static file _cdn/primo-customization/01NYU_INST-TESTWS01/manifest.json_:
[archived_fetch-cdn-html-files-list-via-manifest-json-file](https://github.com/NYULibraries/primo-customization/releases/tag/archived_fetch-cdn-html-files-list-via-manifest-json-file).
* Fetch list of HTML files from Lambda@Edge function:
[archived_fetch-cdn-html-files-list-via-lambda-at-edge](https://github.com/NYULibraries/primo-customization/releases/tag/archived_fetch-cdn-html-files-list-via-lambda-at-edge).

### Previous experiments in CDN-based customization

The current approach being used for CDN-based customization was one of six that
we experimented with in anticipation of migration to Primo VE.  All the POCs in
their final form can be retrieved through git tag
[archived_customization-approaches-proofs-of-concept](https://github.com/NYULibraries/primo-customization/releases/tag/archived_customization-approaches-proofs-of-concept).

---

## References

* [AngularJS](https://angularjs.org/)
  * Books
    * [AngularJS in Action](https://learning-oreilly-com.proxy.library.nyu.edu/library/view/angularjs-in-action/9781617291333/)
    * [Pro AngularJS](https://learning-oreilly-com.proxy.library.nyu.edu/library/view/pro-angularjs/9781430264484/)
  * Documentation: templates
    * [Developer Guide: Templates](https://docs.angularjs.org/guide)
    * [Tutorial: AngularJS Templates](https://docs.angularjs.org/tutorial/step_02)
* [ExLibrisGroup/primo-explore-package](https://github.com/ExLibrisGroup/primo-explore-package): The Primo New UI Customization Workflow Development Environment
