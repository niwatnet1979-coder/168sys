# 168sys Project Transfer Document

## Project Overview

168sys is a business management system built with Next.js and Supabase, designed for managing customers, personnel, orders, inventory, and system settings. The system emphasizes clean architecture, real-time data synchronization, and a premium user interface with strict design standards.

**Technology Stack:**
- Frontend: Next.js 13.4.10, React 18.2.0
- Backend/Database: Supabase (PostgreSQL with Realtime)
- UI Libraries: Lucide React (icons), SweetAlert2 (notifications)
- Styling: Vanilla CSS with CSS Variables, styled-jsx for component scoping

**Development Environment:**
- Development Port: 3000
- Database: Supabase Realtime (PostgreSQL)
- Language: Thai (UI and user-facing content)

---

## Core Features & Modules

### 1. Customer Management Module

**Purpose:** Complete customer relationship management with detailed contact information, addresses, and tax invoice data.

**Features:**
- Customer list with search functionality (by name, phone number)
- Create, read, update, delete (CRUD) operations for customers
- Tabbed interface for organizing customer data:
  - **General Information Tab:** Name, phone, email, Line ID, Facebook, Instagram, media source, notes, avatar
  - **Contacts Tab:** Multiple contact persons per customer with individual phone, email, Line, Facebook, Instagram, position, and notes
  - **Addresses Tab:** Multiple delivery/installation addresses with granular fields (place name, house number, village number, village, lane, road, subdistrict, district, province, zipcode, Google Maps link, distance, default flag)
  - **Tax Invoice Tab:** Tax registration information (company name, tax ID, branch number, full address details)
- Magic Paste feature: AI-powered text parsing to auto-fill customer data from raw text (chat messages, documents)
- Real-time data synchronization using Supabase Realtime
- Empty state handling with helpful UI guidance

**Key Functions:**
- `getCustomers()` - Fetch all customers with related data (addresses, contacts, tax invoices)
- `saveCustomer(formData)` - Save customer and all related data using delete-then-insert strategy for related tables
- `deleteCustomer(id)` - Delete customer (cascade deletes related records)

**Data Relationships:**
- One customer can have multiple addresses (`customer_addresses`)
- One customer can have multiple contacts (`customer_contacts`)
- One customer can have multiple tax invoice records (`customer_tax_invoices`)

---

### 2. Personnel Management Module

**Purpose:** Comprehensive employee and team management system.

**Features:**
- **Employee Management:**
  - Employee list with search (by nickname, employee ID)
  - Employee cards displaying: nickname, full name, employee ID, job position, team affiliation, status
  - Detailed employee profiles with:
    - Basic Info: Employee ID (auto-generated from UUID suffix: `EP[6-chars]`), nickname, first name, last name, full name (auto-generated)
    - Employment Details: Team assignment, job position, job level, employment type, work type, pay type, pay rate, incentive rate
    - Personal Info: Citizen ID, birth date, start date, end date, status (current/resigned)
    - Contacts: Multiple contact methods (phone, email, Line, etc.) with primary flag
    - Addresses: Multiple addresses with full Thai address structure
    - Bank Accounts: Multiple bank accounts with default flag
    - Documents: File uploads for employee documents (profile, ID card, contract) stored in Supabase Storage
  - Status tracking (current employees vs. resigned)
  
- **Team Management:**
  - Team list with member count
  - Team details: Name, type (ช่าง/QC/SALE/บริหาร), payment QR code URL, status (active/inactive), sort order
  - Team-employee relationship (many employees belong to one team)

**Key Functions:**
- `getEmployees()` - Fetch all employees with relations (team, contacts, addresses, bank accounts, documents)
- `saveEmployee(formData)` - Save employee and all related data, auto-generate EID for new employees
- `deleteEmployee(id)` - Delete employee
- `getTeams()` - Fetch all teams ordered by sort_order and name
- `saveTeam(formData)` - Save team data
- `deleteTeam(id)` - Delete team

**Data Relationships:**
- Many employees belong to one team (`employees.team_id` → `teams.id`)
- One employee can have multiple contacts (`employee_contacts`)
- One employee can have multiple addresses (`employee_addresses`)
- One employee can have multiple bank accounts (`employee_bank_accounts`)
- One employee can have multiple documents (`employee_documents`)

