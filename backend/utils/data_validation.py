import pandas as pd
import re


def validate_columns(file):
    required_columns = [
        "first-name",
        "last-name",
        "email",
        "department",
        "application-rating"
    ]

    missing_columns = []

    for column in required_columns:
        if column not in file.columns:
            missing_columns.append(column)

    return missing_columns


def validate_name(name):
    valid = True
    error_msg = ""

    if not name or not name.strip():
        valid = False 
        error_msg = "Name is required"

    if not re.match(r"^[a-zA-Z\s'-]+$", name.strip()):
        valid = False
        error_msg = "Name contains invalid characters"

    return valid, error_msg


def validate_email(email):
    valid = True
    error_msg = ""

    if not email or not email.strip():
        valid = False
        error_msg = "Email is required"

    email = email.strip()
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if not re.match(pattern, email):
        valid = False
        error_msg = "Invalid email format"

    return valid, error_msg


def validate_department(department):
    valid = True
    error_msg = ""

    departments = [
        "avionics",
        "adcs",
        "software",
        "mechanical",
        "team resources"
    ]

    if not department or not department.strip():
        valid = False
        error_msg = "Department is required"

    if department.strip() not in departments:
        valid = False
        error_msg = f"Invalid department: {department}"

    return valid, error_msg


def validate_application_rating(rating):
    valid = True
    error_msg = ""

    if rating is None or str(rating).strip() == "":
        valid = False
        error_msg = "Application rating is required"

    else:
        try:
            rating = int(rating)
        except ValueError:
            valid = False
            error_msg = "Application rating must be a number"
        else:
            if not 10 <= rating <= 30:
                valid = False
                error_msg = "Application rating must be between 10 and 30"

    return valid, error_msg


def validate_user(user):
    errors = []

    valid, error_msg = validate_name(user["first-name"])
    if not valid:
        errors.append(error_msg)

    valid, error_msg = validate_name(user["last-name"])
    if not valid:
        errors.append(error_msg)

    valid, error_msg = validate_email(user["email"])
    if not valid:
        errors.append(error_msg)

    valid, error_msg = validate_department(user["department"])
    if not valid:
        errors.append(error_msg)

    valid, error_msg = validate_application_rating(user["application-rating"])
    if not valid:
        errors.append(error_msg)

    return errors