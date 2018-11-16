package com.htlmodel.cq.core.model;

import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resoruce;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;


//@Model(adaptables=Resource.class, RESOURCE_TYPE defaultinjectionStrategy=defaultinjectionStrategy.OPTIONAL

@Model(adaptables=Resource.class, RESOURCE_TYPE = HelloWorldModel.RESOURCE_TYPE)

public class HelloWorldModel{

    public static final String RESOURCE_TYPE = "htlmodel-app-project/components/content/HelloWorld";
    @ValueMapValue
    private String message;

    @PostConstruct
    protected void init() {
        message= "\t test Message \n" + message;
    }

    public String getMessage(){
        return message;
    }
}




//Code for CRX Hello world components
<sly data-sly-use-productModel="com.htlmodel.cq.core.models.helloWorld">
    <h1>$(properties.message)</h1>
</sly>