---

### 3. Settings Module

**Purpose:** System-wide configuration and dynamic option management.

**Features:**
- **Shop Information Tab:**
  - Shop/Company details: Name, place name, full address (number, village number, village, lane, road, subdistrict, district, province, zipcode)
  - Contact information: Phone, email
  - Tax information: Tax ID, VAT registration status, VAT rate
  - Google Maps link

- **System Options Tab:**
  - Dynamic dropdown options management organized by categories:
    - **Product Options:** Product types, materials, material colors, crystal colors, light colors, remotes, bulb types
    - **Sales & Customer:** Customer channels
    - **Personnel:** Team names, team types, job positions, job levels, employment types, payment types, pay rates, incentive rates
    - **Finance:** Bank names, document types, expense types
  - Add/remove options dynamically
  - Options stored in `system_options_lists` table (single source of truth for all dropdowns)

- **Document Settings Tab:**
  - Default terms and conditions for quotations
  - Warranty policy text

**Key Functions:**
- `getSettings()` - Fetch shop settings and all system options grouped by category
- `saveShopSettings(settingsData)` - Save shop information, financial settings, and document settings
- `syncSystemOptions(category, items)` - Synchronize options for a specific category (delete-then-insert strategy)

**Important:** All dropdown options throughout the system must be fetched from `system_options_lists` table. No hardcoded options allowed.

---

### 4. Dashboard Module

**Purpose:** Overview of business metrics and recent activities.

**Features:**
- Statistics cards: Total revenue, new customers, active orders (with percentage changes)
- Recent transactions table: Customer name, status, amount, timestamp
- Action cards with call-to-action buttons
- Responsive grid layout

**Note:** Currently displays mock data. Should be connected to actual order/transaction data in future iterations.

---

## Database Schema

### Core Tables

#### 1. `customers`
Primary customer information table.

**Columns:**
- `id` (UUID, Primary Key)
- `name` (Text, NOT NULL) - Customer/company name
- `phone` (Text) - Primary phone number
- `email` (Text) - Email address
- `line` (Text) - Line ID
- `facebook` (Text) - Facebook page/link
- `instagram` (Text) - Instagram account
- `media` (Text) - Source/channel (Ads, FB, Line, etc.)
- `note` (Text) - Additional notes
- `avatar_url` (Text) - Profile picture URL (stored in Supabase Storage)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `created_by` (UUID) - User ID who created
- `updated_by` (UUID) - User ID who last updated

**Indexes:**
- B-tree index on `name` (exact search)
- B-tree index on `phone` (exact search)
- GIN index on `name` using `pg_trgm` (fuzzy Thai search)

#### 2. `customer_addresses`
Customer delivery/installation addresses.

**Columns:**
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key → `customers.id`)
- `label` (Text) - Address label (e.g., "บ้าน", "ออฟฟิศ")
- `place_name` (Text) - Place/building name
- `number` (Text) - House number
- `villageno` (Text) - Village number (หมู่ที่)
- `village` (Text) - Village/building name
- `lane` (Text) - Lane/Soi (ซอย)
- `road` (Text) - Road name (ถนน)
- `subdistrict` (Text) - Subdistrict (ตำบล/แขวง)
- `district` (Text) - District (อำเภอ/เขต)
- `province` (Text) - Province (จังหวัด)
- `zipcode` (Text) - Postal code
- `maps` (Text) - Google Maps link
- `distance` (Numeric) - Distance from shop (KM)
- `is_default` (Boolean) - Default address flag
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 3. `customer_contacts`
Contact persons for customers.

**Columns:**
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key → `customers.id`)
- `name` (Text) - Contact person name
- `position` (Text) - Job position
- `phone` (Text) - Phone number
- `email` (Text) - Email
- `line` (Text) - Line ID
- `facebook` (Text) - Facebook account/link
- `instagram` (Text) - Instagram account
- `note` (Text) - Additional notes
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 4. `customer_tax_invoices`
Tax invoice information for customers.

