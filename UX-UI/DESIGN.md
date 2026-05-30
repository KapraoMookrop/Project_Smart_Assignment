# System Design Document: Smart Task Assignment System

## 1. Project Overview
**Application Name:** TaskToGroup (หรือชื่อโปรเจกต์ที่กำหนด)
**Tagline:** Intelligent routing for high-performing teams. (ระบบกระจายงานอัจฉริยะ เพื่อทีมเวิร์กที่เหนือกว่า)
**Objective:** แพลตฟอร์มบริหารจัดการและกระจายงาน (Task Assignment) ที่ใช้สถาปัตยกรรมแบบ Multi-Tenant รองรับการใช้งานหลายบริษัท โดยมีระบบแจ้งเตือนแบบเรียลไทม์ไปยังพนักงานที่อยู่ในหมวดหมู่งาน (Category) ที่กำหนด เพื่อให้ผู้รับผิดชอบสามารถกดรับงาน (Claim Task) ได้อย่างรวดเร็วและแม่นยำ

---

## 2. System Architecture & Technology Stack
*   **Architecture Pattern:** Multi-Tenant Architecture (แยกข้อมูลแต่ละบริษัทด้วย `company_id` เพื่อ Data Isolation)
*   **Frontend:** Angular (รองรับการใช้งานบน Web และสามารถต่อยอดเป็น Hybrid Mobile App ผ่าน Ionic + Capacitor)
*   **Backend:** ASP.NET Core (.NET 9) หรือ Node.js (Express) สำหรับจัดการ RESTful API และ Business Logic
*   **Database:** PostgreSQL หรือ MSSQL (Relational Database)
*   **Authentication:** JWT (JSON Web Token) โดยมีการแนบ `company_id` และ `role` ไว้ใน Payload 

---

## 3. User Roles & Permissions
ระบบแบ่งผู้ใช้งานออกเป็น 3 ระดับ:
1.  **Super Admin:** ผู้ดูแลระบบหลังบ้าน จัดการการเพิ่ม/ลด/ระงับ บริษัท (Tenant) ในระบบ ไม่สามารถเข้าถึงข้อมูลงานของบริษัทได้
2.  **Company Admin:** แอดมินระดับบริษัท จัดการพนักงาน สร้างหมวดหมู่งาน และเป็นผู้สร้าง/จ่ายงานเข้าหมวดหมู่
3.  **Regular User:** พนักงานทั่วไป รอรับการแจ้งเตือนงานใหม่ในหมวดหมู่ของตนเอง กดรับงาน และอัปเดตสถานะงาน

---

## 4. Database Schema (ERD)

### 4.1 `Companies` (Tenant)
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `company_id` | UUID / INT | **PK** | รหัสบริษัท |
| `name` | VARCHAR(150)| | ชื่อบริษัท |
| `is_active` | BOOLEAN | | สถานะเปิด/ปิดการใช้งาน |
| `created_at` | TIMESTAMP | | วันที่สร้าง |

### 4.2 `Users`
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID / INT | **PK** | รหัสผู้ใช้งาน |
| `company_id` | UUID / INT | **FK** | รหัสบริษัท (เชื่อม `Companies.company_id`) |
| `username` | VARCHAR(100)| | ชื่อผู้ใช้งาน |
| `email` | VARCHAR(255)| | อีเมลสำหรับ Login |
| `password_hash`| VARCHAR(255)| | รหัสผ่าน (Hashed) |
| `role` | VARCHAR(50) | | `SuperAdmin`, `CompanyAdmin`, `User` |

### 4.3 `Categories`
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `category_id` | UUID / INT | **PK** | รหัสหมวดหมู่ |
| `company_id` | UUID / INT | **FK** | รหัสบริษัท |
| `name` | VARCHAR(100)| | ชื่อหมวดหมู่งาน |
| `created_by` | UUID / INT | **FK** | ผู้สร้างหมวดหมู่ |

### 4.4 `Category_Members` (Junction Table)
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `category_id` | UUID / INT | **PK, FK**| รหัสหมวดหมู่ |
| `user_id` | UUID / INT | **PK, FK**| รหัสพนักงานในหมวดหมู่ |

