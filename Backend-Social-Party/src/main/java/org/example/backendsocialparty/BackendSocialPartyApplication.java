package org.example.backendsocialparty;

import org.example.backendsocialparty.servicios.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendSocialPartyApplication implements CommandLineRunner {

    @Autowired
    private QRCodeGenerator qrCodeGenerator;

    public static void main(String[] args) {
        SpringApplication.run(BackendSocialPartyApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // qrCodeGenerator.generateAndSaveQRCode();
    }

}