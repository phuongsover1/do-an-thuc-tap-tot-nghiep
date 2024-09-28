package com.thuctap.fastfood;

import com.thuctap.fastfood.services.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.HashMap;

@RequiredArgsConstructor
@SpringBootApplication
public class FastfoodApplication {

  public static void main(String[] args) {
    SpringApplication.run(FastfoodApplication.class, args);
  }
  public static final HashMap<String, String> forgotPasswordMap =  new HashMap<>();

}
