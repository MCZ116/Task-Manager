package com.example.taskmanager.dto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Pattern.Flag;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterUserDto {
  
  @NotEmpty(message = "The email address is required.")
  @NotBlank
  @NotNull
  @Email(message = "The email address is invalid.", flags = { Flag.CASE_INSENSITIVE })
  private String username;

  @NotEmpty(message = "The firstname is required.")
  @NotBlank
  @NotNull
  @Size(min = 2, max = 100, message = "The length of firstname must be between 2 and 40 characters.")
  private String firstName;

  @NotEmpty(message = "The lastname name is required.")
  @NotBlank
  @NotNull
  @Size(min = 2, max = 100, message = "The length of lastname must be between 2 and 40 characters.")
  private String lastName;

  @NotEmpty(message = "Password is required.")
  @NotBlank
  @NotNull
  @Size(min = 6, max = 12, message = "Password length must be min 6 up to 12.")
  private String password;
  
}
