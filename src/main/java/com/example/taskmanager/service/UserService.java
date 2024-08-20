package com.example.taskmanager.service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.taskmanager.dto.UserDTO;
import com.example.taskmanager.models.User;
import com.example.taskmanager.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> new UserDTO(user.getId(), user.getFirstName(), user.getLastName()))
                .collect(Collectors.toList());

    }

    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(); //ADD EXCEPTION

        return new UserDTO(user.getId(), user.getFirstName(), user.getLastName());
    }
    
}
