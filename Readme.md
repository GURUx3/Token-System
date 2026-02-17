# Token System Overhaul

A premium, minimal enterprise Helpdesk Ticket System featuring a strict "no-radius" design aesthetic, dual-role portals (User/Admin), and a Python Flask backend.

## ✨ Features

- **Premium Black Theme**: High-contrast, professional dark interface.
- **Strict Minimal UI**: 0px border radius, no shadows, micro-borders.
- **Role-Based Access**:
  - **User Portal**: Raise tickets, view status, comment.
  - **Admin Portal**: Manage queue, assign agents, internal notes, status updates.
- **Real-time Updates**: Immediate UI reflection of status changes.
- **Backend**: Python Flask with SQLite database.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons.
- **Backend**: Python 3.11+, Flask, SQLAlchemy, SQLite.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Backend Setup (Python)

The backend runs on port `5000`.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (Git Bash/Powershell):
./venv/Scripts/activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (Creates 4 users and 15 mock tickets)
python seed.py

# Run the server
python app.py
```

### 2. Frontend Setup (Node.js)

The frontend runs on port `3000`.

```bash
cd token-flow-ui-design

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 3. Login

Visit `http://localhost:3000`. You will be redirected to the login page.

**Default Credentials (from seed data):**

| Role | Name | Email |
|------|------|-------|
| **User** | Alice Employee | `alice@corp.com` |
| **User** | Bob Engineer | `bob@corp.com` |
| **Admin** | Charlie Admin | `charlie@corp.com` |
| **Admin** | Diana Admin | `diana@corp.com` |

*Note: The prototype login allows selecting a role to auto-login as a demo user of that type.*

## 📂 Project Structure

- `backend/`: Flask API, Models (`models.py`), Seed Script (`seed.py`).
- `token-flow-ui-design/`: Next.js Frontend.
  - `app/`: App Router pages.
  - `components/`: Reusable UI components.
  - `lib/api.ts`: API integration layer.
  - `types/`: TypeScript interfaces.

## 🎨 UI Guidelines

- **Radius**: ALWAYS 0px.
- **Shadows**: None. Use `border` for separation.
- **Colors**: Black (`#000000`) and White (`#ffffff`) only. Accent with Zinc Grays.