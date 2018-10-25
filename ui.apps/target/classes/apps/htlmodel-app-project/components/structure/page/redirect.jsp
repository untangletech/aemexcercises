<%@include file="/libs/foundation/global.jsp" %><%--
  ==============================================================================
	
	Redirect on the basis of page property redirectTarget.

  ==============================================================================

--%>
<%@page session="false"
            import="com.day.cq.wcm.api.WCMMode,
                    com.day.cq.wcm.foundation.ELEvaluator,
					org.apache.sling.settings.SlingSettingsService" %>
<%

    String location = properties.get("redirectTarget", "");
    boolean wcmModeIsDisabled = WCMMode.fromRequest(request) == WCMMode.DISABLED;
    boolean wcmModeIsPreview = WCMMode.fromRequest(request) == WCMMode.PREVIEW;
	boolean isAuthorMode = sling.getService(SlingSettingsService.class).getRunModes().contains("author");
    if ( (location.length() > 0) && ((wcmModeIsDisabled) || (wcmModeIsPreview)) ) {
        // resolve variables in path
        if (location.indexOf('{')>0) {
            location = ELEvaluator.evaluate(location, slingRequest, pageContext);
        }
        if(isAuthorMode) {
            return;
        }
        if (currentPage != null && !location.equals(currentPage.getPath()) && location.length() > 0) {
            // check for absolute path
            final int protocolIndex = location.indexOf(":/");
            final int queryIndex = location.indexOf('?');
            final String redirectPath;
            if ( protocolIndex > -1 && (queryIndex == -1 || queryIndex > protocolIndex) ) {
                redirectPath = location;
            } else {
                redirectPath = slingRequest.getResourceResolver().map(request, location) + ".html";
            }
            response.sendRedirect(redirectPath);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
        return;
    }
%>
