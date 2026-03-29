# 🎬 Movie Ticket POS Admin System

A premium, high-performance Movie Ticket POS Admin System designed for managing cinema schedules, tracking movie availability, and organizing ticketing data. This system features a React-based frontend with advanced data structures (BST & Min-Heap) for efficient searching and priority sorting, and a robust PHP backend with MySQL integration.

## ✨ Key Features

- **Dashboard Overview**: Real-time stats on total movies, upcoming releases, and urgent showtimes.
- **Priority List**: Automatically sorts movies by release date using a **Min-Heap** algorithm to highlight expiring schedules.
- **Smart Search**: Powered by a **Binary Search Tree (BST)** for lightning-fast movie lookups by Name or ID.
- **Movie Management**: Full CRUD (Create, Read, Update, Delete) operations for movie records.
- **Dynamic Status**: Intelligent status assignment (Urgent, Soon, Upcoming) based on the release date.
- **Responsive & Premium UI**: Sleek dark-mode interface with glassmorphism and smooth micro-animations.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Custom Variable System)
- **Data Structures**: BST (Binary Search Tree) for searching, Min-Heap for priority queues.

### Backend
- **Language**: PHP
- **Server**: PHP Built-in Server (Port 8000)
- **CORS**: Custom CORS middleware for secure API communication.

### Database
- **Type**: MySQL (RDBMS)
- **Connection**: MySQLi

## 📊 Data Structure

### Database Table: `movies`
The system is built around the following MySQL structure:

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `INT(11)` | Primary Key, Auto-increment |
| `MovieName` | `VARCHAR(255)` | The title of the movie |
| `ReleasDate` | `DATETIME` | Scheduled release date and time |
| `ticketprice` | `DECIMAL(10,2)`| Price per ticket |
| `Status` | `VARCHAR(255)` | Urgency status (Urgent, Soon, Upcoming) |
| `release_time` | `TIME` | Extracted time for show scheduling |
| `created_at` | `TIMESTAMP` | Record creation date |
| `updated_at` | `TIMESTAMP` | Record last modification date |

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js** (v16+)
- **PHP** (v7.4+)
- **MySQL Server** (XAMPP / WAMP recommended)

### 2. Database Setup
1. Create a database named `movieticketingsystem`.
2. Execute the following SQL query to create the table:
```sql
CREATE TABLE IF NOT EXISTS `movies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `MovieName` varchar(255) NOT NULL,
  `ReleasDate` datetime NOT NULL,
  `ticketprice` decimal(10,2) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `release_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3. Backend Configuration
1. Navigate to the `Backend` directory.
2. Ensure your `Backend/config/db_connection.php` contains the correct credentials:
```php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "movieticketingsystem";
```
3. Start the PHP server:
```bash
php -S 127.0.0.1:8000
```

### 4. Frontend Configuration
1. Navigate to the `frontend` directory.
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

## 📂 Project Structure

```text
├── Backend/
│   ├── config/db_connection.php   # Database connection
│   ├── utils/cors.php             # CORS policy
│   ├── Get_Movies.php             # GET API
│   ├── Save_Movie.php             # POST API
│   ├── Update_Movie.php           # UPDATE API
│   └── Delete_Movie.php           # DELETE API
└── frontend/
    ├── src/
    │   ├── Components/            # Dashboard, Movies, Navbar
    │   ├── utils/                 # BST.js, Sorting.js
    │   └── App.jsx                # Main Logic & Routing
    └── README.md
```

---
*Built with ❤️ for Movie Ticket POS Admin System.*
