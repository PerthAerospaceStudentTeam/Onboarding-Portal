from fastapi import FastAPI

app = FastAPI(title="Onboarding Portal API")


@app.get("/health")
def health():
    return {"status": "ok"}
