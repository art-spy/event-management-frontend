package eventmanagement.frontend.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eventmanagement.kernel.api.model.UserDto;
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
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final RestTemplate restTemplate;

    @Value("${kernel.url}")
    private String kernelUrl;

    @PostConstruct
    private void init() {
        kernelBase = kernelUrl + "/api/users";
    }

    private String kernelBase;


    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        ResponseEntity<List<UserDto>> resp = restTemplate.exchange(
                kernelBase, HttpMethod.GET, null,
                new ParameterizedTypeReference<>() {});
        return new ResponseEntity<>(resp.getBody(), resp.getStatusCode());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        try {
            UserDto dto = restTemplate.getForObject(kernelBase + "/" + id, UserDto.class);
            return ResponseEntity.ok(dto);
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto dto) {
        try {
            UserDto created = restTemplate.postForObject(kernelBase, dto, UserDto.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,
                                              @RequestBody UserDto dto) {
        try {
            HttpEntity<UserDto> entity = new HttpEntity<>(dto);
            ResponseEntity<UserDto> resp = restTemplate.exchange(
                    kernelBase + "/" + id, HttpMethod.PUT, entity, UserDto.class);
            return new ResponseEntity<>(resp.getBody(), resp.getStatusCode());
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDto> deleteUser(@PathVariable Long id) {
        try {
            restTemplate.delete(kernelBase + "/" + id);
            return ResponseEntity.noContent().build();
        } catch (HttpClientErrorException e) {
            return generateErrorResponse(e);
        }
    }

    private ResponseEntity<UserDto> generateErrorResponse(RestClientResponseException e) {
        // extract error response from response body
        UserDto errorDto = new UserDto();
        try {
            errorDto = new ObjectMapper().readValue(e.getResponseBodyAsString(), UserDto.class);
        }
        catch (JsonProcessingException ex) {}

        return ResponseEntity.badRequest().body(errorDto);
    }

}