### 4.5 `Tasks`
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `task_id` | UUID / INT | **PK** | รหัสงาน |
| `company_id` | UUID / INT | **FK** | รหัสบริษัท |
| `category_id` | UUID / INT | **FK** | หมวดหมู่งานที่ต้องทำ |
| `title` | VARCHAR(255)| | หัวข้องาน |
| `description` | TEXT | | รายละเอียดงาน |
| `assigned_to` | UUID / INT | **FK** | พนักงานที่กดรับงานนี้ (Nullable) |
| `status` | VARCHAR(50) | | `Pending`, `In Progress`, `Done` |
| `created_by` | UUID / INT | **FK** | ผู้สร้างงาน |
| `created_at` | TIMESTAMP | | วันที่สร้างงาน |

### 4.6 `Notifications`
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `notification_id`| UUID / INT | **PK** | รหัสแจ้งเตือน |
| `user_id` | UUID / INT | **FK** | ผู้รับการแจ้งเตือน |
| `task_id` | UUID / INT | **FK** | งานที่แจ้งเตือน |
| `is_read` | BOOLEAN | | สถานะการอ่าน |

---

## 5. User Workflows

### 5.1 Super Admin Flow
1. Login เข้าสู่ระบบ (`role: SuperAdmin`)
2. ดู Dashboard สถิติรวมของระบบ
3. จัดการ `Companies` (เพิ่มบริษัทใหม่, กำหนดสถานะ Active/Inactive)
4. สร้างบัญชี `CompanyAdmin` เริ่มต้นให้กับบริษัทที่เพิ่งสร้าง

### 5.2 Company Admin Flow
1. Login เข้าสู่ระบบ (`company_id` ถูกโหลดลง Token)
2. เข้าสู่เมนู **Team Management**: เพิ่มพนักงาน (`Users`) เข้าสู่บริษัท
3. เข้าสู่เมนู **Category Management**: สร้าง `Categories` และเพิ่มพนักงานเข้าหมวดหมู่
4. เข้าสู่เมนู **Task Management**: สร้าง `Tasks` ใหม่ พร้อมผูกกับ `category_id`
   *(Backend จะทำการสร้าง `Notifications` ไปยังทุกคนในหมวดหมู่นั้นอัตโนมัติ)*

### 5.3 Regular User Flow
1. Login เข้าสู่ระบบด้วยบัญชีพนักงาน
2. เข้าสู่ **User Dashboard**: ระบบแสดงรายการ Notification หรือ Task ที่มีหมวดหมู่ตรงกับตนเอง
3. ตรวจสอบรายละเอียดงาน (Task Details)
4. กดปุ่ม **Claim Task**: Backend อัปเดต `Tasks.assigned_to` เป็น `user_id` ของผู้กด และเปลี่ยนสถานะเป็น `In Progress`
5. ดำเนินการทำงานและอัปเดตสถานะเป็น `Done` เมื่อเสร็จสิ้น

---

## 6. UI/UX Design System

### 6.1 Theme & Styling
*   **Design Concept:** Modern, Professional, Minimalist, Clean Layout
*   **Color Palette:**
    *   **Background:** Dark Theme (Deep Navy Blue / Midnight Blue)
    *   **Surface/Cards:** Slightly lighter dark blue (สร้างมิติและความลึก)
    *   **Primary/Accent:** Cyan / Bright Blue (ใช้สำหรับปุ่ม Call to Action, Badge แจ้งเตือน และเส้นแบ่ง เพื่อดึงดูดสายตา)
    *   **Text:** High-contrast White / Light Gray สำหรับการอ่านที่สบายตา
*   **Typography:** ฟอนต์ Sans-serif ที่มีความเป็นทางการ อ่านง่ายและดูสะอาดตา

### 6.2 Key UI Components
*   **Navigation:** Collapsible Sidebar ทางด้านซ้าย และ Top App Bar สำหรับแสดง Profile และ Notification Bell
*   **Data Representation:** 
    *   หน้า Admin ใช้ Data Table หรือ Grid ที่จัดเรียงอย่างเป็นระเบียบ
    *   หน้า User ใช้ Task Cards ที่มีการแสดง Category Tags ชัดเจน
*   **Interactivity:** เน้นปุ่ม **"Claim Task"** ให้มีความโดดเด่น พร้อมมี Hover Effect แบบนุ่มนวล