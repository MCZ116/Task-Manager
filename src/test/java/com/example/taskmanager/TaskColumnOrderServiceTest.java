package com.example.taskmanager;

import com.example.taskmanager.models.TaskColumnOrder;
import com.example.taskmanager.repository.TaskColumnOrderRepository;
import com.example.taskmanager.service.TaskColumnOrderService;
import com.example.taskmanager.util.TaskColumnNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class TaskColumnOrderServiceTest {

    @Mock
    private TaskColumnOrderService taskColumnOrderService;

    @Mock
    private TaskColumnOrderRepository taskColumnOrderRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        taskColumnOrderService = new TaskColumnOrderService(taskColumnOrderRepository);
    }

    @Test
    void getAllTasksColumnOrder_ReturnsListOfTasksColumnOrder() {
        List<TaskColumnOrder> order = new ArrayList<>();
        order.add(new TaskColumnOrder("testColunmn1", 0));
        order.add(new TaskColumnOrder("testColumn2", 2));

        when(taskColumnOrderRepository.findAll()).thenReturn(order);

        List<TaskColumnOrder> result = taskColumnOrderService.getTaskColumnOrder();

        assertEquals(order.size(), result.size());
        assertEquals(order.get(0), result.get(0));
        assertEquals(order.get(1), result.get(1));
        verify(taskColumnOrderRepository, times(1)).findAll();
    }

    @Test
    void savedTaskColumnOrder_ReturnsSavedTaskColumnOrder() {
        TaskColumnOrder order = new TaskColumnOrder("testColunmn1", 0);
        when(taskColumnOrderRepository.save(order)).thenReturn(order);

        TaskColumnOrder result = taskColumnOrderService.saveTaskColumnOrder(order);

        assertEquals(order, result);
        verify(taskColumnOrderRepository, times(1)).save(order);
    }

    @Test
    void getTaskColumnOrderById_ExistingTaskId_ReturnsTask() {
        Long taskColumnId = 1L;
        TaskColumnOrder order = new TaskColumnOrder("testColunmn1", 0);
        when(taskColumnOrderRepository.findById(taskColumnId)).thenReturn(Optional.of(order));

        TaskColumnOrder result = taskColumnOrderService.getTaskColumnOrderById(taskColumnId);

        assertEquals(order, result);
        verify(taskColumnOrderRepository, times(1)).findById(taskColumnId);
    }

    @Test
    void getTaskColumnOrder_NonExistingTaskId_ThrowsTaskNotFoundException() {
        Long taskColumnId = 1L;
        when(taskColumnOrderRepository.findById(taskColumnId)).thenReturn(Optional.empty());

        assertThrows(TaskColumnNotFoundException.class, () -> taskColumnOrderService.getTaskColumnOrderById(taskColumnId));
        verify(taskColumnOrderRepository, times(1)).findById(taskColumnId);
    }

}