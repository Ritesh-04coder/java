package name.com.expensetracker.repository;

import name.com.expensetracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Custom method to find by name
    Optional<Category> findByName(String name);
    
    // findById() is already inherited from JpaRepository
    // No need to declare it explicitly
}