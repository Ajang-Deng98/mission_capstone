# Screenshot Guide for Assignment Submission

## Required Screenshots (Minimum 10)

### 1. **Landing Page** (Public)
**File Name**: `01_landing_page.png`
**URL**: http://localhost:3000/
**What to Show**:
- Hero section with "AidTrace South Sudan" title
- Navigation bar (About, Projects, Login buttons)
- Language toggle (EN/AR)
- Feature highlights
- Call-to-action buttons

---

### 2. **Login Page**
**File Name**: `02_login_page.png`
**URL**: http://localhost:3000/login
**What to Show**:
- Login form with username and password fields
- "Remember me" checkbox
- Login button
- Link to register page
- Clean, professional design

---

### 3. **Admin Dashboard - Overview**
**File Name**: `03_admin_dashboard.png`
**URL**: http://localhost:3000/admin
**Login**: admin / AidTrace2024!
**What to Show**:
- Sidebar navigation on the left with menu items
- User info section (admin username and role)
- 4 statistics cards:
  - Total Projects
  - Total Funding
  - Total Users
  - Organizations
- Project Status Doughnut Chart
- Monthly Funding Bar Chart
- Recent Activity table

---

### 4. **Admin - Projects Management**
**File Name**: `04_admin_projects.png`
**URL**: http://localhost:3000/admin/projects
**Login**: admin / AidTrace2024!
**What to Show**:
- Projects management table with columns:
  - Project name and organization
  - Target amount
  - Raised amount
  - Status badges (Active, Completed, Pending)
  - Action buttons (Edit, Delete)
- "Add Project" button
- Real project data (Emergency Food Distribution, Clean Water System, etc.)

---

### 5. **Admin - Users Management**
**File Name**: `05_admin_users.png`
**URL**: http://localhost:3000/admin/users
**Login**: admin / AidTrace2024!
**What to Show**:
- Users management table with columns:
  - Username with avatar
  - Email
  - Role (admin, donor, organisation, field_officer)
  - Organization
  - Status (Active)
  - Action buttons (Edit, Suspend)
- "Add User" button
- Multiple user entries

---

### 6. **Donor Dashboard - Overview**
**File Name**: `06_donor_dashboard.png`
**URL**: http://localhost:3000/donor
**Login**: donor1 / Donor2024!
**What to Show**:
- Sidebar navigation with donor-specific menu
- 3 statistics cards:
  - Total Funds
  - Active Projects
  - Verified Reports
- Funding History Line Chart (showing last 6 transactions)
- Recent Funding table with project names and amounts

---

### 7. **Donor - Browse Projects**
**File Name**: `07_donor_projects.png`
**URL**: http://localhost:3000/donor/projects
**Login**: donor1 / Donor2024!
**What to Show**:
- Grid of project cards (3 columns)
- Each card showing:
  - Project title
  - Organization name
  - Location (Juba, Bentiu, Wau, etc.)
  - Target amount
  - Current funding
  - Progress bar
  - "Fund Project" button
- Real South Sudan projects

---

### 8. **Donor - Funding Modal**
**File Name**: `08_funding_modal.png`
**URL**: http://localhost:3000/donor/projects (click "Fund Project")
**Login**: donor1 / Donor2024!
**What to Show**:
- Modal overlay with project details
- Project title and description
- Amount input field
- Blockchain verification notice
- "Submit Funding" button
- "Cancel" button

---

### 9. **Organisation Dashboard - Overview**
**File Name**: `09_organisation_dashboard.png`
**URL**: http://localhost:3000/organisation
**Login**: org1 / Org2024!
**What to Show**:
- Sidebar with organisation-specific menu
- 4 statistics cards:
  - My Projects
  - Total Received
  - Target Amount
  - Reports
- Project Funding Bar Chart
- Recent Projects grid (3 project cards)

---

### 10. **Organisation - Create Project Form**
**File Name**: `10_create_project.png`
**URL**: http://localhost:3000/organisation/create-project
**Login**: org1 / Org2024!
**What to Show**:
- Project creation form with fields:
  - Project Title
  - Target Amount
  - Location dropdown (South Sudan locations)
  - Category dropdown
  - Start Date
  - End Date
  - Description textarea
- "Create Project" button
- Clean form layout

---

### 11. **Field Officer Dashboard - Overview**
**File Name**: `11_field_officer_dashboard.png`
**URL**: http://localhost:3000/field-officer
**Login**: field1 / Field2024!
**What to Show**:
- Sidebar with field officer menu
- 4 statistics cards:
  - Total Distributions
  - Completed
  - Pending
  - Reports
- Recent Distributions list with:
  - Aid type
  - Location
  - Quantity
  - Status badges

---

### 12. **Field Officer - Distributions Table**
**File Name**: `12_distributions_table.png`
**URL**: http://localhost:3000/field-officer/distributions
**Login**: field1 / Field2024!
**What to Show**:
- Distributions management table with columns:
  - Aid Type (Food, Water, Medical)
  - Quantity and Unit
  - Location
  - Date
  - Status badges
  - Action buttons (Edit, Verify)
- "Record Distribution" button

---

