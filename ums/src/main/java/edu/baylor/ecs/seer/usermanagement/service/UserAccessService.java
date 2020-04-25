package edu.baylor.ecs.seer.usermanagement.service;

import edu.baylor.ecs.seer.usermanagement.entity.Role;
import edu.baylor.ecs.seer.usermanagement.entity.User;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

/**
 * This service interfaces with keycloak to provide access to the functions
 * needed by the {@link edu.baylor.ecs.seer.usermanagement.controller.UserInfoController}.
 * In future versions, all service functions should be shifted away from the restTemplate
 * structure and move towards the keycloak admin api as seen in
 * {@link edu.baylor.ecs.seer.usermanagement.controller.UserInfoController#addUserRoles(String, Role[])}.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
@Service
public class UserAccessService {

    private static final String keycloakEndpoint = "http://tcs.ecs.baylor.edu/auth/admin/realms/UserManagement/users";
    private static final String keycloakBaseURL = "http://tcs.ecs.baylor.edu/auth";
    private static final String keycloakRealm = "UserManagement";
    private static final String keycloakClient = "ums-backend";
    private static final String keycloakClientSecret = "8d6081b8-8228-476c-8c21-0c27045bceb3";

    @Autowired
    private OAuth2RestTemplate restTemplate;

    public List<User> getUsers() {
        ResponseEntity<User[]> response = restTemplate.getForEntity(keycloakEndpoint, User[].class);
        if (response.getBody() == null) {
            return null;
        }
        return Arrays.asList(response.getBody());
    }

    public List<User> getUsersLikeName(String name) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(keycloakEndpoint)
                .queryParam("username", name);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        HttpEntity<User[]> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                entity,
                User[].class
        );

        if (response.getBody() == null) {
            return null;
        }
        return Arrays.asList(response.getBody());
    }

    public User addNewUser(User user) {
        ResponseEntity<User> response = restTemplate.postForEntity(keycloakEndpoint, user, User.class);
        return response.getBody();
    }

    public void updateUser(User user) {
        restTemplate.put(keycloakEndpoint + "/" + user.getId(), user);
    }

    public void removeUser(String id) {
        restTemplate.delete(keycloakEndpoint + "/" + id);
    }

    public void changeUserPassword(String id, String newPassword) {
        Map<String, Object> request = new HashMap<>();
        request.put("type", "password");
        request.put("temporary", false);
        request.put("value", newPassword);
        restTemplate.put(keycloakEndpoint + "/" + id + "/reset-password", request);
    }

    public List<String> getUserRoleNames(String username) {
        String id = getUsers()
                .stream()
                .filter(x -> x.getUsername().equals(username))
                .findFirst().orElse(new User()).getId();
        ResponseEntity<Role[]> roles = restTemplate
                .getForEntity(keycloakEndpoint + "/" + id + "/role-mappings/realm",
                        Role[].class);
        if (roles.getBody() == null) {
            return null;
        }
        return Arrays.asList(roles.getBody()).stream().map(Role::getName).collect(Collectors.toList());
    }

    public List<Role> addUserRoles(String username, Role[] roles) {
        Keycloak keycloak = KeycloakBuilder.builder() //
                .serverUrl(keycloakBaseURL) //
                .realm(keycloakRealm) //
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS) //
                .clientId(keycloakClient) //
                .clientSecret(keycloakClientSecret)
                .build();
        RealmResource realmResource = keycloak.realm(keycloakRealm);
        UsersResource usersResource = realmResource.users();
        UserResource userResource = usersResource.get(usersResource
                .list()
                .stream()
                .filter(x -> x.getUsername().equals(username))
                .findFirst().orElse(new UserRepresentation()).getId());
        if (userResource == null) {
            return null;
        }
        List<Role> rolesAdded = new ArrayList<>();
        for (RoleRepresentation roleRepresentation : userResource.roles().realmLevel().listAvailable()) {
            for (Role role : roles) {
                if (role.getName().equals(roleRepresentation.getName())) {
                    userResource.roles().realmLevel().add(Arrays.asList(roleRepresentation));
                    rolesAdded.add(role);
                }
            }
        }
        return rolesAdded;
    }

}