**Columns:**
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key → `customers.id`)
- `company` (Text) - Registered company name
- `taxid` (Text) - Tax ID (13 digits)
- `branch` (Text) - Branch number (default: "00000")
- `number` (Text) - House number
- `villageno` (Text) - Village number
- `village` (Text) - Village/building
- `building` (Text) - Building name
- `lane` (Text) - Lane/Soi
- `road` (Text) - Road
- `subdistrict` (Text) - Subdistrict
- `district` (Text) - District
- `province` (Text) - Province
- `zipcode` (Text) - Postal code
- `maps` (Text) - Google Maps link
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 5. `teams`
Team/department information.

**Columns:**
- `id` (UUID, Primary Key)
- `name` (Text, Unique) - Team name
- `team_type` (Text) - Type (ช่าง, QC, SALE, บริหาร)
- `payment_qr_url` (Text) - QR code URL for payment
- `status` (Text) - Status (active, inactive)
- `sort_order` (Integer) - Display order
- `created_at`, `updated_at`, `created_by`, `updated_by`

**Indexes:**
- B-tree index on `name` (exact search)

#### 6. `employees`
Employee master data.

**Columns:**
- `id` (UUID, Primary Key)
- `eid` (Text, Unique) - Employee ID (format: `EP[6-chars]` from UUID suffix)
- `nickname` (Text, NOT NULL) - Nickname
- `first_name` (Text) - First name
- `last_name` (Text) - Last name
- `fullname` (Text) - Auto-generated full name
- `team_id` (UUID, Foreign Key → `teams.id`) - Team assignment
- `job_position` (Text) - Job position
- `job_level` (Text) - Job level
- `employment_type` (Text) - Employment type
- `work_type` (Text) - Work type
- `pay_type` (Text) - Payment type
- `pay_rate` (Numeric) - Pay rate
- `incentive_rate` (Numeric) - Commission rate (%)
- `citizen_id` (Text) - Citizen ID
- `birth_date` (Date) - Birth date
- `start_date` (Date) - Employment start date
- `end_date` (Date) - Employment end date
- `status` (Text) - Status (current, resigned)
- `created_at`, `updated_at`, `created_by`, `updated_by`

**Indexes:**
- GIN index on `nickname` using `pg_trgm` (fuzzy Thai search)
- GIN index on `fullname` using `pg_trgm` (fuzzy Thai search)
- B-tree index on `eid` (exact search)

#### 7. `employee_contacts`
Employee contact information.

**Columns:**
- `id` (UUID, Primary Key)
- `employee_id` (UUID, Foreign Key → `employees.id`)
- `name` (Text) - Contact label (e.g., "เบอร์หลัก")
- `contact_type` (Text) - Type (phone, email, line, etc.)
- `value` (Text) - Contact value
- `is_primary` (Boolean) - Primary contact flag
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 8. `employee_addresses`
Employee addresses.

**Columns:**
- `id` (UUID, Primary Key)
- `employee_id` (UUID, Foreign Key → `employees.id`)
- `label` (Text) - Address label
- `place_name` (Text) - Place name
- `number`, `villageno`, `village`, `lane`, `road`, `subdistrict`, `district`, `province`, `zipcode` (Text) - Full address structure
- `maps` (Text) - Google Maps link
- `is_default` (Boolean) - Default address flag
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 9. `employee_bank_accounts`
Employee bank account information.

**Columns:**
- `id` (UUID, Primary Key)
- `employee_id` (UUID, Foreign Key → `employees.id`)
- `bank_name` (Text) - Bank name (e.g., KBANK, SCB)
- `account_number` (Text) - Account number
- `account_name` (Text) - Account holder name
- `is_default` (Boolean) - Default account flag
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 10. `employee_documents`
Employee document files.

**Columns:**
- `id` (UUID, Primary Key)
- `employee_id` (UUID, Foreign Key → `employees.id`)
- `doc_type` (Text) - Document type (profile, id_card, contract)
- `file_url` (Text) - File URL (stored in Supabase Storage)
- `file_name` (Text) - Original file name
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 11. `settings`
System settings (single row with id='default').

