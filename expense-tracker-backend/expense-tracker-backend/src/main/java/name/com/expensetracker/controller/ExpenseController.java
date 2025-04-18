// src/main/java/com/expensetracker/controller/ExpenseController.java
package name.com.expensetracker.controller;

import name.com.expensetracker.dto.ExpenseDto;
import name.com.expensetracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseDto> getAllExpenses(@RequestParam(required = false) String category) {
        return expenseService.getAllExpenses(category);
    }

    @PostMapping
    public ExpenseDto createExpense(@RequestBody ExpenseDto expenseDto) {
        return expenseService.createExpense(expenseDto);
    }

    @GetMapping("/summary")
    public Map<String, Object> getMonthlySummary(
        @RequestParam int year,
        @RequestParam int month
    ) {
        return expenseService.getMonthlySummary(year, month);
    }
}