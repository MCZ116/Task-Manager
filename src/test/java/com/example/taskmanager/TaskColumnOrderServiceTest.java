package com.example.taskmanager;

import com.example.taskmanager.models.TaskColumnOrder;
import com.example.taskmanager.repository.TaskColumnOrderRepository;
import com.example.taskmanager.service.TaskColumnOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

}