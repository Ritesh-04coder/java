package name.com.expensetracker.service;

import name.com.expensetracker.dto.ExpenseDto;
import java.util.List;
import java.util.Map;

public interface ExpenseService {
    List<ExpenseDto> getAllExpenses(String category);
    ExpenseDto createExpense(ExpenseDto expenseDto);
    Map<String, Object> getMonthlySummary(int year, int month);
    
    // Correct parameter type (Long instead of long)
    void deleteExpense(Long id); 
    ExpenseDto updateExpense(Long id, ExpenseDto expenseDto);
}