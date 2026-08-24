import pandas as pd
import re

def standardise_user(user):
    user["first-name"] = str(user["first-name"]).strip().title()
    user["last-name"] = str(user["last-name"]).strip().title()
    user["email"] = str(user["email"]).strip().lower()
    user["department"] = str(user["department"]).strip().lower()

    return user


def validate_columns(file):
    required_columns = [
        "first-name",
        "last-name",
        "email",
        "department",
        "onboarding-score"
    ]

    missing_columns = []

    for column in required_columns:
        if column not in file.columns:
            missing_columns.append(column)

    return missing_columns


def validate_name(name):
    valid = True
    error_msg = ""

    if not name:
        valid = False 
        error_msg = "Name is required"

    if not re.match(r"^[a-zA-Z\s'-]+$", name):
        valid = False
        error_msg = "Name contains invalid characters"

    return valid, error_msg


def validate_email(email):
    valid = True
    error_msg = ""

    if not email:
        valid = False
        error_msg = "Email is required"

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

    if not department:
        valid = False
        error_msg = "Department is required"

    if department not in departments:
        valid = False
        error_msg = f"Invalid department: {department}"

    return valid, error_msg


def validate_onboarding_score(score):
    valid = True
    error_msg = ""

    if score is None or str(score).strip() == "":
        valid = False
        error_msg = "Onboarding score is required"

    else:
        try:
            score = int(score)
        except ValueError:
            valid = False
            error_msg = "Onboarding score must be a number"
        else:
            if not 10 <= score <= 30:
                valid = False
                error_msg = "Onboarding score must be between 10 and 30"

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

    valid, error_msg = validate_onboarding_score(user["onboarding-score"])
    if not valid:
        errors.append(error_msg)

    return errors