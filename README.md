# Humaein — Mini RCM Validation Engine

A minimal full‑stack RCM claims validator with:
- Secure login
- File upload (Excel)
- Static and LLM validations using Technical + Medical rules
- Results dashboard (table + waterfall), metrics and admin rules view
- Dockerized deployment


## Backend Table Design

The master table (`claims`) serves as both the raw and refined table. The `stage` field indicates whether a claim is 'raw' (uploaded, not validated) or 'refined' (validated/processed). No separate table is used for refined claims; all claims are tracked in a single table with their validation status and stage.

## Quick start (5 minutes)

Prereqs: Docker + Docker Compose.

1) Copy env templates
- backend/.env.example -> backend/.env
- frontend/.env.example -> frontend/.env

2) Set secrets (backend/.env)
```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/rcm
JWT_SECRET=replace_with_long_random
JWT_EXPIRE_MIN=120
LLM_PROVIDER=openai
OPENAI_API_KEY=replace_me
STATIC_RULES_SOURCE=files
```

3) Frontend env (frontend/.env)
```
VITE_API_BASE=http://localhost:8000
```

4) Run
```
docker-compose up --build
```
- API: http://localhost:8000 (docs at /docs)
- FE: http://localhost:5173

Default admin seed:
- email: admin@humaein.local
- password: Admin@123

To customize admin credentials for local/dev, set in `backend/.env`:
```
ADMIN_EMAIL=your_admin@example.com
ADMIN_PASSWORD=YourSecurePass123!
```
These map to `settings.ADMIN_EMAIL` and `settings.ADMIN_PASSWORD`.

## Windows Setup
See WINDOWS_SETUP.md for detailed instructions.

## License
MIT
