package edu.baylor.ecs.seer.usermanagement.service;

import edu.baylor.ecs.seer.usermanagement.entity.Credential;
import edu.baylor.ecs.seer.usermanagement.entity.Role;
import edu.baylor.ecs.seer.usermanagement.entity.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
 * This service interfaces with keycloak to provide access to the functions needed by the {@link
 * edu.baylor.ecs.seer.usermanagement.controller.UserInfoController}. In future versions, all service functions should
 * be shifted away from the restTemplate structure and move towards the keycloak admin api as seen in {@link
 * edu.baylor.ecs.seer.usermanagement.controller.UserInfoController#addUserRoles(String, Role[])}.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
@Service
public class UserAccessService {

    private static final Logger logger = LogManager.getLogger(UserAccessService.class.getName());
    private static final String keycloakAdminRestEndpoint = "https://tcs.ecs.baylor.edu/auth/admin/realms";
    private static final String keycloakUsersEndpoint = "https://tcs.ecs.baylor.edu/auth/admin/realms/UserManagement/users";
    private static final String keycloakImportEndpoint = "https://tcs.ecs.baylor.edu/auth/admin/realms/UserManagement/partialImport";
    private static final String keycloakBaseURL = "https://tcs.ecs.baylor.edu/auth";
    private static final String keycloakRealm = "UserManagement";
    private static final String keycloakClient = "ums-backend";
    private static final String keycloakClientSecret = "8d6081b8-8228-476c-8c21-0c27045bceb3";

    @Autowired
    private OAuth2RestTemplate restTemplate;

    public List<User> getUsers() {
        logger.info(Thread.currentThread().getId() + ":" + "getUsers" + "()");
        ResponseEntity<User[]> response = restTemplate.getForEntity(keycloakUsersEndpoint, User[].class);
        if (response.getBody() == null) {
            return null;
        }
        return Arrays.asList(response.getBody());
    }

    public User checkExactUsernameExists(String username) {
        logger.info(Thread.currentThread().getId() + ":" + "checkExactUsernameExists" + "(" + username + ")");
        List<User> userList = searchUsersWithQueryParam("username", username);
        User exists = null;
        for (User user : userList) {
            if (username.equals(user.getUsername())) {
                exists = user;
                break;
            }
        }
        return exists;
    }

    public User checkExactEmailExists(String email) {
        logger.info(Thread.currentThread().getId() + ":" + "checkExactEmailExists" + "(" + email + ")");
        List<User> userList = searchUsersWithQueryParam("email", email);
        User exists = null;
        for (User user : userList) {
            if (email.equals(user.getEmail())) {
                exists = user;
                break;
            }
        }
        return exists;
    }

    public List<User> getUsersLikeName(String name) {
        logger.info(Thread.currentThread().getId() + ":" + "getUsersLikeName" + "(" + name + ")");
        return searchUsersWithQueryParam("username", name);
    }

    public List<User> searchUsersWithQueryParam(String paramName, String paramValue) {
        logger.info(Thread.currentThread().getId() + ":" + "searchUsersWithQueryParam" + "(" + paramName + "," + paramValue +
                ")");
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(keycloakUsersEndpoint)
                .queryParam(paramName, paramValue);

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

    public void sendEmailWithRequiredActions(String userId, List<String> actions, String redirectURI, int lifespan) {

        logger.info(Thread.currentThread().getId() + ":" + "sendEmailWithRequiredActions" + "(" + userId + "," + actions + "," + redirectURI + "," + lifespan + ")");
        restTemplate.put(keycloakUsersEndpoint + "/" + userId + "/execute-actions-email", actions);
    }

    public User addNewUser(User user) {

        logger.info(Thread.currentThread().getId() + ":" + "addNewUser" + "(" + user + ")");
        ResponseEntity<User> response = restTemplate.postForEntity(keycloakUsersEndpoint, user, User.class);
        return response.getBody();
    }

    public ResponseEntity<?> addNewUsers(User[] users) {
        logger.info(Thread.currentThread().getId() + ":" + "addNewUsers" + "(" + users + ")");
        System.out.println("UMS UserAccessService addNewUsers");
        String responseBody = "";
        int line = 1;
        for (User user : users) {
            line++;
            // setup new user. if username is empty, set email as username
            user.setEnabled(true);
            if (user.getUsername().isEmpty()) {
                user.setUsername(user.getEmail());
            }
            System.out.println(user);
            // check if username is already taken:
            User usernameExists = checkExactUsernameExists(user.getUsername());
            if (usernameExists != null) {
                responseBody += "line " + String.valueOf(line) + ": username '" + user.getUsername() + "' already exists\n";
                continue;
            }

            // check if email is already used:
            User emailIsUsed = checkExactEmailExists(user.getEmail());
            if (emailIsUsed != null) {
                responseBody += "line " + String.valueOf(line) + ": email '" + user.getEmail() + "' is already used\n";
                continue;
            }

            // creating password from user's information:
//            int atIndex = user.getEmail().indexOf('@');
//            String last3email = user.getEmail().substring(atIndex-3,atIndex);
//            String password = user.getFirstName().substring(0, 3) + user.getLastName().substring(0, 3) + last3email;
            String password = "agaqilfuh1iotblhr4875bb3kk4j"; // random string

            // setting password information:
            Credential passwordCredential = new Credential(password, true);
            List<Credential> credentials = new ArrayList<>();
            credentials.add(passwordCredential);
            user.setCredentials(credentials);

            // create user in keycloak:
            try {
                ResponseEntity<User> userCreateResponse = restTemplate.postForEntity(keycloakUsersEndpoint, user, User.class);
            } catch (Exception e) {
                //e.printStackTrace();
                responseBody += "line " + String.valueOf(line) + ": Couldn't create user with username '" + user.getUsername() + "'. Reason: " + e.getMessage() + "\n";
                continue;
            }

            // get newly created user's id:
            User isUserCreated = checkExactUsernameExists(user.getUsername());
            if (isUserCreated == null) {
                responseBody += "line " + String.valueOf(line) + ": Couldn't create user with username '" + user.getUsername() + "' due to internal server error\n";
                continue;
            }
            System.out.println("created user: " + isUserCreated);
            System.out.println("UMS UserAccessService addNewUsers -> check all users after creating");
            List<User> userList = getUsers();
            for (User user1 : userList) {
                System.out.println(user1);
            }

            // send an update account email with required UPDATE_PASSWORD action:
            List<String> requiredActions = new ArrayList<>();
            requiredActions.add("UPDATE_PASSWORD");
            // redirect_uri and lifespan (optional) parameters are not working for now. Default values are used
            sendEmailWithRequiredActions(isUserCreated.getId(), requiredActions, "https://tcs.ecs.baylor.edu/", 86400);
        }
        if (responseBody.isEmpty()) {
            responseBody = "Users are created. They will receive emails to set their passwords";
        }
        return ResponseEntity.ok(responseBody);

    }


    public void updateUser(User user) {
        logger.info(Thread.currentThread().getId() + ":" + "updateUser" + "(" + user + ")");
        restTemplate.put(keycloakUsersEndpoint + "/" + user.getId(), user);
    }

    public void removeUser(String id) {
        logger.info(Thread.currentThread().getId() + ":" + "removeUser" + "(" + id + ")");
        restTemplate.delete(keycloakUsersEndpoint + "/" + id);
    }

    public void changeUserPassword(String id, String newPassword) {
        logger.info(Thread.currentThread().getId() + ":" + "changeUserPassword" + "(" + id + "," + newPassword + ")");
        Map<String, Object> request = new HashMap<>();
        request.put("type", "password");
        request.put("temporary", false);
        request.put("value", newPassword);
        restTemplate.put(keycloakUsersEndpoint + "/" + id + "/reset-password", request);
    }

    public List<String> getUserRoleNames(String username) {
        logger.info(Thread.currentThread().getId() + ":" + "getUserRoleNames" + "(" + username + ")");
        String id = getUsers()
                .stream()
                .filter(x -> x.getUsername().equals(username))
                .findFirst().orElse(new User()).getId();
        ResponseEntity<Role[]> roles = restTemplate
                .getForEntity(keycloakUsersEndpoint + "/" + id + "/role-mappings/realm",
                        Role[].class);
        if (roles.getBody() == null) {
            return null;
        }
        return Arrays.asList(roles.getBody()).stream().map(Role::getName).collect(Collectors.toList());
    }

    public List<Role> addUserRoles(String username, Role[] roles) {
        logger.info(Thread.currentThread().getId() + ":" + "addUserRoles" + "(" + username + "," + roles + ")");
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
