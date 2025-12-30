# 🗄️ 168sys Database Structure

ไฟล์นี้คือ Source of Truth สำหรับโครงสร้างฐานข้อมูลของโปรเจกต์ 168sys
**กฏ**: เมื่อมีการเปลี่ยนแปลง Schema ในฐานข้อมูล ต้องมาอัปเดตไฟล์นี้ทันที

---

## 📅 Last Updated: 30/12/2025 19:10 (V1.0.0.4)

## 🛠️ Global Rules

- **No Images in DB**: รูปภาพทั้งหมดต้องเก็บใน Storage และอ้างอิง URL เท่านั้น
- **No JSON Columns**: ห้ามเก็บข้อมูลเป็น JSON ให้แยกเป็น Column เพื่อประสิทธิภาพ
- **Naming**: ใช้ `snake_case` สำหรับชื่อ Table และ Column
- **Audit Trails**: ทุก Table ต้องมี `created_at`, `updated_at`, `created_by`, และ `updated_by` เสมอ

---

## 📂 Tables Definition

### 1. `customers` (ข้อมูลหลัก)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (Formal: `customers_pkey`) |
| `name` | Text | ชื่อลูกค้า / บริษัท (NOT NULL) |
| `phone` | Text | เบอร์โทรศัพท์หลัก |
| `email` | Text | อีเมล |
| `line` | Text | Line ID |
| `facebook` | Text | Facebook Page/Link |
| `instagram` | Text | IG Account |
| `media` | Text | ที่มา (Ads, FB, Line, etc.) |
| `note` | Text | หมายเหตุเพิ่มเติม |
| `avatar_url` | Text | URL รูปโปรไฟล์ |
| `created_at` | Timestamp | วันที่สร้าง |
| `updated_at` | Timestamp | วันที่แก้ไขล่าสุด |
| `created_by` | UUID | สร้างโดย (User ID) |
| `updated_by` | UUID | แก้ไขล่าสุดโดย (User ID) |

### 2. `customer_addresses` (ที่อยู่ติดตั้ง/จัดส่ง)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (Formal: `customer_addresses_pkey`) |
| `customer_id` | UUID | Foreign Key (Formal: `customer_addresses_customer_id_fkey`) |
| `label` | Text | ป้ายชื่อ (เช่น บ้าน, ออฟฟิศ) |
| `place_name` | Text | ชื่อสถานที่ |
| `number` | Text | บ้านเลขที่ |
| `villageno` | Text | หมู่ที่ |
| `village` | Text | หมู่บ้าน / อาคาร |
| `lane` | Text | ซอย |
| `road` | Text | ถนน |
| `subdistrict` | Text | แขวง / ตำบล |
| `district` | Text | เขต / อำเภอ |
| `province` | Text | จังหวัด |
| `zipcode` | Text | รหัสไปรษณีย์ |
| `maps` | Text | Google Maps Link |
| `distance` | Numeric | ระยะทางจากร้าน (KM) |
| `is_default` | Boolean | เป็นที่อยู่หลัก |
| `created_at` | Timestamp | วันที่สร้าง |
| `updated_at` | Timestamp | วันที่แก้ไขล่าสุด |
| `created_by` | UUID | สร้างโดย (User ID) |
| `updated_by` | UUID | แก้ไขล่าสุดโดย (User ID) |

### 3. `customer_contacts` (ผู้ติดต่อ)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (Formal: `customer_contacts_pkey`) |
| `customer_id` | UUID | Foreign Key (Formal: `customer_contacts_customer_id_fkey`) |
| `name` | Text | ชื่อผู้ติดต่อ |
| `position` | Text | ตำแหน่ง |
| `phone` | Text | เบอร์โทรศัพท์ |
| `email` | Text | อีเมล |
| `line` | Text | Line ID |
| `facebook` | Text | Facebook Account/Link |
| `instagram` | Text | IG Account |
| `note` | Text | หมายเหตุเพิ่มเติม |
| `created_at` | Timestamp | วันที่สร้าง |
| `updated_at` | Timestamp | วันที่แก้ไขล่าสุด |
| `created_by` | UUID | สร้างโดย (User ID) |
| `updated_by` | UUID | แก้ไขล่าสุดโดย (User ID) |

### 4. `customer_tax_invoices` (ข้อมูลใบกำกับภาษี)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (Formal: `customer_tax_invoices_pkey`) |
| `customer_id` | UUID | Foreign Key (Formal: `customer_tax_invoices_customer_id_fkey`) |
| `company` | Text | นิติบุคคล / บุคคล (ชื่อจดทะเบียน) |
| `taxid` | Text | เลขประจำตัวผู้เสียภาษี |
| `branch` | Text | สาขา (default 00000) |
| `number` | Text | บ้านเลขที่ |
| `villageno` | Text | หมู่ที่ |
| `village` | Text | หมู่บ้าน / อาคาร |
| `building` | Text | อาคาร |
| `lane` | Text | ซอย |
| `road` | Text | ถนน |
| `subdistrict` | Text | แขวง / ตำบล |
| `district` | Text | เขต / อำเภอ |
| `province` | Text | จังหวัด |
| `zipcode` | Text | รหัสไปรษณีย์ |
| `maps` | Text | Google Maps Link |
| `created_at` | Timestamp | วันที่สร้าง |
| `updated_at` | Timestamp | วันที่แก้ไขล่าสุด |
| `created_by` | UUID | สร้างโดย (User ID) |
| `updated_by` | UUID | แก้ไขล่าสุดโดย (User ID) |

---

## ⚡ Performance & Security (Indexes)

### 1. Database Indexes

| Table | Column | Index Type | Purpose |
| :--- | :--- | :--- | :--- |
| `customers` | `name` | B-tree | ค้นหาชื่อแม่นยำ |
| `customers` | `phone` | B-tree | ค้นหาเบอร์โทร |
| `customers` | `name` | GIN (`pg_trgm`) | ค้นหาภาษาไทยแบบยืดหยุ่น |

### 2. Security (RLS)

- **Status**: ทุกตารางอนุญาตเฉพาะ `AUTHENTICATED` user (RLS Enabled)

---

*สร้างโมดูลใหม่แล้วอย่าลืมมาจดไว้ที่นี่!*
