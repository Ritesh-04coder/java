package name.com.expensetracker.repository;

import name.com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    @Query("SELECT e FROM Expense e JOIN FETCH e.category WHERE e.category.name = :category")
    List<Expense> findByCategoryNameWithJoin(@Param("category") String category);

    @Query("SELECT e FROM Expense e JOIN FETCH e.category")
    List<Expense> findAllWithJoin();

    @Query("SELECT e FROM Expense e JOIN FETCH e.category WHERE e.date BETWEEN :start AND :end")
    List<Expense> findByDateBetweenWithJoin(@Param("start") LocalDate start, 
                                          @Param("end") LocalDate end);
}