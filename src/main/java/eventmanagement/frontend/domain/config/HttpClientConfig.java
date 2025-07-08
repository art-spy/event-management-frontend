package eventmanagement.frontend.domain.config;

import eventmanagement.kernel.api.EventEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.support.RestTemplateAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class HttpClientConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public EventEndpoint eventEndpoint(RestTemplate restTemplate) {
        RestTemplateAdapter adapter = RestTemplateAdapter.create(restTemplate);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter)
                .build();

        return factory.createClient(EventEndpoint.class);
    }
}


