package baylor.csi.questionManagement.security;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.keycloak.adapters.KeycloakConfigResolver;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@KeycloakConfiguration
public class SecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
    private static final Logger logger = LogManager.getLogger(SecurityConfig.class.getName());
    @Autowired
    public KeycloakClientRequestFactory keycloakClientRequestFactory;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        logger.info(Thread.currentThread().getId() + ":" + "configureGlobal" + "(" + auth + ")");
        KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
        keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
        auth.authenticationProvider(keycloakAuthenticationProvider);
    }

    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        logger.info(Thread.currentThread().getId() + ":" + "sessionAuthenticationStrategy" + "()");
        return new NullAuthenticatedSessionStrategy();
    }

    @Bean
    public KeycloakConfigResolver keycloakConfigResolver() {

        logger.info(Thread.currentThread().getId() + ":" + "keycloakConfigResolver" + "()");
        return new KeycloakSpringBootConfigResolver();
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public KeycloakRestTemplate keycloakRestTemplate() {

        logger.info(Thread.currentThread().getId() + ":" + "keycloakRestTemplate" + "()");

        return new KeycloakRestTemplate(keycloakClientRequestFactory);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        logger.info(Thread.currentThread().getId() + ":" + "configure" + "(" + http + ")");
        super.configure(http);
        http.authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/*").permitAll()
                //.antMatchers("/category*","/categoryinfo*","/configuration*","/language*","/question*","/icpchotel/security*").hasRole("admin")
                //.antMatchers("/test*").hasRole("user")
                //.antMatchers("/test*").hasRole("admin")
                .anyRequest().permitAll()
                .and().csrf().disable();

    }

}
