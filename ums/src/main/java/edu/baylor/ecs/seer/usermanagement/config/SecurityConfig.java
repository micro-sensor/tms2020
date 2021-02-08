package edu.baylor.ecs.seer.usermanagement.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakSecurityComponents;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * This provides the security configuration for integration with keycloak. It relies on the values defined in
 * application.yml for config.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
@Configuration
@EnableWebSecurity
@ComponentScan(basePackageClasses = KeycloakSecurityComponents.class)
class SecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
    private static final Logger logger = LogManager.getLogger(SecurityConfig.class.getName());

    @Autowired
    public void configureGlobal(
            AuthenticationManagerBuilder auth) throws Exception {
        logger.info(Thread.currentThread().getId() + ":" + "AutenticationManagerBuilder" + "(" + auth + ")");
        KeycloakAuthenticationProvider keycloakAuthenticationProvider
                = keycloakAuthenticationProvider();
        keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(
                new SimpleAuthorityMapper());
        auth.authenticationProvider(keycloakAuthenticationProvider);
    }

    @Bean
    public KeycloakSpringBootConfigResolver KeycloakConfigResolver() {
        logger.info(Thread.currentThread().getId() + ":" + "KeycloakConfigResolver" + "()");
        return new KeycloakSpringBootConfigResolver();
    }

    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        logger.info(Thread.currentThread().getId() + ":" + "sesstionAuthenticationStrategy" + "()");
        return new RegisterSessionAuthenticationStrategy(
                new SessionRegistryImpl());
    }

    @Bean
    public OAuth2RestTemplate oauth2RestTemplate(OAuth2ProtectedResourceDetails details) {
        logger.info(Thread.currentThread().getId() + ":" + "oath2RestTemplate" + "(" + details+ ")");
        OAuth2RestTemplate oAuth2RestTemplate = new OAuth2RestTemplate(details);

        //Prepare by getting access token once
        oAuth2RestTemplate.getAccessToken();
        return oAuth2RestTemplate;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        logger.info(Thread.currentThread().getId() + ":" + "configure" + "(" + http+ ")");
        http.csrf().disable();
        http.authorizeRequests()
                .antMatchers("/userinfo*")
                .hasRole("user")
                .anyRequest()
                .permitAll();
    }

    @Bean
    public FilterRegistrationBean corsFilter() {
        logger.info(Thread.currentThread().getId() + ":" + "corsFilter" + "()");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(0);
        return bean;
    }
}