### 13. **Bilingual Support - Arabic Interface**
**File Name**: `13_arabic_interface.png`
**URL**: Any dashboard page
**Login**: Any user
**What to Show**:
- Click language toggle to switch to Arabic
- Sidebar on the RIGHT side (RTL layout)
- Arabic text in menu items
- Arabic statistics labels
- Right-to-left text direction
- Demonstrates i18next integration

---

### 14. **Blockchain Verification**
**File Name**: `14_blockchain_verification.png`
**URL**: http://localhost:3000/donor/funding (or any page with blockchain hash)
**Login**: donor1 / Donor2024!
**What to Show**:
- Transaction with blockchain hash displayed
- Clickable Etherscan link
- Hash format: 0x... (64 characters)
- Verification icon or badge
- Demonstrates Sepolia testnet integration

---

## Optional Screenshots (Bonus)

### 15. **Mobile Responsive View**
**File Name**: `15_mobile_responsive.png`
**What to Show**:
- Browser DevTools open showing mobile view (375px width)
- Sidebar collapsed/hidden
- Single column layout
- Stacked statistics cards
- Demonstrates responsive design

---

### 16. **Database Schema (pgAdmin or psql)**
**File Name**: `16_database_schema.png`
**What to Show**:
- PostgreSQL database "aidtrace_ss"
- Tables list showing:
  - aidtrace_user
  - aidtrace_project
  - aidtrace_fundingtransaction
  - aidtrace_report
  - aidtrace_aiddistribution
  - aidtrace_organisation
- Demonstrates backend database structure

---

### 17. **API Endpoint (Postman or Browser)**
**File Name**: `17_api_endpoint.png`
**URL**: http://localhost:8000/api/projects/
**What to Show**:
- JSON response from API
- Project data with fields:
  - id, title, description
  - target_amount, current_funding
  - location, status
  - blockchain_hash
- Demonstrates RESTful API

---

## Screenshot Capture Instructions

### Tools to Use:
- **Windows**: Snipping Tool or Win + Shift + S
- **Mac**: Cmd + Shift + 4
- **Browser**: Full page screenshot extensions

### Best Practices:
1. **Full Window**: Capture entire browser window including URL bar
2. **High Resolution**: Use 1920x1080 or higher
3. **Clean State**: Close unnecessary tabs/windows
4. **Real Data**: Show actual project names and amounts
5. **Consistent**: Use same browser for all screenshots
6. **Annotations**: Add arrows or highlights if needed (optional)

### File Organization:
```
screenshots/
├── 01_landing_page.png
├── 02_login_page.png
├── 03_admin_dashboard.png
├── 04_admin_projects.png
├── 05_admin_users.png
├── 06_donor_dashboard.png
├── 07_donor_projects.png
├── 08_funding_modal.png
├── 09_organisation_dashboard.png
├── 10_create_project.png
├── 11_field_officer_dashboard.png
├── 12_distributions_table.png
├── 13_arabic_interface.png
├── 14_blockchain_verification.png
├── 15_mobile_responsive.png (optional)
├── 16_database_schema.png (optional)
└── 17_api_endpoint.png (optional)
```

## What Each Screenshot Demonstrates

| Screenshot | Demonstrates |
|------------|--------------|
| 01 | Frontend UI Design, Landing Page |
| 02 | Authentication Interface |
| 03 | Admin Dashboard, Charts, Role-based Access |
| 04 | Data Management, CRUD Operations |
| 05 | User Management, Role System |
| 06 | Donor Dashboard, Analytics |
| 07 | Project Browsing, Card Layout |
| 08 | Modal Design, Form Validation |
| 09 | Organisation Dashboard, Statistics |
| 10 | Form Design, Input Validation |
| 11 | Field Officer Dashboard, Distribution Tracking |
| 12 | Table Design, Data Display |
| 13 | Internationalization (i18next), RTL Support |
| 14 | Blockchain Integration, Sepolia Testnet |
| 15 | Responsive Design, Mobile-First |
| 16 | Database Schema, PostgreSQL |
| 17 | RESTful API, Backend Integration |

## Checklist Before Submission

- [ ] All 14 required screenshots captured
- [ ] Screenshots are high resolution (1920x1080+)
- [ ] File names follow naming convention
- [ ] Screenshots show real data (not placeholders)
- [ ] URL bar visible in browser screenshots
- [ ] All screenshots organized in `screenshots/` folder
- [ ] Screenshots demonstrate key features from rubric
- [ ] Arabic interface screenshot shows RTL layout
- [ ] Blockchain screenshot shows actual hash
- [ ] No sensitive information visible (passwords hidden)

## Quick Capture Sequence

1. Start backend: `python manage.py runserver`
2. Start frontend: `npm start`
3. Open browser to http://localhost:3000
4. Capture landing page (#1)
5. Navigate to login (#2)
6. Login as admin and capture (#3, #4, #5)
7. Logout, login as donor1 and capture (#6, #7, #8)
8. Logout, login as org1 and capture (#9, #10)
9. Logout, login as field1 and capture (#11, #12)
10. Switch to Arabic and capture (#13)
11. Find blockchain hash and capture (#14)
12. Open DevTools mobile view and capture (#15)
13. Open pgAdmin/psql and capture (#16)
14. Open Postman/browser API and capture (#17)

**Total Time**: ~20-30 minutes for all screenshots
