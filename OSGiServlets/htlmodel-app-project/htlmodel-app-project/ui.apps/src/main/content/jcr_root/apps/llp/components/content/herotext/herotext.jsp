<%--

  Hero text component.

  This is my first component

--%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" %><%
%><%
	// TODO add you code here
%>

<%

    String altText5 = properties.get("jcr:description", "");
%>


<h3>My first component and saved description is <%=altText5%></h3>

