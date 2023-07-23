package com.thuctap.fastfood.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*",
        allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

}
