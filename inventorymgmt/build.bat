@Echo off
cmd /C  mvn enforcer:enforce
if %ERRORLEVEL% == 0 (
	cmd /C mvn clean install -Dmaven.test.skip=true
	if %ERRORLEVEL% == 0 (
		cd roche.diagnostics.complete
		cmd /C mvn clean install -Dmaven.test.skip=true -PautoInstallPackage 
		cd..
	)
)
