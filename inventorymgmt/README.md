This is the roche-diagnostics code that should reside in its own repository.

Building
--------

There are 2 main maven profiles
 * ``autoInstallPackage`` for Author environment;
 * ``autoInstallPackagePublish`` for Publish environment.

Common commands:

From the root directory, run ``mvn clean install`` to build the bundle and content packages.

From any package directory, run ``mvn -PautoInstallPackage clean install`` to build the bundle and content package and install to a CQ author instance.

From any bundle directory, run ``mvn -PautoInstallBundle clean install`` to build *just* the bundle and install to a CQ author instance.

Replace ``-PautoInstallPackage`` with ``-PautoInstallPackagePublish`` if you want to install to a Publishing CQ instance.


Specifying CRX Host/Port
------------------------

The CRX host and port can also be overridden on the command line with: ``mvn -Dcrx.host=otherhost -Dcrx.port=4502 <goals>``.

