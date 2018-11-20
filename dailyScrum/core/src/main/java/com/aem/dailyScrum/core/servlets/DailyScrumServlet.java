package com.aem.dailyScrum.core.servlets;

import javax.servlet.Servlet;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.HttpConstants;

@SlingServlet(description = "Log paramters from get request", 
extensions = { "json" },
paths = "/bin/dailyScrum/logParams", 
methods = { "GET" }
)
@Component(service=Servlet.class,
property={
        Constants.SERVICE_DESCRIPTION + "=Log paramters from get request",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.paths="+ "/bin/dailyScrum/logParams",
        "sling.servlet.extensions=" + "html"
})
public class DailyScrumServlet extends SlingSafeMethodsServlet {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response) {
		String paramName = request.getParameter("name");
		String paramDesc = request.getParameter("desc");
		
		logger.debug("Product name: {}, Product description: {}", paramName, paramDesc);
	}

}
