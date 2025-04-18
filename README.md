# Student Expense Tracker

A web application for students to manage and visualize their daily expenses. Built with a React.js and Tailwind CSS frontend and a Spring Boot backend.

---

## 🔍 Features

- **User Authentication**: Secure login for students.
- **Expense Management**: Add, update, and delete expenses by category (e.g., Food, Transport, Books).
- **Interactive Dashboard**: View a list of all expenses and quickly filter by date or category.
- **Data Visualization**: Dynamic charts to track spending trends over time.
- **Responsive Design**: Mobile-first layout with Tailwind CSS.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Java JDK](https://adoptium.net/) (v11+)
- [Maven](https://maven.apache.org/) (v3+)
- (Optional) [MySQL](https://www.mysql.com/) or your preferred relational database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ritesh-04-coder/student-expense-tracker.git
   cd student-expense-tracker
   ```

2. **Setup Backend**
   ```bash
   cd backend
   # Configure database settings in src/main/resources/application.properties
   mvn clean install
   mvn spring-boot:run
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install      # or yarn install
   npm start        # or yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 🛠 Technology Stack

| Layer        | Technology       |
| ------------ | ---------------- |
| Frontend     | React.js         |
| Styling      | Tailwind CSS     |
| State Mgmt   | React Context API / Redux (optional) |
| Charts       | Recharts / Chart.js |
| Backend      | Spring Boot      |
| Database     | MySQL / H2 / PostgreSQL |
| Build Tool   | Maven            |

---

## 🎬 Usage

1. **Register / Login**: Create a student account or log in if you already have one.
2. **Add Expense**: Navigate to the "Add Expense" dashboard, enter amount, category, date, and description.
3. **Manage Expenses**: From the dashboard, update or delete any existing expense.
4. **View Charts**: Switch to the "Analytics" tab to see your spending patterns displayed in charts.

---

## 📸 Screenshots

![Login Page](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📫 Contact

Created by [Ritesh-04-coder](https://github.com/Ritesh-04-coder). Feel free to reach out at your.email@example.com for any questions or feedback.
