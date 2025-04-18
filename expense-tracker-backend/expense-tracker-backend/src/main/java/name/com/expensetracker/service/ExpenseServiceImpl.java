package name.com.expensetracker.service;

import name.com.expensetracker.dto.ExpenseDto;
import name.com.expensetracker.model.Category;
import name.com.expensetracker.model.Expense;
import name.com.expensetracker.repository.CategoryRepository;
import name.com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, 
                             CategoryRepository categoryRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
    }

    // [GET ALL EXPENSES] - With eager loading
    @Override
    @Transactional(readOnly = true)
    public List<ExpenseDto> getAllExpenses(String category) {
        List<Expense> expenses = category != null 
            ? expenseRepository.findByCategoryNameWithJoin(category)
            : expenseRepository.findAllWithJoin();

        return expenses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // [CREATE EXPENSE] - With currency and category validation
    @Override
    @Transactional
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        // Validate mandatory fields
        if (expenseDto.getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID is required");
        }

        // Fetch category by ID
        Category category = categoryRepository.findById(expenseDto.getCategoryId())
            .orElseThrow(() -> new IllegalArgumentException(
                "Invalid Category ID: " + expenseDto.getCategoryId()
            ));

        // Build expense entity
        Expense expense = new Expense();
        expense.setAmount(expenseDto.getAmount());
        expense.setDescription(expenseDto.getDescription());
        expense.setDate(expenseDto.getDate());
        expense.setCategory(category);
        expense.setNotes(expenseDto.getNotes());
        
        // Handle currency code (default to USD if null)
        if (expenseDto.getCurrencyCode() != null) {
            expense.setCurrencyCode(expenseDto.getCurrencyCode());
        } else {
            expense.setCurrencyCode("USD"); // Default value
        }

        Expense savedExpense = expenseRepository.save(expense);
        return convertToDto(savedExpense);
    }

    // [MONTHLY SUMMARY] - With eager loading
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getMonthlySummary(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Expense> expenses = expenseRepository.findByDateBetweenWithJoin(startDate, endDate);

        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getCategory().getName(),
                        Collectors.mapping(Expense::getAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));

        return Map.of(
                "totalAmount", totalAmount,
                "totalCount", expenses.size(),
                "byCategory", byCategory);
    }

    // [DELETE EXPENSE]
    @Override
    @Transactional
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    // [UPDATE EXPENSE] - With category validation
    @Override
    @Transactional
    public ExpenseDto updateExpense(Long id, ExpenseDto expenseDto) {
        return expenseRepository.findById(id)
                .map(existingExpense -> {
                    // Update core fields
                    existingExpense.setAmount(expenseDto.getAmount());
                    existingExpense.setDescription(expenseDto.getDescription());
                    existingExpense.setDate(expenseDto.getDate());
                    existingExpense.setNotes(expenseDto.getNotes());
                    
                    // Update currency code
                    if (expenseDto.getCurrencyCode() != null) {
                        existingExpense.setCurrencyCode(expenseDto.getCurrencyCode());
                    }

                    // Handle category update
                    if (expenseDto.getCategoryId() != null && 
                        !expenseDto.getCategoryId().equals(existingExpense.getCategory().getId())) {
                        
                        Category newCategory = categoryRepository.findById(expenseDto.getCategoryId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                    "Invalid Category ID: " + expenseDto.getCategoryId()
                                ));
                        existingExpense.setCategory(newCategory);
                    }

                    Expense updatedExpense = expenseRepository.save(existingExpense);
                    return convertToDto(updatedExpense);
                })
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with ID: " + id));
    }

    // [DTO CONVERSION] - Includes all fields
    private ExpenseDto convertToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setAmount(expense.getAmount());
        dto.setDescription(expense.getDescription());
        dto.setDate(expense.getDate());
        dto.setCategoryId(expense.getCategory().getId());
        dto.setCategoryName(expense.getCategory().getName());
        dto.setNotes(expense.getNotes());
        dto.setCurrencyCode(expense.getCurrencyCode());
        return dto;
    }
}