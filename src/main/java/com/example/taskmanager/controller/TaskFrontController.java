package com.example.taskmanager.controller;
import com.example.taskmanager.models.Task;
import com.example.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/taskmanager")
public class TaskFrontController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/tasks")
    public String tasks(Model model) {
        List<Task> tasks = taskService.getAllTasks();
        model.addAttribute("tasks", tasks);
        return "tasks";
    }

//    @PostMapping("/tasks")
//    public String addTask(@ModelAttribute Task task) {
//        taskService.addTask(task);
//        return "redirect:/testmanager/tasks";
//    }
//
//    @GetMapping("/tasks/{taskId}/edit")
//    public String editTask(@PathVariable Long taskId, Model model) {
//        Task task = taskService.getTaskById(taskId);
//        model.addAttribute("task", task);
//        return "redirect:/testmanager/tasks";
//    }
//
//    @PostMapping("/tasks/{taskId}/update")
//    public String updateTask(@PathVariable Long taskId, @ModelAttribute Task updatedTask) {
//        taskService.updateTask(taskId, updatedTask);
//        return "redirect:/testmanager/tasks";
//    }
//
//    @PostMapping("/tasks/{taskId}/delete")
//    public String deleteTask(@PathVariable Long taskId) {
//        taskService.deleteTask(taskId);
//        return "redirect:/testmanager/tasks";
//    }

}




