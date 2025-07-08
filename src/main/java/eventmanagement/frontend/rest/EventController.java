package eventmanagement.frontend.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eventmanagement.frontend.rest.model.EventDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final RestTemplate restTemplate;

    @Value("${kernel.url}")
    private String kernelUrl;

    @PostConstruct
    private void init() {
        kernelBase = kernelUrl + "/api/events";
    }

    private String kernelBase;


    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        ResponseEntity<List<EventDto>> response = restTemplate.exchange(
                kernelBase, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {});
        return new ResponseEntity<>(response.getBody(), response.getStatusCode());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        try {
            EventDto dto = restTemplate.getForObject(kernelBase + "/" + id, EventDto.class);
            return ResponseEntity.ok(dto);
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(@RequestBody EventDto dto) {
        try {
            EventDto created = restTemplate.postForObject(kernelBase, dto, EventDto.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id,
                                                @RequestBody EventDto dto) {
        HttpEntity<EventDto> entity = new HttpEntity<>(dto);
        try {
            ResponseEntity<EventDto> resp = restTemplate.exchange(
                    kernelBase + "/" + id, HttpMethod.PUT, entity, EventDto.class);
            return ResponseEntity.ok(resp.getBody());
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EventDto> deleteEvent(@PathVariable Long id) {
        try {
            restTemplate.delete(kernelBase + "/" + id);
            return ResponseEntity.noContent().build();
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    private ResponseEntity<EventDto> generateErrorResponse(RestClientResponseException e) {
        // extract error response from response body
        EventDto errorDto = new EventDto();
        try {
            errorDto = new ObjectMapper().readValue(e.getResponseBodyAsString(), EventDto.class);
        }
        catch (JsonProcessingException ex) {}

        return ResponseEntity.badRequest().body(errorDto);
    }
}
