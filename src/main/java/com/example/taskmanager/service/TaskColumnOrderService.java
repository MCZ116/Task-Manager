package com.example.taskmanager.service;

import com.example.taskmanager.models.TaskColumnOrder;
import com.example.taskmanager.repository.TaskColumnOrderRepository;
import com.example.taskmanager.util.TaskColumnNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskColumnOrderService {

    private final TaskColumnOrderRepository taskColumnOrderRepository;

    @Autowired
    public TaskColumnOrderService(TaskColumnOrderRepository taskColumnOrderRepository) {
        this.taskColumnOrderRepository = taskColumnOrderRepository;
    }

    public List<TaskColumnOrder> getTaskColumnOrder() {
        return taskColumnOrderRepository.findAll();
    }

    public TaskColumnOrder saveTaskColumnOrder(TaskColumnOrder taskColumnOrder){

        return taskColumnOrderRepository.save(taskColumnOrder);
    }

    public TaskColumnOrder getTaskColumnOrderById(Long taskColumnId) {
        return taskColumnOrderRepository.findById(taskColumnId)
                .orElseThrow(() -> new TaskColumnNotFoundException("Task column not found with id: " + taskColumnId));
    }
}
