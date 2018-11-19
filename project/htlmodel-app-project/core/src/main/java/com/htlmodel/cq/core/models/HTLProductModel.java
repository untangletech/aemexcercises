package com.htlmodel.cq.core.models;

import javax.annotation.PostConstruct;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

@Model (
    adaptables = {
        Resource.class
    },
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
    resourceType = HTLProductModel.RESOURCE_TYPE
)
@Exporter(name = "jackson", extensions = "json")
public class HTLProductModel {
    public static final String RESOURCE_TYPE = "htlmodel-app-project/components/content/productdetails";

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @ValueMapValue
    private String subTitle;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getSubTitle() {
        return subTitle;
    }
}