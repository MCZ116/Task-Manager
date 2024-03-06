package com.example.taskmanager.controller;

import com.example.taskmanager.models.TaskColumnOrder;
import com.example.taskmanager.service.TaskColumnOrderService;
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

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping
    public ResponseEntity<List<TaskColumnOrder>> getTaskColumnOrder() {
        List<TaskColumnOrder> taskColumnOrder = taskColumnOrderService.getTaskColumnOrder();
        return new ResponseEntity<>(taskColumnOrder, HttpStatus.OK);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping
    public ResponseEntity<?> saveTaskColumnOrder(@RequestBody TaskColumnOrder taskColumnOrder) {
        TaskColumnOrder result = taskColumnOrderService.saveTaskColumnOrder(taskColumnOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


}
