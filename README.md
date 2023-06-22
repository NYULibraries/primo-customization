# Primo Customization for NYU

## Local Primo: `primo-explore-devenv/`

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
serve as a reference when/if we need to update _primo-explore-devenv/_.

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

The update script assumes there exists a S3 bucket + CloudFront distribution pair
for each developer identified by their NetID.  These sandbox CDNs are not currently
being used by this project (they were in an earlier iteration of the code during
the prototyping phase), but they could prove useful for experimentation with one's
local instance.

* S3 bucket for individual developer: cdn-local-[NetID].library.nyu.edu 
* CloudFront distribution: CloudFront distribution names are arbitrary and are
set at creation time.
  * Domain name: see "Distribution domain name" under the General tab in the console

---

## Archived code

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

* ExLibrisGroup/primo-explore-package: [The Primo New UI Customization Workflow Development Environment](https://github.com/ExLibrisGroup/primo-explore-package)
