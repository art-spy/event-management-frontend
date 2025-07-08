package eventmanagement.frontend.domain.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.client.RestTemplate;

//@Configuration
public class RestTemplateConfig {
    //@Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
