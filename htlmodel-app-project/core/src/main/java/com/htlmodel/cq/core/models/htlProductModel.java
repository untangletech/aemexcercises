package com.htlmodel.cq.core.model;

import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resoruce;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;

@Model(adaptables=Resource.class, RESOURCE_TYPE = HelloWorldModel.RESOURCE_TYPE)
@Exporter(name = "jackson", extensions="json")

public class htlProductModel{

    public static final String RESOURCE_TYPE = "htlmodel-app-project/components/content/productdetails";
    
    @ValueMapValue
    private String title;
    
    @ValueMapValue
    private String description;

    @PostConstruct
    protected void init() {
        description= "\t test Message \n" + description;
        title= "\t test Message \n" + title;
    }

    public String getTitle(){
        return title;
    }

    public String getDescription(){
        return description;
    }
}





//Code for CRX 
this is product detail components
<sly data-sly-use-productModel="com.htlmodel.cq.core.models.HTLProductModel">
    <h1>$(productModel.title)</h1>
    <p>$(productdetails.description)</p>
</sly>