package com.example.taskmanager.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.taskmanager.models.User;
import com.example.taskmanager.util.ImageTypes;

@RestController
public class AvatarController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${spring.api.url}")
    private String url;

    @PostMapping("/user/upload/avatar")
    public ResponseEntity<?> handleAvatarUpload(@RequestParam("avatar") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded.");
        }

        try {
            String contentType = file.getContentType();
            if (contentType == null || !ImageTypes.isImage(contentType)) {
                return ResponseEntity.badRequest().body("Only image files are allowed.");
            }
    
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();
            String userId = user.getId().toString();

            Path userDir = Paths.get(uploadDir + File.separator + userId);
            if (!Files.exists(userDir)) {
                Files.createDirectories(userDir);
            }

            //Remove old files
            File[] files = userDir.toFile().listFiles();
            if (files != null) {
                for (File existingFile : files) {
                    if (existingFile.getName().startsWith("avatar-")) {
                        Files.delete(existingFile.toPath());
                    }
                }
            }

            String fileName = "avatar" + "-" + file.getOriginalFilename();
            Path path = userDir.resolve(fileName);
            Files.copy(file.getInputStream(), path);

            String fileUrl = "/uploads/" + userId + "/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("File upload failed.");
        }
    }

    @GetMapping("/user/avatar/{userId}")
    public ResponseEntity<Map<String, String>> getUserAvatar(@PathVariable Long userId) {
    
        Path userDir = Paths.get(uploadDir + File.separator + userId);
        String avatarUrl = null;
    
        try {
            if (Files.exists(userDir)) {
                File userFolder = userDir.toFile();
                File[] files = userFolder.listFiles();
    
                if (files != null && files.length > 0) {
                    File latestFile = files[0];
                    for (File file : files) {
                        if (file.lastModified() > latestFile.lastModified()) {
                            latestFile = file;
                        }
                    }

                    avatarUrl = url + "/uploads/" + userId + "/" + latestFile.getName();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    
        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", avatarUrl);
    
        return ResponseEntity.ok(response);
    }    
    
}