package eventmanagement.frontend.rest.mapper;

import eventmanagement.frontend.domain.model.EventBO;
import eventmanagement.frontend.domain.model.UserBO;
import eventmanagement.kernel.api.model.EventDto;
import eventmanagement.kernel.api.model.UserDto;
import org.mapstruct.Mapper;

@Mapper
public interface BoDtoMapper {

    UserDto toDto(UserBO bo);
    UserBO toBo(UserDto dto);

    EventDto toDto(EventBO bo);
    EventBO toBo(EventDto dto);

}
