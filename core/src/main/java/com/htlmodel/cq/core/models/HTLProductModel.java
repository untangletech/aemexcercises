package com.htlmodel.cq.core.models;

import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = {
        Resource.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL, resourceType = HelloWorldModel.RESOURCE_TYPE)
@Exporter(name = "jackson", extensions = HTLProductModel.JSON)
public class HTLProductModel {

    static final String JSON = "json";

    public static final String RESOURCE_TYPE = "htlmodel-app-project/components/content/helloworld";

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @PostConstruct
    protected void init() {
        title = "\t ADDED AT BACKEND \n" + title;
        // http://localhost:4502/content/untangle-exercise/sling-models/jcr:content/par/productdetails.model.json
        // LOGGER.info("****** Title::: () and Desc :: () ---",title,description);
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
}