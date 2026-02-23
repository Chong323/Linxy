from fastapi import FastAPI

app = FastAPI(title="Linxy API")

@app.get("/")
async def root():
    return {"message": "Welcome to Linxy API - The Digital Bridge"}

