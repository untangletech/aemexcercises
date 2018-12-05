package stationarymgmt;

import java.io.IOException;

import javax.jcr.Repository;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONException;
import org.json.simple.JSONObject;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

@SlingServlet(paths = "/bin/myServet", methods = "GET", metatype = true)
public class stationarymgmt extends SlingAllMethodsServlet {
	@Reference
	private Repository repository;

	private static final Logger LOG = LoggerFactory.getLogger(stationarymgmt.class);

	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp) {
		try {
			String requestParam = req.getParameter("test");
			resp.getWriter().println(requestParam);
			LOG.info("Value of test is = " + requestParam);
		}

		catch (Exception e) {

			e.printStackTrace();
		}

	}
}
