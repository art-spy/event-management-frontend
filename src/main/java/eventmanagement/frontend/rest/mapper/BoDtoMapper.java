package eventmanagement.frontend.rest.mapper;

import eventmanagement.frontend.domain.model.EventBO;
import eventmanagement.frontend.domain.model.UserBO;
import eventmanagement.frontend.rest.model.EventDto;
import eventmanagement.frontend.rest.model.UserDto;
import org.mapstruct.Mapper;

@Mapper
public interface BoDtoMapper {

    UserDto toDto(UserBO bo);
    UserBO toBo(UserDto dto);

    EventDto toDto(EventBO bo);
    EventBO toBo(EventDto dto);

}