**Columns:**
- `id` (Text, Primary Key) - Always 'default'
- `name` (Text) - Shop/company name
- `place_name`, `number`, `villageno`, `village`, `soi`, `road`, `subdistrict`, `district`, `province`, `zipcode` (Text) - Shop address
- `google_map_link` (Text) - Google Maps link
- `phone` (Text) - Shop phone
- `email` (Text) - Shop email
- `tax_id` (Text) - Tax ID
- `vat_registered` (Boolean) - VAT registration status
- `vat_rate` (Numeric) - VAT rate (%)
- `promptpay_qr` (Text) - PromptPay QR code
- `default_terms` (Text) - Default quotation terms
- `warranty_policy` (Text) - Warranty policy text
- `created_at`, `updated_at`, `created_by`, `updated_by`

#### 12. `system_options_lists`
Dynamic dropdown options (single source of truth).

**Columns:**
- `id` (UUID, Primary Key)
- `category` (Text) - Category identifier (e.g., 'productTypes', 'teamTypes')
- `value` (Text) - Option value
- `label` (Text) - Display label
- `sort_order` (Integer) - Display order
- `is_active` (Boolean) - Active flag
- `created_at`, `updated_at`, `created_by`, `updated_by`

**Categories:**
- Product: `productTypes`, `materials`, `materialColors`, `crystalColors`, `lightColors`, `remotes`, `bulbTypes`
- Sales: `customerChannels`
- Personnel: `teamNames`, `teamTypes`, `jobPositions`, `jobLevels`, `employmentTypes`, `paymentTypes`, `payRates`, `incentiveRates`
- Finance: `bankNames`, `documentTypes`, `expenseTypes`

### Database Rules

1. **Primary Keys:** All tables use UUID as primary key
2. **Audit Trail:** Every table must have `created_at`, `updated_at`, `created_by`, `updated_by`
3. **No JSON Columns:** All data stored in normalized columns (no JSON/JSONB)
4. **No Images in DB:** Images/files stored in Supabase Storage, only URLs stored in database
5. **Row Level Security (RLS):** All tables must have RLS enabled with authenticated-only policies
6. **Naming Convention:** `snake_case` for tables and columns
7. **Foreign Keys:** Proper foreign key constraints with cascade delete where appropriate
8. **Indexes:** B-tree for exact matches, GIN with `pg_trgm` for fuzzy Thai text search

---

## Core Functions & Business Logic

### Data Management Patterns

#### 1. Save Pattern (Delete-Then-Insert)
For related tables (addresses, contacts, tax invoices, etc.), the system uses a delete-then-insert strategy:
- Delete all existing related records for the parent entity
- Insert new records from form data
- This ensures data consistency and avoids orphaned records

**Rationale:** Simpler than diff/upsert logic, ensures clean state, suitable for form-based editing.

#### 2. Auto-Generation Rules
- **Employee ID (EID):** Auto-generated from UUID suffix: `EP[last-6-chars-of-UUID]` (e.g., `EP1saff3`)
- **Full Name:** Auto-generated from `first_name + last_name` for employees
- **Display ID Format:** `[2-char-prefix][6-char-UUID-suffix]` for UI display (e.g., `EP1saff3`)

#### 3. User Authentication & Audit
- All save operations require authenticated user
- `created_by` and `updated_by` automatically populated from `supabase.auth.getUser()`
- If no user session, operations may fail or use fallback (development only)

#### 4. File Upload Pattern
- Files uploaded to Supabase Storage buckets:
  - `employee_documents` bucket for employee files
  - Organized by employee ID: `{employee_id}/{timestamp}_{random}.{ext}`
- Only public URLs stored in database
- File validation and error handling required

### Utility Functions

#### 1. Address Parser (`addressParser.js`)
**Function:** `parseUniversalAddress(inputText)`

Parses raw Thai address text into structured components.

**Extracts:**
- Company/name
- Phone number (Thai format)
- Email
- Line ID
- Tax ID (13 digits)
- Branch number
- Google Maps link
- Zipcode (5 digits)
- Full address components: number, village number, village, lane, road, subdistrict, district, province

**Use Case:** Magic Paste feature for auto-filling customer/employee data from chat messages or documents.

#### 2. Formatters (`formatters.js`)
- `formatCurrency(amount)` - Format as Thai Baht (฿1,200.00)
- `formatDate(date)` - Format as `DD/MM/YYYY HH:mm` (Thai locale)
- `getErrorMessage(error)` - Standardized Thai error messages

