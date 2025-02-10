package org.example.backendsocialparty.servicios;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.example.backendsocialparty.modelos.QRCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class QRCodeGenerator {

    private static final String COUNTER_FILE = "./qr_counter.txt";


    public void generateQRCodeImage(String text, int width, int height, String filePath) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        Path path = FileSystems.getDefault().getPath(filePath);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

        // Save QR code to database
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        QRCode qrCode = new QRCode();
        qrCode.setName(filePath);
        qrCode.setData(pngData);
    }

    private int getNextCounter() throws IOException {
        Path path = Paths.get(COUNTER_FILE);
        int counter = 0;
        if (Files.exists(path)) {
            counter = Integer.parseInt(Files.readString(path).trim());
        }
        counter++;
        Files.writeString(path, Integer.toString(counter));
        return counter;
    }

    // Commented out to prevent execution on startup
    // public void generateAndSaveQRCode() {
    //     try {
    //         String uniqueText = UUID.randomUUID().toString();
    //         int counter = getNextCounter();
    //         String filePath = String.format("./MyQRCode_%d.png", counter);
    //         generateQRCodeImage(uniqueText, 350, 350, filePath);
    //         System.out.println("QR Code generated and saved to database successfully: " + filePath);
    //     } catch (WriterException | IOException e) {
    //         e.printStackTrace();
    //     }
    // }
}