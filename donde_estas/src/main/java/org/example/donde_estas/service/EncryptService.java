package org.example.donde_estas.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCrypt;


@Service
public class EncryptService {
    public String encryptPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public boolean verifyPassword(String originalPassword, String hashedPassword) {
        return BCrypt.checkpw(originalPassword, hashedPassword);
    }
}
