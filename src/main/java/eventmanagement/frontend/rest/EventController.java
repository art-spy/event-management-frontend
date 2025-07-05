package eventmanagement.frontend.rest;

import eventmanagement.frontend.rest.model.EventDto;
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
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    private final RestTemplate restTemplate;
    private final String kernelBase;

    public EventController(RestTemplate restTemplate,
                           @Value("${kernel.url}") String kernelUrl) {
        this.restTemplate = restTemplate;
        this.kernelBase = kernelUrl + "/api/events";
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAll() {
        ResponseEntity<List<EventDto>> resp = restTemplate.exchange(
                kernelBase, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {});
        return new ResponseEntity<>(resp.getBody(), resp.getStatusCode());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getById(@PathVariable Long id) {
        EventDto dto = restTemplate.getForObject(kernelBase + "/" + id, EventDto.class);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<EventDto> create(@RequestBody EventDto dto) {
        EventDto created = restTemplate.postForObject(kernelBase, dto, EventDto.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDto> update(@PathVariable Long id,
                                           @RequestBody EventDto dto) {
        HttpEntity<EventDto> entity = new HttpEntity<>(dto);
        ResponseEntity<EventDto> resp = restTemplate.exchange(
                kernelBase + "/" + id, HttpMethod.PUT, entity, EventDto.class);
        return new ResponseEntity<>(resp.getBody(), resp.getStatusCode());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        restTemplate.delete(kernelBase + "/" + id);
        return ResponseEntity.noContent().build();
    }
}