#### 3. Alert System (`sweetAlert.js`)
Standardized notification system using SweetAlert2:
- `showConfirm()` - Confirmation dialogs
- `showSuccess()` - Success messages (auto-close)
- `showError()` - Error messages
- `showLoading()` - Loading spinner (blocking)

All messages in Thai language.

---

## UI/UX Standards & Requirements

### Design System

#### Color Palette
- **Primary:** Blue scale (`--primary-50` to `--primary-900`)
- **Neutrals:** Slate scale for backgrounds and text
- **Semantic:** Success (green), Error (red), Warning (orange), Info (blue)
- **Rule:** No hardcoded colors. Use CSS variables from `globals.css` only.

#### Typography
- **Font Family:** Outfit (primary), Inter (fallback)
- **Scale:** H1 (2rem), H2 (1.5rem), H3 (1.25rem), Body (1rem), Small (0.875rem), XS (0.75rem)
- **Rule:** No hardcoded font sizes. Use CSS variables.

#### Spacing
- **Standard Gaps:** 12px (field groups), 24px (sections), 8px (labels)
- **Component Height:** 48px standard for inputs, buttons, tabs (Ultimate UI Row Standard)

#### Border Radius
- **Standard:** 14px for main controls
- **Cards:** 20px-24px
- **Modals:** 24px

#### Shadows
- **Small:** `--shadow-sm`
- **Medium:** `--shadow-md`
- **Large:** `--shadow-lg`

### Component Standards

#### 1. Input Fields
- **Height:** 48px
- **Class:** `input-field` (from globals.css)
- **Icon:** Must have contextual icon inside input (absolute left 12px)
- **Padding:** `padding-left: 48px` when icon present
- **Placeholder:** Thai language, muted color
- **Focus:** Primary border color + 4px ring shadow

#### 2. Buttons
- **Height:** 48px
- **Class:** `button-primary` or `button-ghost`
- **Font:** 16px, Semibold (600)
- **Hover:** `translateY(-2px)` + shadow increase
- **Active:** `scale(0.98)`

#### 3. Dropdowns (DynamicSelect)
- **Height:** 48px
- **Font:** 14px Semibold (600) for selected value
- **Placeholder:** Thai, muted (opacity 0.4-0.5)
- **Icon:** Chevron Down, right-aligned (16px from edge)
- **Behavior:** Searchable, with "Add new option" feature if value not found
- **Source:** Must fetch from `system_options_lists` table

#### 4. Modals
- **Type A (Data Entry):** 640px max-width, 90vh max-height, 24px border-radius
- **Type B (Alert):** 400px max-width
- **Backdrop:** `rgba(0, 0, 0, 0.4)` with `blur(8px)`
- **Animation:** Slide up + fade in
- **Header:** Icon + Title + AI Button (Sparkles icon)
- **Footer:** Cancel + Save buttons

#### 5. Section Headers
**Standard Pattern:** `[Icon] [Label/Title] [AI/Sparkles Button]`

**Specifications:**
- Container: `display: flex`, `align-items: center`, `gap: 8px`, `margin-bottom: 20px`
- Icon: `size={18}`, `color: var(--primary-500)`
- Text: `fontSize: 15px`, `fontWeight: 700`, `color: #475569`, `line-height: 1`
- AI Button: `.magic-icon-btn` with `Sparkles size={14}`

**Immutable Headers Policy:**
- For multi-item sections (Addresses, Contacts, Tax Invoices), headers must be static: `[Title] #[Index]` (e.g., "ข้อมูลผู้ติดต่อ #1")
- No input fields in headers. Editable labels go inside card body as first field.

#### 6. Empty States
**Required Components:**
1. **Icon:** Large (48-64px), muted color (`var(--text-muted)`)
2. **Title:** Clear heading (e.g., "ไม่พบข้อมูลพนักงาน")
3. **Description:** Helpful text with action guidance
4. **Optional:** Call-to-action button

#### 7. Search Boxes
**Pattern:**
- Wrapper: `relative`, `height: 48px`
- Icon: `absolute`, `left: 16px`, `top: 50%`, `translateY(-50%)`, `pointer-events: none`, `z-index: 10`
- Input: `height: 100%`, `width: 100%`, `padding-left: 48px`, `input-field` class
- Focus: `border-color: var(--primary-400)`, `box-shadow: 0 0 0 4px var(--primary-50)`

