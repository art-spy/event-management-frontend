package eventmanagement.frontend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Business object for users.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;

}
