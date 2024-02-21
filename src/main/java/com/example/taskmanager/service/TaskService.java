package com.example.taskmanager.service;

import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.models.Task;
import com.example.taskmanager.util.TaskNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + taskId));
    }

    public Task addTask(Task task) {

        if (task.getName() == null) {
            throw new IllegalArgumentException("Task name cannot be null");
        }

        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task updatedTask) {
        Task existingTask = getTaskById(taskId);

        existingTask.setName(updatedTask.getName());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDueDate(updatedTask.getDueDate());

        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long taskId) {
        Task task = getTaskById(taskId);
        taskRepository.delete(task);
    }
}