#### 8. Tables
- Header: Background `var(--bg-main)`, border bottom, uppercase labels, muted color
- Rows: Hover effect, border between rows
- Responsive: Horizontal scroll on mobile

#### 9. Cards
- Background: White (`var(--bg-card)`)
- Border: `1px solid var(--border-color)`
- Border-radius: 20px
- Padding: 24px-32px
- Shadow: `var(--shadow-sm)`, increases on hover
- Hover: `translateY(-2px)` + shadow increase

### Layout Standards

#### Main Layout
- **Sidebar:** 280px width, sticky, white background
- **Main Content:** Max-width 1400px, centered, padding 32px
- **Mobile:** Hamburger menu, sidebar overlay
- **Navigation:** Icon + Label, active state highlighting

#### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

#### Mobile-First Approach
- Touch-friendly: Minimum 44x44px for interactive elements
- No horizontal scroll
- Adaptive layouts using flexbox/grid
- Viewport meta: Prevents zoom (app-like experience)

### Interaction Standards

#### Micro-interactions
- **Hover:** `transform: translateY(-2px)` + shadow increase
- **Active (Click):** `transform: scale(0.98)`
- **Transitions:** `all 0.2s ease` or `cubic-bezier(0.4, 0, 0.2, 1)`

#### Loading States
- Button: Disabled state + "กำลังบันทึก..." text
- Page: Spinner + message
- Table: "ดาวน์โหลดข้อมูล..." message

#### Error Handling
- All API calls wrapped in try-catch
- Errors displayed via `showError()` (SweetAlert2)
- User-friendly Thai error messages

### Form Standards

#### Numeric Inputs
- **Auto-select on Focus:** `onFocus={e => e.target.select()}`
- **Empty State Handling:** Allow empty string, don't default to 0
- **Pattern:** `e.target.value === '' ? '' : Number(e.target.value)`

#### Field Labeling
- **Dense Forms:** Use placeholder instead of label (saves space)
- **All Inputs:** Must have placeholder (Thai language)

#### Validation
- Required fields marked with asterisk (*)
- Client-side validation before submission
- Server-side validation via Supabase constraints

#### Date & Time Format
- **Display:** `DD/MM/YYYY HH:mm` (Thai locale)
- **Database:** ISO-8601 (handled by Supabase)
- **Conversion:** Use `formatDate()` utility for display

#### Currency Format
- **Symbol:** ฿ (Thai Baht)
- **Format:** `1,200.00` (thousand separators, 2 decimal places)
- **Function:** Use `formatCurrency()` utility

---

## Key Components Architecture

### Common Components

#### 1. `FormInput`
Reusable text input with icon support.

**Props:**
- `placeholder` (string)
- `value` (string)
- `onChange` (function)
- `icon` (Lucide icon component)
- `type` (string, optional)

**Features:**
- Icon positioned inside (absolute left)
- Standard 48px height
- Focus ring effect

#### 2. `DynamicSelect`
Searchable dropdown with dynamic option management.

**Props:**
- `options` (array) - From `system_options_lists`
- `value` (string)
- `onChange` (function)
- `placeholder` (string)
- `category` (string) - For adding new options
- `onAddNew` (function) - Callback when user adds new option

**Features:**
- Searchable
- "Add new option" if value not found
- Auto-syncs to `system_options_lists` table

#### 3. `MainLayout`
Application shell with sidebar and main content area.

**Props:**
- `children` (React node)
- `title` (string) - Page title

**Features:**
- Responsive sidebar
- Mobile hamburger menu
- Navigation highlighting
- Consistent spacing

### Feature Components

#### 1. `CustomerModal`
Tabbed modal for customer data entry.

**Tabs:**
- General (basic info)
- Contacts (multiple contact persons)
- Addresses (multiple addresses)
- Tax (tax invoice info)

**Features:**
- Magic Paste integration
- Dynamic option management
- Delete-then-insert save pattern
- Validation (name required)

#### 2. `EmployeeModal`
Comprehensive employee data entry modal.

**Sections:**
- Basic information
- Employment details
- Contacts
- Addresses
- Bank accounts
- Documents (file upload)

