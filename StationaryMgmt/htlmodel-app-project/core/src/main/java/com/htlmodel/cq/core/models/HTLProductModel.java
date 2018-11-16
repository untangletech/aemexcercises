package com.htlmodel.cq.core.models;

import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

@Model (adaptables={Resource.class},resourceType=HTLProductModel.RESOURCE_TYPE)
@Exporter (name="jackson" , extensions="json")
public class HTLProductModel {
	public static final String RESOURCE_TYPE="htlmodel-app-project/components/content/productdetails";
    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @PostConstruct
    protected void postConstruct() {
        //http://localhost:4502/content/untangle-exercises/sling-models/jcr:content/par/productdetails.model.json
       // message = "\t ADDED AT BACKEND \n" + message;
    }

    public String getTitle() {
        return title;
    }
    public String getDescription(){
        return description;
    }
}