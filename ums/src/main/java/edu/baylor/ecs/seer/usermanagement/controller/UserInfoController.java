
package edu.baylor.ecs.seer.usermanagement.controller;

import edu.baylor.ecs.seer.usermanagement.entity.Role;
import edu.baylor.ecs.seer.usermanagement.entity.User;
import edu.baylor.ecs.seer.usermanagement.service.UserAccessService;
import org.keycloak.KeycloakPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.Path;
import java.util.List;
import java.util.stream.Collectors;

/**
 * This is the REST controller for the UMS backend. It exposes a variety
 * of endpoints which allow access to basic CRUD for keycloak users, as
 * well as other more fine-grained features.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
@RestController
@RequestMapping("/userinfo")
public class UserInfoController {

    @Autowired
    private UserAccessService userAccessService;

    @CrossOrigin
    @GetMapping(path = "/users")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userAccessService.getUsers());
    }

    @CrossOrigin
    @GetMapping(path = "/usernames")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<List<String>> getAllUsernames() {
        return ResponseEntity.ok(userAccessService.getUsers()
                .stream()
                .map(User::getUsername)
                .collect(Collectors.toList()));
    }

    @CrossOrigin
    @GetMapping(path = "/usernamesLike")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<List<String>> getUsernamesLike(@RequestParam String username) {
        return ResponseEntity.ok(userAccessService.getUsersLikeName(username)
                .stream()
                .map(User::getUsername)
                .filter(x -> !x.contains("service-account"))
                .collect(Collectors.toList()));
    }

    @CrossOrigin
    @GetMapping(path = "/userRoles/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<List<String>> getUserRoles(@PathVariable String username) {
        return ResponseEntity.ok(userAccessService.getUserRoleNames(username));
    }

    @CrossOrigin
    @GetMapping(path = "/validId/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<Boolean> isValidId(@PathVariable String id) {
        return ResponseEntity.ok(userAccessService.getUsers()
                .stream()
                .anyMatch(x -> x.getId().equals(id)));
    }

    @CrossOrigin
    @GetMapping(path = "/emailInUse/{email}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<String> isEmailInUse(@PathVariable String email) {
        List<User> users = userAccessService.getUsers();
        return ResponseEntity.ok(users
                .stream()
                .filter(x -> email.equals(x.getEmail()))
                .findFirst().orElse(new User()).getId());
    }

    @CrossOrigin
    @GetMapping(path = "/userById/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        List<User> users = userAccessService.getUsers();
        return ResponseEntity.ok(users
                .stream()
                .filter(x -> id.equals(x.getId()))
                .findFirst().orElse(null));
    }

    @CrossOrigin
    @GetMapping(path = "/userByUsername/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        List<User> users = userAccessService.getUsers();
        return ResponseEntity.ok(users
                .stream()
                .filter(x -> username.equals(x.getUsername()))
                .findFirst().orElse(null));
    }

    @CrossOrigin
    @GetMapping(path = "/userIdByUsername/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<String> getIdByUsername(@PathVariable String username) {
        List<User> users = userAccessService.getUsers();
        return ResponseEntity.ok(users
                .stream()
                .filter(x -> username.equals(x.getUsername()))
                .findFirst().orElse(new User()).getId());
    }

    @CrossOrigin
    @PostMapping(path = "/addUser")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<User> addNewUser(@RequestBody User user) {
        return ResponseEntity.ok(userAccessService.addNewUser(user));
    }

    @CrossOrigin
    @PostMapping(path = "/addUserRoles/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<List<Role>> addUserRoles(@PathVariable String username, @RequestBody Role[] roles) {
        return ResponseEntity.ok(userAccessService.addUserRoles(username, roles));
    }

    @CrossOrigin
    @PutMapping(path = "/updateUser")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<String> updateUser(@RequestBody User user) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication auth = context.getAuthentication();
        KeycloakPrincipal principal = (KeycloakPrincipal) auth.getPrincipal();

        if (user.getUsername().equals(principal.getName())
                || auth.getAuthorities()
                    .stream()
                    .anyMatch(x -> x.getAuthority().equals("ROLE_admin")
                        || (x.getAuthority().equals("ROLE_superadmin")))) {
            userAccessService.updateUser(user);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.status(403).body("Forbidden");
    }

    @CrossOrigin
    @PutMapping(path = "/changePassword/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_user', 'ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<String> changePassword(@PathVariable String id, @RequestBody String newPassword) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication auth = context.getAuthentication();
        KeycloakPrincipal principal = (KeycloakPrincipal) auth.getPrincipal();

        User user = userAccessService.getUsers()
                .stream()
                .filter(x -> x.getUsername().equals(principal.getName()))
                .findFirst().orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("No such user");
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 6 characters");
        }

        if (user.getId().equals(id)
                || auth.getAuthorities()
                .stream()
                .anyMatch(x -> x.getAuthority().equals("ROLE_admin")
                        || (x.getAuthority().equals("ROLE_superadmin")))) {
            userAccessService.changeUserPassword(id, newPassword);
            return ResponseEntity.ok("Password changed successfully!");
        }

        return ResponseEntity.status(403).body("Forbidden");
    }

    @CrossOrigin
    @DeleteMapping(path = "/deleteUser/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<String> removeUser(@PathVariable String id) {
        if (userAccessService.getUsers().stream().noneMatch(x -> id.equals(x.getId()))) {
            return ResponseEntity.status(404).body("No user with that id");
        }
        userAccessService.removeUser(id);
        return ResponseEntity.noContent().build();
    }

    @CrossOrigin
    @DeleteMapping(path = "/deleteUserByUsername/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_admin', 'ROLE_superadmin')")
    public ResponseEntity<String> removeUserByUsername(@PathVariable String username) {
        String id = userAccessService.getUsers()
                .stream()
                .filter(x -> username.equals(x.getUsername()))
                .findFirst().orElse(new User()).getId();
        if (id == null) {
            return ResponseEntity.notFound().build();
        }
        userAccessService.removeUser(id);
        return ResponseEntity.noContent().build();
    }

}
