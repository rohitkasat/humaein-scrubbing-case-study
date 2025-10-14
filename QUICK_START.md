# QUICK START GUIDE

This guide provides simple instructions to get the application running in the shortest time possible.

## Prerequisites
- Docker and Docker Compose installed
  - [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
  - [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
  - [Docker Engine for Linux](https://docs.docker.com/engine/install/)

## Setup Steps

### 1. Environment Setup
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Start the Application
```bash
# Start all services
docker-compose up --build
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### 4. Login Credentials
- Email: admin@humaein.local
- Password: Admin@123

## Testing the System

### 1. Upload Claims File
- Login to the frontend
- Navigate to the Upload section
- Use the sample claims file from `/resource/091325_Humaein Recruitment_Claims File_vShared.xlsx`

### 2. View Results
- After upload, the system will process the claims
- Navigate to Results to see the validation outcomes
- Check Metrics for statistics on errors and validations

## Running Without Docker

If Docker is not available, see detailed instructions in:
- For Windows: `WINDOWS_SETUP.md`
- For all platforms: `README.md`

## Troubleshooting

### Common Issues
1. Port conflicts: Ensure ports 8000 and 5173 are not in use
2. Docker memory: Increase memory allocation in Docker settings if containers crash
3. Database errors: Check database connection string in backend/.env

For more detailed setup and troubleshooting, refer to the full documentation in README.md.