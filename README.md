# Veer Mahadev Plastic - Complete B2B Wholesale Platform

## Overview

Veer Mahadev Plastic is a comprehensive B2B wholesale platform for disposable products and catering essentials in Ahmedabad.

## Features

- **Product Catalog**: Comprehensive wholesale products database
- **Admin Dashboard**: Real-time inventory and order management
- **Payment Integration**: PhonePe & UPI secure payments
- **Firebase Integration**: Realtime database and authentication
- **Responsive Design**: Mobile-first web application
- **PWA Support**: Progressive Web App functionality

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Python FastAPI, Flask
- **Database**: Firebase Firestore
- **Payment**: PhonePe API
- **Authentication**: Firebase Auth, Custom OTP

## Installation

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

Simply serve the frontend files using any HTTP server:

```bash
python -m http.server 8000
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials.

## API Endpoints

- `GET /api/dashboard/business-pulse` - Daily sales metrics
- `GET /api/dashboard/order-status` - Order statistics
- `GET /api/dashboard/stock-insights` - Inventory insights
- `POST /api/orders` - Create new order

## License

Proprietary © Veer Mahadev Plastic