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
    private final JwtService jwtService;

    @Autowired
    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;

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

    public UserDTO getUserByToken(String jwt) {
        String username = jwtService.getUsernameFromToken(jwt);
        User user = userRepository.findByUsername(username).orElseThrow();
        return new UserDTO(user.getId(), user.getFirstName(), user.getLastName());
    }
    
}
