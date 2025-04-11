from fastapi import FastAPI, HTTPException, Depends, Form, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()
app = FastAPI(title="Dylexia No More", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["user_db"]
users = db["users"]
print("MONGO_URI =", os.getenv("MONGO_URI"))

# Models
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    dob: str
    profile_photo: str = ""
    language: str = ""
    about: str = ""

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateUserRequest(BaseModel):
    name: str = None
    phone: str = None
    dob: str = None
    profile_photo: str = None
    language: str = None
    about: str = None

@app.get("/")
def home():
    return {"message": "Server is running"}

@app.post("/signup")
def signup(data: SignupRequest):
    if users.find_one({"email": data.email}):
        raise HTTPException(status_code=409, detail="User already exists")
    
    hashed_pw = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())

    user = {
        "name": data.name,
        "email": data.email,
        "password": hashed_pw,
        "phone": data.phone,
        "dob": data.dob,
        "profile_photo": data.profile_photo,
        "language": data.language,
        "about": data.about,
        "created_at": datetime.utcnow()
    }

    result = users.insert_one(user)
    return {
        "message": "User created",
        "id": str(result.inserted_id)
    }

@app.post("/login")
def login(data: LoginRequest):
    user = users.find_one({"email": data.email})
    if not user or not bcrypt.checkpw(data.password.encode('utf-8'), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user_id": str(user["_id"])  
    }

@app.get("/profile")
def get_profile(user_id: str = Query(..., description="User ID from MongoDB")):
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.pop("password")  # Don't expose password hash
    user["id"] = str(user.pop("_id"))
    return user

@app.put("/update_profile")
def update_profile(user_id: str = Query(..., description="User ID to update"), data: UpdateUserRequest = Body(...)):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    result = users.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}

@app.delete("/delete_user")
def delete_user(user_id: str = Query(...)):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = users.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}

@app.get("/users")
def get_all_users():
    all_users = []
    for user in users.find():
        user.pop("password", None)
        user["id"] = str(user.pop("_id"))
        all_users.append(user)
    return all_users
