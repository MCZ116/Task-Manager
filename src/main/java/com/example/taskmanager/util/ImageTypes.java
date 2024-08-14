package com.example.taskmanager.util;

public class ImageTypes {

    public static boolean isImage(String contentType) {
        return contentType.equals("image/jpeg") || 
               contentType.equals("image/png") || 
               contentType.equals("image/gif") || 
               contentType.equals("image/bmp") || 
               contentType.equals("image/webp");
    }
    
}
