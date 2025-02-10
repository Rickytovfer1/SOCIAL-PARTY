package org.example.backendsocialparty.modelos;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Lob;

@Embeddable
public class QRCode {

    private String name;

    @Lob
    private byte[] data;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}