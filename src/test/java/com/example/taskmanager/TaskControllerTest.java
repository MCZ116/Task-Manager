package com.example.taskmanager;

import com.example.taskmanager.controller.TaskController;
import com.example.taskmanager.models.Task;
import com.example.taskmanager.service.TaskService;
import com.example.taskmanager.util.TaskNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllTasks() {
        List<Task> tasks = new ArrayList<>();
        tasks.add(new Task("Task 1", "Description 1", "01/01/2022"));
        tasks.add(new Task("Task 2", "Description 2", "02/01/2022"));

        when(taskService.getAllTasks()).thenReturn(tasks);

        ResponseEntity<List<Task>> response = taskController.getAllTasks();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(tasks, response.getBody());
    }

    @Test
    public void testGetTaskById() {
        long taskId = 1L;
        Task task = new Task("Task 1", "Description 1", "01/01/2022");

        when(taskService.getTaskById(taskId)).thenReturn(task);

        ResponseEntity<Task> response = taskController.getTaskById(taskId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(task, response.getBody());
    }

    @Test
    public void testGetTaskByIdNotFound() {
        long taskId = 1L;
        when(taskService.getTaskById(taskId)).thenReturn(null);

        assertThrows(TaskNotFoundException.class, () -> taskController.getTaskById(taskId));
    }

    @Test
    public void testAddTask() {
        Task task = new Task("Task 1", "Description 1", "01/01/2022");

        when(taskService.addTask(task)).thenReturn(task);

        ResponseEntity<?> response = taskController.addTask(task);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(task, response.getBody());
    }

    @Test
    public void testUpdateTask() {
        long taskId = 1L;
        Task existingTask = new Task("Task 1", "Description 1", "01/01/2022");
        existingTask.setId(taskId);

        Task updatedTask = new Task("Updated Task","Updated Description","02/01/2022");

        when(taskService.getTaskById(taskId)).thenReturn(existingTask);
        when(taskService.updateTask(taskId, updatedTask)).thenReturn(updatedTask);

        ResponseEntity<Task> response = taskController.updateTask(taskId, updatedTask);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedTask, response.getBody());
    }

    @Test
    public void testDeleteTask() {
        long taskId = 1L;
        ResponseEntity<Void> response = taskController.deleteTask(taskId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(taskService, times(1)).deleteTask(taskId);
    }
}
