package com.htlmodel.cq.core.servlet;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component(service = Servlet.class,
			property = {
			"sling.servlet.methods=" + "POST",
			"sling.servlet.paths=" + "/bin/testlogServlet"
		})

//@SlingServlet(paths="/bin/testlogServlet", methods = "POST", metatype=true)
public class RequestServlet extends SlingAllMethodsServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3186659459271816905L;
	
	private static final Logger log = LoggerFactory.getLogger(RequestServlet.class); 
	
	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException,
			IOException {
		String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        
        log.info("Request Servlet Do Post method" + firstName + " " + lastName);
        
        response.getWriter().write("Hiii...Output is.." + firstName + " " + lastName);
        
	}
	
	
	

}
