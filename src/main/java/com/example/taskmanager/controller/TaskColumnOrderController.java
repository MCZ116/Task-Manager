package com.example.taskmanager.controller;

import com.example.taskmanager.models.Task;
import com.example.taskmanager.models.TaskColumnOrder;
import com.example.taskmanager.service.TaskColumnOrderService;
import com.example.taskmanager.util.TaskColumnNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasksColumnOrder")
public class TaskColumnOrderController {

    private final TaskColumnOrderService taskColumnOrderService;

    @Autowired
    public TaskColumnOrderController(TaskColumnOrderService taskColumnOrderService) {
        this.taskColumnOrderService = taskColumnOrderService;
    }

    @GetMapping
    public ResponseEntity<List<TaskColumnOrder>> getTaskColumnOrder() {
        List<TaskColumnOrder> taskColumnOrder = taskColumnOrderService.getTaskColumnOrder();
        return new ResponseEntity<>(taskColumnOrder, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> saveTaskColumnOrder(@RequestBody TaskColumnOrder taskColumnOrder) {
        TaskColumnOrder result = taskColumnOrderService.saveTaskColumnOrder(taskColumnOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/{columnId}")
    public ResponseEntity<TaskColumnOrder> getTaskColumnOrderById(@PathVariable Long columnId) {
        TaskColumnOrder taskColumnOrder = taskColumnOrderService.getTaskColumnOrderById(columnId);
        if (taskColumnOrder == null ) {
            throw new TaskColumnNotFoundException("Task column not found with id: " + columnId);
        }
        return ResponseEntity.ok(taskColumnOrder);
    }


}
