package eventmanagement.frontend.rest;

import eventmanagement.frontend.rest.model.UserDto;
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
@RequestMapping("/users")
public class UserController {

    private final RestTemplate restTemplate;
    private final String kernelBase;

    public UserController(RestTemplate restTemplate,
                          @Value("${kernel.url}") String kernelUrl) {
        this.restTemplate = restTemplate;
        this.kernelBase = kernelUrl + "/api/users";
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAll() {
        ResponseEntity<List<UserDto>> resp = restTemplate.exchange(
                kernelBase, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {});
        return new ResponseEntity<>(resp.getBody(), resp.getStatusCode());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        UserDto dto = restTemplate.getForObject(kernelBase + "/" + id, UserDto.class);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody UserDto dto) {
        UserDto created = restTemplate.postForObject(kernelBase, dto, UserDto.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id,
                                          @RequestBody UserDto dto) {
        HttpEntity<UserDto> entity = new HttpEntity<>(dto);
        ResponseEntity<UserDto> resp = restTemplate.exchange(
                kernelBase + "/" + id, HttpMethod.PUT, entity, UserDto.class);
        return new ResponseEntity<>(resp.getBody(), resp.getStatusCode());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        restTemplate.delete(kernelBase + "/" + id);
        return ResponseEntity.noContent().build();
    }
}
