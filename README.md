# AidTrace South Sudan / تتبع المساعدات جنوب السودان

##  Project Description

AidTrace South Sudan is a full-stack web application designed to bring transparency and accountability to humanitarian aid distribution in South Sudan. The platform leverages blockchain technology (Ethereum Sepolia Testnet) to create an immutable record of all aid transactions, ensuring donors can track their contributions and beneficiaries receive verified assistance.

### Key Features
- **Blockchain Verification**: Every transaction is cryptographically hashed and stored on Ethereum Sepolia testnet
- **Bilingual Support**: Full English/Arabic interface with RTL layout support
- **Role-Based Access**: Four distinct user roles (Admin, Donor, Organisation, Field Officer)
- **Real-Time Analytics**: Interactive charts and dashboards for data visualization
- **Offline Capability**: IndexedDB integration for offline data access
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Problem Statement
Humanitarian aid in South Sudan faces challenges with transparency, accountability, and tracking. Donors lack visibility into how their funds are used, and organizations struggle with efficient reporting. AidTrace solves this by providing a transparent, blockchain-verified platform for aid tracking.

##  Project Lifecycle & Communication Flow

### Step-by-Step Workflow

#### 1. **Organisation Creates Project**
- Organisation (org1) logs in and creates a new project
- Project status is automatically set to **"pending"**
- Project is NOT visible to donors yet
- Organisation sees project with "Pending Approval" badge

#### 2. **Admin Reviews & Approves**
- Admin logs in and views all projects in Projects Management
- Admin reviews pending projects
- Admin clicks "Approve" button
- Project status changes to **"active"**
- Project is now visible to donors

#### 3. **Donor Funds Project**
- Donor logs in and browses projects
- Donor ONLY sees projects with status **"active"** or **"approved"**
- Donor clicks "Fund Project" and submits funding
- FundingTransaction is created with blockchain hash
- Project's `current_funding` field is updated

#### 4. **Organisation Sees Funding**
- Organisation dashboard automatically updates
- "Total Received Funding" statistic increases
- Project card shows updated funding amount
- Progress bar reflects new percentage
- Organisation can view funding details in reports

#### 5. **Field Officer Records Distribution**
- Field Officer (linked to the organisation) logs in
- Field Officer can see projects from their organisation
- Field Officer records aid distribution for funded projects
- Distribution is linked to the project
- Organisation can view distributions in their dashboard

### Status Flow Diagram

```
Organisation Creates Project
         ↓
    [PENDING] ← Visible only to Organisation & Admin
         ↓
    Admin Reviews
         ↓
    ┌────┴────┐
    ↓         ↓
[APPROVED] [REJECTED]
    ↓         ↓
[ACTIVE]   [CANCELLED]
    ↓
Visible to Donors
    ↓
Donor Funds
    ↓
Funding Updates
    ↓
Organisation Sees Funding
    ↓
Field Officer Distributes
    ↓
[COMPLETED]
```

### Key Rules

1. **Pending Projects**: Only visible to the creating organisation and admins
2. **Active Projects**: Visible to all donors for funding
3. **Funding Updates**: Real-time reflection in organisation dashboard
4. **Field Officers**: Can only work on projects from their assigned organisation
5. **Blockchain**: Every transaction (funding, distribution, report) gets a blockchain hash

### Example Scenario

**Day 1 - 9:00 AM**: World Food Programme (org1) creates "Emergency Food Distribution - Juba" project for $250,000. Status: **Pending**

**Day 1 - 10:00 AM**: Admin reviews and approves the project. Status: **Active**

**Day 1 - 2:00 PM**: Donor1 sees the project, funds $50,000. Organisation sees funding update immediately.

**Day 2 - 9:00 AM**: Donor2 funds $30,000. Total funding now $80,000. Organisation dashboard shows 32% funded.

**Day 3 - 10:00 AM**: Field Officer records distribution of 500 bags of food to 250 families in Juba.

**Day 4 - 3:00 PM**: Organisation submits progress report. All stakeholders can view the report.

### Communication Matrix

| Action | Organisation Sees | Admin Sees | Donor Sees | Field Officer Sees |
|--------|------------------|------------|------------|--------------------|
| Project Created (Pending) | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Project Approved (Active) | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (own org) |
| Funding Received | ✅ Yes (immediate) | ✅ Yes | ✅ Yes (own funding) | ✅ Yes (own org) |
| Distribution Recorded | ✅ Yes | ✅ Yes | ✅ Yes (in reports) | ✅ Yes (own records) |
| Report Submitted | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (own org) |

##  GitHub Repository

