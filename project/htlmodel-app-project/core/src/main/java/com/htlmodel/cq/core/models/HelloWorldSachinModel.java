package com.htlmodel.cq.core.models;

import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

@Model (
    adaptables = {
        Resource.class
    },
    resourceType = HelloWorldSachinModel.RESOURCE_TYPE
)
public class HelloWorldSachinModel {
    public static final String RESOURCE_TYPE = "htlmodel-app-project/components/content/helloworld";

    @ValueMapValue
    private String message;

    @PostConstruct
    protected void init() {
        message = "\t ADDED AT BACKEND BY SACHIN \n" + message;
    }

    public String getMessage() {
        return message;
    }
}