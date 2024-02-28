package com.example.taskmanager;

import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.models.Task;
import com.example.taskmanager.service.TaskService;
import com.example.taskmanager.util.TaskNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskService taskService;

    @Mock
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        taskService = new TaskService(taskRepository);
    }

    @Test
    void getAllTasks_ReturnsListOfTasks() {
        List<Task> tasks = new ArrayList<>();
        tasks.add(new Task("Task 1", "Description 1", "01/01/2022"));
        tasks.add(new Task("Task 2", "Description 2", "02/01/2022"));
        when(taskRepository.findAll()).thenReturn(tasks);

        List<Task> result = taskService.getAllTasks();

        assertEquals(tasks.size(), result.size());
        assertEquals(tasks.get(0), result.get(0));
        assertEquals(tasks.get(1), result.get(1));
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void getTaskById_ExistingTaskId_ReturnsTask() {
        Long taskId = 1L;
        Task task = new Task("Task 1", "Description 1", "01/01/2022");
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        Task result = taskService.getTaskById(taskId);

        assertEquals(task, result);
        verify(taskRepository, times(1)).findById(taskId);
    }

    @Test
    void getTaskById_NonExistingTaskId_ThrowsTaskNotFoundException() {
        Long taskId = 1L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getTaskById(taskId));
        verify(taskRepository, times(1)).findById(taskId);
    }

    @Test
    void addTask_ValidTask_ReturnsSavedTask() {
        Task task = new Task("Task 1", "Description 1", "01/01/2022");
        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.addTask(task);

        assertEquals(task, result);
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void addTask_TaskWithNullName_ThrowsIllegalArgumentException() {
        Task task = new Task(null, "Description 1", "01/01/2022");

        assertThrows(IllegalArgumentException.class, () -> taskService.addTask(task));
        verify(taskRepository, never()).save(task);
    }

    @Test
    void updateTask_ExistingTaskId_ReturnsUpdatedTask() {
        Long taskId = 1L;
        Task existingTask = new Task("Task 1", "Description 1", "01/01/2022");
        Task updatedTask = new Task("Updated Task", "Updated Description", "02/01/2022");
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(existingTask)).thenReturn(existingTask);

        Task result = taskService.updateTask(taskId, updatedTask);

        assertEquals(updatedTask.getName(), result.getName());
        assertEquals(updatedTask.getDescription(), result.getDescription());
        assertEquals(updatedTask.getDueDate(), result.getDueDate());
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).save(existingTask);
    }

    @Test
    void updateTask_NonExistingTaskId_ThrowsTaskNotFoundException() {
        Long taskId = 1L;
        Task updatedTask = new Task("Updated Task", "Updated Description", "02/01/2022");
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.updateTask(taskId, updatedTask));
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void deleteTask_ExistingTaskId_DeletesTask() {
        Long taskId = 1L;
        Task task = new Task("Task 1", "Description 1", "01/01/2022");
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        taskService.deleteTask(taskId);

        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    void deleteTask_NonExistingTaskId_ThrowsTaskNotFoundException() {
        Long taskId = 1L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTask(taskId));
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, never()).delete(any(Task.class));
    }
}