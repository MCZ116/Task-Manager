package com.example.taskmanager;

import com.example.taskmanager.controller.TaskColumnOrderController;
import com.example.taskmanager.models.TaskColumnOrder;
import com.example.taskmanager.service.TaskColumnOrderService;
import com.example.taskmanager.util.TaskColumnNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class TaskColumnOrderControllerTest {

    @Mock
    private TaskColumnOrderService taskColumnOrderService;

    @InjectMocks
    private TaskColumnOrderController taskColumnOrderController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetTaskColumnOrder() {
        List<TaskColumnOrder> order = new ArrayList<>();
        order.add(new TaskColumnOrder("testColunmn1", 0));
        order.add(new TaskColumnOrder("testColumn2", 2));

        when(taskColumnOrderService.getTaskColumnOrder()).thenReturn(order);

        ResponseEntity<List<TaskColumnOrder>> response = taskColumnOrderController.getTaskColumnOrder();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
    }

    @Test
    public void testSaveTaskColumnOrder() {
        TaskColumnOrder order = new TaskColumnOrder("testColunmn1", 0);

        when(taskColumnOrderService.saveTaskColumnOrder(order)).thenReturn(order);

        ResponseEntity<?> response = taskColumnOrderController.saveTaskColumnOrder(order);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(order, response.getBody());
    }

    @Test
    public void testGetTaskById() {
        long taskColumnId = 1L;
        TaskColumnOrder order = new TaskColumnOrder("testColunmn1", 0);

        when(taskColumnOrderService.getTaskColumnOrderById(taskColumnId)).thenReturn(order);

        ResponseEntity<TaskColumnOrder> response = taskColumnOrderController.getTaskColumnOrderById(taskColumnId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
    }

    @Test
    public void testGetTaskByIdNotFound() {
        long taskColumnId = 1L;
        when(taskColumnOrderService.getTaskColumnOrderById(taskColumnId)).thenReturn(null);

        assertThrows(TaskColumnNotFoundException.class, () -> taskColumnOrderController.getTaskColumnOrderById(taskColumnId));
    }

}
