package com.thuctap.fastfood.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;

import javax.sql.DataSource;


@Configuration
public class AuthenticationProviderConfig {
  @Bean
  public UserDetailsService userDetailsService(DataSource dataSource) {
    var JdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
    String usersByUsernameQuery = "select username, password, status AS enabled from accounts WHERE username = ?";
    String authsByUsernameQuery = "select username, roles.name AS authority FROM accounts, roles WHERE username = ? AND accounts.id_role = roles.id";
    JdbcUserDetailsManager.setUsersByUsernameQuery(usersByUsernameQuery);
    JdbcUserDetailsManager.setAuthoritiesByUsernameQuery(authsByUsernameQuery);
    return JdbcUserDetailsManager;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  
}
