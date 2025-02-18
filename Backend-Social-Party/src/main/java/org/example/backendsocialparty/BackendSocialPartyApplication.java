package org.example.backendsocialparty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendSocialPartyApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendSocialPartyApplication.class, args);
    }

}
