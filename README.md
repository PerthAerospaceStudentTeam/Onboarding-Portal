# Onboarding Portal

Application used to track and facilitate Perth Aerospace Student Team's recruitment pipeline (**Onboarding**).

## Project overview

Onboarding has two views:

- **Recruits** — candidates can see what stage they are in, their action items, helpful information, and more.
- **Team Development** — each candidate has a profile with their information, stage, contact details, and related pipeline data so TD members can track and manage recruitment.

## Layout

```
frontend/   React (Vite) SPA
backend/    FastAPI API
infra/      Infrastructure as code (later)
```

## Conventions

### Branches

```
type/number/description
```

Examples:

- `feat/2/base-structure`
- `fix/16/eoi-validation`
- `chore/4/branch-protection`

Use the GitHub issue number for `number`. Keep `description` short and kebab-case.

Common `type` values: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `merge`.

### Commits

```
type(ticket-number): description of changes
```

Examples:

- `feat(2): add frontend/backend base structure and scaffolds`
- `fix(16): reject empty EOI submissions`
- `docs(5): expand README with overview and conventions`

One logical change per commit. Do not add AI co-author trailers.

### Pull requests

- **Title:** same shape as commits — `type(ticket-number): short summary`
- **Base branch:** `development` (not `main`)
- **Body:** include Summary, Test plan, and link related issues (`Closes #N` / `Related: #N`)

Example title: `feat(2): add frontend/backend base structure and scaffolds`

## Local setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

Health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
