# DormStay - Dormitory Management System - Branch 2

DormStay là một hệ thống quản lý ký túc xá toàn diện được thiết kế để đơn giản hóa quá trình tìm kiếm, đặt phòng và quản lý hợp đồng thuê phòng cho cả người dùng và quản trị viên.

## Tech Stack

Hệ thống được xây dựng trên một stack hiện đại, đảm bảo hiệu suất và khả năng mở rộng:

### **Backend**
- **Node.js & Express**: Framework mạnh mẽ cho việc xây dựng RESTful API.
- **Prisma ORM**: Giúp tương tác với database thông qua các Type-safe query.
- **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ ổn định và mạnh mẽ.
- **JSON Web Token (JWT)**: Xử lý xác thực và phân quyền người dùng.
- **Bcrypt**: Mã hóa mật khẩu an toàn.

### **Frontend**
- **React (Vite)**: Thư viện phát triển giao diện người dùng tối ưu hóa tốc độ.
- **Tailwind CSS**: Framework CSS tiện ích giúp xây dựng UI nhanh chóng và hiện đại.
- **React Router**: Điều hướng trang mượt mà trong Single Page Application.

### **Infrastructure**
- **Docker & Docker Compose**: Đóng gói và chạy toàn bộ hệ thống chỉ với một câu lệnh duy nhất.

---

## Hướng dẫn cài đặt và chạy dự án

Dự án đã được cấu hình đầy đủ bằng Docker để bạn có thể khởi chạy nhanh nhất mà không cần cài đặt nhiều công cụ local.

### **Yêu cầu hệ thống**
- **Docker** và **Docker Compose** đã được cài đặt trên máy.

### **Các bước thực hiện**

1. **Clone repository:**
   ```bash
   git clone <repository_url>
   cd Information-Systems
   ```

2. **Khởi chạy hệ thống bằng Docker Compose:**
   Tại thư mục gốc của dự án, chạy lệnh sau:
   ```bash
   docker-compose up --build
   ```
   *Lưu ý: Lệnh này sẽ tự động khởi tạo database, generate Prisma client, push schema và khởi chạy cả backend lẫn 2 frontend.*

---

## Truy cập ứng dụng

Sau khi khởi chạy thành công, bạn có thể truy cập các dịch vụ tại các địa chỉ sau:

| Dịch vụ | URL | Port |
| :--- | :--- | :--- |
| **User Interface** | [http://localhost:5173](http://localhost:5173) | `5173` |
| **Admin Interface** | [http://localhost:5174](http://localhost:5174) | `5174` |
| **Backend API** | [http://localhost:5000](http://localhost:5000) | `5000` |
| **Database (PostgreSQL)** | `localhost` | `5432` |

---

## Cấu trúc dự án

```text
DormStay/
├── client/
│   ├── admin/      # Ứng dụng React cho Quản trị viên
│   └── user/       # Ứng dụng React cho Người dùng
├── server/         # Backend Node.js & Express
│   ├── prisma/     # Định nghĩa Schema Database & Migrations
│   └── src/        # Mã nguồn xử lý logic API
├── database/       # Chứa các file cấu hình database
└── docker-compose.yml # File cấu hình Docker quản lý container
```

## Tài khoản mặc định

Sau khi chạy lệnh `docker-compose up --build`, hệ thống sẽ tự động khởi tạo database. Bạn có thể sử dụng thông tin sau để đăng nhập (nếu đã có dữ liệu mẫu hoặc dựa trên biến môi trường):

- **Admin Account**: `admin@dormstay.com` / `admin123`

---

## Giấy phép
Dự án được phát triển cho mục đích học tập và quản lý. 

