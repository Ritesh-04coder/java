// src/main/java/com/expensetracker/service/CategoryService.java
package name.com.expensetracker.service;

import name.com.expensetracker.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto createCategory(CategoryDto categoryDto);
}