**Features:**
- Team selection (from teams table)
- Auto EID generation
- File upload to Supabase Storage
- Full address structure

#### 3. `TeamModal`
Team creation/editing modal.

**Fields:**
- Name (unique)
- Type (dropdown from system options)
- Payment QR URL
- Status
- Sort order

#### 4. `MagicPasteModal`
AI-powered text parsing modal.

**Features:**
- Textarea for raw text input
- Parses using `parseUniversalAddress()`
- Auto-fills target section
- Context-aware (basic, contact, address, tax)

---

## Data Flow & Real-time Strategy

### Supabase Realtime

**Current Implementation:**
- Uses Supabase Realtime subscriptions for data synchronization
- `useRealtime` hook pattern (to be implemented/standardized)
- Automatic cleanup on component unmount

**Requirements:**
- All reference data (teams, system options) must be fetched via Realtime
- No cached snapshots in separate tables
- Single source of truth principle

### Data Fetching Pattern

1. **Initial Load:** Fetch all data on component mount
2. **Real-time Updates:** Subscribe to table changes
3. **Optimistic UI:** Update UI immediately, sync with server
4. **Error Handling:** Rollback on error, show notification

### Transaction Flow

For complex saves (customer with addresses/contacts):
1. Save main entity (customer/employee)
2. Delete related records
3. Insert new related records
4. Return success/error

