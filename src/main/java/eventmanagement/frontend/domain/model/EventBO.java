package eventmanagement.frontend.domain.model;

import eventmanagement.kernel.api.model.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Business object for events.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventBO {

    private Long id;
    private String title;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private EventType type;
    private Set<UserBO> participants;

}