**Repository URL**: [https://github.com/Ajang-Deng98/mission_capstone.git]

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Styling**: TailwindCSS 3.3.0
- **State Management**: React Query 3.39.3
- **Routing**: React Router DOM 6.20.0
- **Charts**: Chart.js 4.4.0 with react-chartjs-2
- **Internationalization**: i18next 23.7.6
- **Offline Storage**: Dexie.js (IndexedDB wrapper)

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (djangorestframework-simplejwt 5.3.0)
- **Blockchain**: Web3.py 5.31.4
- **CORS**: django-cors-headers 4.3.1

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: 0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8
- **Provider**: Infura
- **Explorer**: https://sepolia.etherscan.io/

### Database
- **Type**: PostgreSQL
- **Name**: aidtrace_ss
- **Models**: User, Organisation, Project, FundingTransaction, Report, VerificationRecord, AuditLog, AidDistribution

##  Environment Setup & Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/Ajang-Deng98/mission_capstone.git
cd AidTrace_South_Sudan
```

### Step 2: Database Setup
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE aidtrace_ss;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE aidtrace_ss TO postgres;

# Exit PostgreSQL
\q
```

### Step 3: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Initialize database with sample data
python init_db.py
python create_sample_data.py

# Start Django development server
python manage.py runserver
```

Backend will run on: **http://localhost:8000**

### Step 4: Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will run on: **http://localhost:3000**

##  User Accounts & Credentials


##  Database Schema

### Core Models

#### User Model
```python
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- role (admin, donor, organisation, field_officer)
- organisation_id (Foreign Key)
- is_active (Boolean)
- date_joined (DateTime)
```

#### Project Model
```python
- id (Primary Key)
- title (String)
- description (Text)
- organisation_id (Foreign Key)
- target_amount (Decimal)
- current_funding (Decimal)
- location (String)
- status (pending, active, completed, cancelled)
- start_date (Date)
- end_date (Date)
- blockchain_hash (String)
- created_at (DateTime)
```

#### Funding Transaction Model
```python
- id (Primary Key)
- project_id (Foreign Key)
- donor_id (Foreign Key)
- amount (Decimal)
- transaction_date (DateTime)
- blockchain_hash (String)
- verification_status (Boolean)
```

#### Report Model
```python
- id (Primary Key)
- project_id (Foreign Key)
- submitted_by (Foreign Key)
- title (String)
- content (Text)
- type (progress, financial, field)
- blockchain_hash (String)
- created_at (DateTime)
```

#### AidDistribution Model
```python
- id (Primary Key)
- project_id (Foreign Key)
- field_officer_id (Foreign Key)
- aid_type (String)
- quantity (Integer)
- unit (String)
- location (String)
- beneficiaries (Integer)
- distribution_date (Date)
- status (pending, in_progress, completed)
- blockchain_hash (String)
```

##  Design & User Interface

### Design Principles
- **Accessibility First**: WCAG 2.1 compliant with proper contrast ratios
- **Mobile Responsive**: Breakpoints at 640px, 768px, 1024px, 1280px
- **Bilingual Support**: Seamless English/Arabic switching with RTL layout
- **Consistent Branding**: Primary color (#2563EB), Secondary color (#10B981)

### Key Screens

#### 1. Landing Page
- Hero section with call-to-action
- Feature highlights
- Statistics overview
- Organization partners

#### 2. Login/Register
- Form validation
- Role-based authentication
- Password strength indicator
- Error handling

#### 3. Admin Dashboard
- User management table
- Project approval workflow
- System analytics with charts
- Blockchain verification logs

#### 4. Donor Dashboard
- Browse active projects
- Funding history with charts
- Transaction verification
- Impact reports

#### 5. Organisation Dashboard
- Project creation form
- Funding progress tracking
- Report submission
- Distribution management

#### 6. Field Officer Dashboard
- Distribution recording form
- Field report submission
- Beneficiary tracking
- GPS location tagging

### Color Palette
```css
Primary Blue: #2563EB
Primary Hover: #1D4ED8
Secondary Green: #10B981
Warning Yellow: #F59E0B
Error Red: #EF4444
Gray Scale: #F9FAFB to #111827
```

##  API Endpoints

### Authentication
```
POST /api/auth/register/          - User registration
POST /api/auth/login/             - User login (returns JWT)
POST /api/auth/token/refresh/     - Refresh JWT token
POST /api/auth/logout/            - User logout
```

### Projects
```
GET    /api/projects/             - List all projects
POST   /api/projects/             - Create new project
GET    /api/projects/{id}/        - Get project details
PUT    /api/projects/{id}/        - Update project
DELETE /api/projects/{id}/        - Delete project
```

### Funding
```
GET  /api/funding/                - List funding transactions
POST /api/funding/                - Create funding transaction
GET  /api/funding/history/        - Get user funding history
```

### Reports
```
GET  /api/reports/                - List reports
POST /api/reports/                - Submit report
GET  /api/reports/{id}/           - Get report details
```

### Distributions
```
GET  /api/distributions/          - List distributions
POST /api/distributions/          - Record distribution
GET  /api/distributions/{id}/     - Get distribution details
```

### Blockchain
```
POST /api/blockchain/verify/      - Verify blockchain hash
GET  /api/blockchain/transaction/{hash}/ - Get transaction details
```

### Dashboard
```
GET /api/dashboard/stats/         - Get dashboard statistics
GET /api/dashboard/analytics/     - Get analytics data
```

##  Blockchain Integration

### How It Works
1. **Transaction Creation**: When a funding transaction or report is created, the system generates a cryptographic hash
2. **Blockchain Storage**: Hash is stored on Ethereum Sepolia testnet via Web3.py
3. **Verification**: Users can verify any transaction on Etherscan using the blockchain hash
4. **Immutability**: Once recorded, transactions cannot be altered or deleted

### Smart Contract
- **Address**: 0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8
- **Network**: Sepolia Testnet
- **Function**: Stores SHA-256 hashes of transactions
- **Verification**: https://sepolia.etherscan.io/address/0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8

### Example Verification
```python
# Generate hash
transaction_data = f"{project_id}{donor_id}{amount}{timestamp}"
blockchain_hash = hashlib.sha256(transaction_data.encode()).hexdigest()

# Store on blockchain
tx_hash = contract.functions.storeHash(blockchain_hash).transact()

# Verify on Etherscan
https://sepolia.etherscan.io/tx/{tx_hash}
```

##  Real Data Examples

### Organizations
- World Food Programme South Sudan
- South Sudan Red Cross
- Ministry of Humanitarian Affairs

### Projects
1. **Emergency Food Distribution - Juba**
   - Target: $250,000
   - Location: Juba, Central Equatoria
   - Status: Active
   - Beneficiaries: 5,000 families

2. **Clean Water System - Bentiu**
   - Target: $180,000
   - Location: Bentiu, Unity State
   - Status: Active
   - Beneficiaries: 3,500 people

3. **School Rehabilitation - Wau**
   - Target: $120,000
   - Location: Wau, Western Bahr el Ghazal
   - Status: In Progress
   - Beneficiaries: 800 students

##  Deployment Plan

### Current Environment
- **Development**: Local (localhost:3000 frontend, localhost:8000 backend) but should change to Netlify and Render
- **Database**: PostgreSQL local instance
- **Blockchain**: Sepolia Testnet 

### Production Deployment Strategy

#### Phase 1: Cloud Infrastructure Setup
**Backend Deployment (Render)**
1. Create account at https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Configure build settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn backend.wsgi:application`
5. Add environment variables (DATABASE_URL, SECRET_KEY, etc.)
6. Deploy automatically on git push

**Frontend Deployment (Netlify)**
1. Create account at https://netlify.com
2. Connect GitHub repository
3. Configure build settings:
   - Base Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `frontend/build`
4. Add environment variables (REACT_APP_API_URL, etc.)
5. Deploy automatically on git push

#### Phase 2: Database Migration
```bash
# Export local data
pg_dump -U postgres aidtrace_ss > backup.sql

# Import to production
psql -U production_user -h production_host -d aidtrace_ss < backup.sql
```

#### Phase 3: Environment Variables
```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/aidtrace_ss
SECRET_KEY=your-secret-key
BLOCKCHAIN_PRIVATE_KEY=your-private-key
INFURA_URL=https://sepolia.infura.io/v3/your-project-id
ALLOWED_HOSTS=yourdomain.com

# Frontend (.env)
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_BLOCKCHAIN_CONTRACT=0x742d35Cc6634C0532925a3b8D404d3aAB7C906C8
```

#### Phase 4: Domain & SSL
- Register domain: aidtrace-ss.org
- Configure DNS records
- Enable SSL/TLS certificates (Let's Encrypt)
- Setup CDN (CloudFlare)


### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrated and backed up
- [ ] Static files collected and served via CDN
- [ ] SSL certificates installed
- [ ] CORS settings updated for production domain
- [ ] Blockchain connection verified
- [ ] API rate limiting enabled
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented
- [ ] Security audit completed

##  Security Features

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: Django ORM parameterized queries
- **XSS Protection**: React's built-in escaping
- **CSRF Protection**: Django CSRF middleware
- **Rate Limiting**: API throttling (100 requests/hour per user)
- **Blockchain Verification**: Immutable transaction records

##  Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing
Use Postman collection or curl:
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \


# Get projects
curl -X GET http://localhost:8000/api/projects/ \

```

##  Screenshots

### Landing Page
![Landing Page](screenshots/home_page.png)

### Donor Dashboard
![Donor Dashboard](screenshots/donor_page.png)

### Organisation Dashboard
![Organisation Dashboard](screenshots/ngo_page.png)

### Field Officer Dashboard
![Field Officer Dashboard](screenshots/fieldofficer_page.png)

### Project Details
![Project Details](screenshots/projecdetail_page.png)



##  Video Demonstration

**Video Link**: [AidTrace South Sudan Demo](https://youtu.be/HUUlCpHv1zI)

**Duration**: 9 minutes


##  Developer Information

**Developer**: Ajang Deng
**Institution**: ALU
**Course**: Capstone Project

##  License

This project is developed for educational purposes as part of a capstone project.

##  Acknowledgments

- South Sudan humanitarian organizations for real-world context
- Ethereum Foundation for blockchain infrastructure
- Open-source community for frameworks and libraries

---

Thank You.