**Note:** Not a true database transaction (Supabase doesn't support multi-table transactions in this context), but ensures consistency through sequential operations.

---

## Security & Data Integrity

### Authentication
- Supabase Auth required for all operations
- User ID tracked in `created_by` and `updated_by`
- RLS policies enforce authenticated-only access

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies: Authenticated users only
- Future: Role-based access control (RBAC) can be added

### Data Validation
- **Client-side:** Form validation before submission
- **Server-side:** Database constraints (NOT NULL, UNIQUE, Foreign Keys)
- **Business Logic:** Validation in manager functions

### File Storage Security
- Supabase Storage buckets with access policies
- Organized by entity type (e.g., `employee_documents`)
- Public URLs for display, private buckets for sensitive data

### Audit Trail
- Every record tracks:
  - Who created (`created_by`)
  - When created (`created_at`)
  - Who last updated (`updated_by`)
  - When last updated (`updated_at`)

---

## Future Modules (Not Yet Implemented)

### 1. Orders Module
**Planned Features:**
- Order creation and management
- Customer selection (from customers table)
- Product/Service selection
- Pricing and calculations
- Order status tracking
- Invoice generation

### 2. Inventory Module
**Planned Features:**
- Product catalog
- Stock management
- Product categories (from system options)
- Material tracking
- Supplier management

### 3. Financial Module
**Planned Features:**
- Revenue tracking
- Expense management
- Payment processing
- Bank reconciliation
- Financial reports

---

## Development Guidelines

### Code Organization

#### File Structure Principles
- **Anti-Monolith Rule:** Files should not exceed 600-800 lines (UI) or 300-400 lines (Logic)
- **Logic Extraction:** Complex logic → Custom Hooks (e.g., `useEmployeeForm`, `useTeamData`)
- **Component Splitting:** Reusable UI pieces → Separate component files
- **Scalable Structure:** Avoid "God Objects"

#### Naming Conventions
- **Database:** `snake_case` (tables, columns)
- **Components/Files:** `PascalCase` (e.g., `CustomerModal.jsx`)
- **Variables/Functions:** `camelCase` (e.g., `getCustomers`)
- **Constants:** `UPPER_SNAKE_CASE`

### Code Quality Standards

#### Clean Code Principles
- **No Dead Code:** Remove unused files and code
- **No Hardcoded Values:** Use constants, CSS variables, system options
- **Separation of Concerns:** Business logic separate from UI
- **DRY (Don't Repeat Yourself):** Reuse components and utilities

#### Error Handling
- All async operations in try-catch
- User-friendly error messages (Thai)
- Logging for debugging
- Graceful degradation

#### Performance
- **Optimistic UI:** Immediate feedback
- **Lazy Loading:** Load data on demand
- **Memoization:** Use React.memo, useMemo, useCallback where appropriate
- **Image Optimization:** Use Next.js Image component

### Testing Requirements (Future)

#### Unit Tests
- Manager functions (CRUD operations)
- Utility functions (formatters, parsers)
- Component logic

#### Integration Tests
- API interactions
- Database operations
- File uploads

#### E2E Tests
- User workflows
- Form submissions
- Navigation

---

## Environment Setup

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup Requirements

1. **Database:**
   - Create all tables as per schema
   - Set up RLS policies
   - Create indexes (B-tree and GIN)
   - Enable `pg_trgm` extension for fuzzy search

2. **Storage:**
   - Create buckets: `employee_documents`, `customer_assets`, `inventory_images`
   - Set bucket policies (public/private as needed)

3. **Authentication:**
   - Enable email/password authentication
   - Configure user management

### Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm start        # Start production server
```

---

## Migration & Data Management

### Database Migrations

Migration files located in `src/lib/v1/`:
- `customer_migration.sql`
- `team_migration.sql`
- `setting_migration.sql`
- `employee_migration.sql` (implied)

**Migration Strategy:**
- Version-controlled SQL files
- Run migrations in order
- Test on staging before production

### Data Import/Export

**Future Requirements:**
- CSV import for bulk customer/employee data
- Data export for backup
- Migration tools for schema changes

---

## Documentation Maintenance

### Source of Truth Files

1. **`docs/database_schema.md`**
   - Must be updated when schema changes
   - Contains table definitions, indexes, RLS policies

2. **`docs/ui_ux_flow.md`**
   - Must be updated when UI flows change
   - Contains user workflows and interaction patterns

3. **`project_transfer.md`** (this file)
   - High-level requirements and architecture
   - Feature specifications
   - Business logic patterns

### Update Protocol

When making changes:
1. Update relevant documentation file
2. Update code comments if logic changes
3. Update migration files if schema changes
4. Test changes thoroughly

---

## Critical Rules Summary

### Must-Follow Rules

1. **No Hardcoded Colors:** Use CSS variables only
2. **No Hardcoded Font Sizes:** Use CSS variables only
3. **48px Standard Height:** All inputs, buttons, tabs in same row
4. **No JSON Columns:** Normalize all data
5. **No Images in DB:** Use Supabase Storage
6. **UUID Primary Keys:** All tables
7. **Audit Trail:** All tables must have `created_at`, `updated_at`, `created_by`, `updated_by`
8. **RLS Enabled:** All tables
9. **Single Source of Truth:** System options from `system_options_lists` only
10. **Thai Language:** All UI text and error messages
11. **Date Format:** `DD/MM/YYYY HH:mm` everywhere
12. **Currency Format:** ฿ with thousand separators
13. **Real-time Reference Data:** No cached snapshots
14. **Clean Code:** No dead code, no unused files
15. **Component Size Limits:** Max 600-800 lines (UI), 300-400 lines (Logic)

---

## Support & Resources

### Key Files Reference

- **Database Schema:** `docs/database_schema.md`
- **UI/UX Flow:** `docs/ui_ux_flow.md`
- **Global Styles:** `src/styles/globals.css`
- **Supabase Config:** `src/lib/supabase.js`
- **Managers:** `src/lib/v1/*Manager.js`
- **Utilities:** `src/lib/v1/formatters.js`, `src/lib/v1/addressParser.js`
- **Components:** `src/components/`

### External Dependencies

- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Lucide Icons:** https://lucide.dev
- **SweetAlert2:** https://sweetalert2.github.io

---

## Notes for Refactoring

This document focuses on **requirements and specifications** rather than implementation details. When refactoring:

1. **Preserve Functionality:** All features listed must be maintained
2. **Improve Architecture:** Can reorganize code structure, but maintain same capabilities
3. **Enhance Performance:** Optimize data fetching, reduce re-renders
4. **Modernize Stack:** Can update Next.js version, add TypeScript, etc., but maintain feature parity
5. **Improve UX:** Can enhance UI/UX, but follow design system standards
6. **Add Features:** New modules (Orders, Inventory) can be added following same patterns

The goal is to have a clean, maintainable, scalable codebase that follows the requirements and standards outlined in this document.

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-01-XX  
**Project Version:** 1.0.0.7

