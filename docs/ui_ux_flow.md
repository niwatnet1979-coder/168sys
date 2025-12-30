# 🧭 UI/UX Flow & Standard

ไฟล์นี้รวบรวม Flow การใช้งานและมาตรฐานการออกแบบ UI/UX ของ 168sys
**กฏ**: ทุกครั้งที่แก้ไข UI Flow หรือ Logic การใช้งาน ต้องอัปเดตไฟล์นี้ทันที

---

## 📅 Last Updated: 30/12/2025 19:05 (V1.0.0.3)

---

## 📂 Customer Module Flow

### 1. หน้าหลัก (Customer List)

- **Entrance**: เข้าถึงจาก Sidebar เมนู "Customers"
- **UX Logic**:
  - แสดงตารางรายชื่อลูกค้าล่าสุด
  - รองรับการค้นหา (Search) จากชื่อ และ เบอร์โทร (Real-time Filter)
  - แสดง Empty State ที่ชัดเจนหากไม่มีข้อมูล
- **Actions**:
  - กด "เพิ่มลูกค้าใหม่" -> เปิด Modal
  - กด "แก้ไข (Edit)" -> เปิด Modal พร้อมโหลดข้อมูลเดิม
  - กด "ลบ (Delete)" -> ยืนยันผ่าน Browser Confirm -> Execute Delete

### 2. การเพิ่ม/แก้ไข (Customer Modal)

- **Magic Paste (Smart Auto-fill)**: พื้นที่ด้านบนสุดสำหรับวางข้อความดิบ (เช่น แชทลูกค้า) เพื่อให้ระบบวิเคราะห์และกระจายข้อมูลไปยังทั้ง 4 Tab โดยอัตโนมัติ
- **UX Pattern**: Tabbed Interface (4 Tabs)
    1. **ข้อมูลทั่วไป (General)**: ชื่อ, เบอร์โทรศัพท์, Line ID, Facebook, Instagram, ที่มา (Dropdown), หมายเหตุ (Detailed fields)
    2. **ผู้ติดต่อ (Contact)**: เพิ่มได้หลายคน โดยมีข้อมูลเบอร์โทรศัพท์ และโซเชียลแยกรายบุคคล
    3. **ที่อยู่ (Address)**: เพิ่มที่อยู่ติดตั้ง/ส่งของได้หลายที่, มีฟิลด์ละเอียดสูงสุด (ชื่อสถานที่, เลขที่, หมู่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์, Google Maps Link)
    4. **ข้อมูลภาษี (Tax)**: เก็บข้อมูลนิติบุคคลสำหรับการออกบิลภาษี รองรับการดึงข้อมูลจาก Tab ที่อยู่มาเติมให้อัตโนมัติ
- **Validation**:
  - บังคับใส่ "ชื่อลูกค้า" เสมอ (*)
- **Logic**:
  - **Audit Trail**: ทุกการบันทึกข้อมูลจะแนบ User ID ของผู้ที่ Login อยู่ลงในฟิลด์ `created_by` (กรณีสร้างใหม่) และ `updated_by` (กรณีแก้ไข) โดยอัตโนมัติ
  - **Transaction Flow**: ใช้รูปแบบ delete-and-reinsert สำหรับข้อมูลชุดย่อย (Addresses, Contacts, Tax Docs) เพื่อความแม่นยำสูงสุดของข้อมูลที่มีความซับซ้อน

---

## 🎨 UI Standards (Visual Guidelines)

### 1. Modal System

- Backdrop: `rgba(0, 0, 0, 0.4)` พร้อม Blur `8px`
- Animation: Slide Up + Fade In
- Border Radius: `24px` (XL)

### 2. Form Experience (Iron Rules)

- **Iron Spacing**: Gap มาตรฐาน 24px (Sections), 12px (Field Groups), 8px (Labels)
- **In-field Labeling**: ใช้ Placeholder บรรยายชื่อฟิลด์ในช่องโดยตรงสำหรับฟอร์มที่มีความหนาแน่นสูง
- **Input State**: Focus ต้องมี Ring สี Primary (`var(--primary-500)`)

### 3. Standard Section Header

To maintain consistency across all forms, section headers must follow this pattern:

- **Icon**: Lucide icon relevant to the content (size 18, primary color).
- **Label**: Bold text (size 15px, slate-600 color).
- **AI Button**: Sparkles icon in a circular button for Magic Paste functionality.
- **Spacing**: 8px gap between elements, 20px bottom margin for the header row.

**Immutable Header Policy**:

- For multi-item cards (Address #1, Contact #2), the header **must not contain inputs**.
- Place editable identifiers (e.g., "Home", "Office") as the first input field *inside* the card, not in the header row.

### 5. Standard Modal Sizes

To ensure mobile compatibility and visual hierarchy:

- **Large (Data Entry)**: 640px max-width, 90vh max-height. Used for complex entities like Customers or Orders.
- **Small (Alerts/Confirm)**: 400px max-width. Used for system messages, delete confirmations, or single-input prompts.
- **Border Radius**: Use `24px` consistently for all modals to maintain the premium round-corner aesthetic.
- **Backdrop**: Always use `rgba(0, 0, 0, 0.4)` with `backdrop-filter: blur(8px)`.

### 6. Magic Paste (AI Auto-fill)

- Triggered by the `Sparkles` icon next to section headers.
- Opens a modal with a textarea for raw text input.
- Automatically parses and populates fields within that specific section context.

### 3. Feedback Loop

- Loading: แสดง Spinner บนปุ่ม Action หลัก และใช้สถานะ "กำลังบันทึก..."
- Error handling: แจ้งเตือนเมื่อเกิดข้อผิดพลาดจากฐานข้อมูล พร้อมจัดการ Error Standard

---

*Flow ใหม่จะมาอัปเดตให้ที่นี่เสมอ!*
