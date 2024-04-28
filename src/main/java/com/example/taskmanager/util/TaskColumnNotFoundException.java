package com.example.taskmanager.util;
public class TaskColumnNotFoundException extends RuntimeException {

    public TaskColumnNotFoundException(String message) {
        super(message);
    }
}
