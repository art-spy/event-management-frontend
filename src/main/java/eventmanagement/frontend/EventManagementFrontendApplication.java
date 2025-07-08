package eventmanagement.frontend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "eventmanagement.frontend",
        "eventmanagement.kernel.api"
})

public class EventManagementFrontendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventManagementFrontendApplication.class, args);
    }

}
