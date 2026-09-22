from database import supabase
from utils import data_validation as dv
import pandas as pd


def parse_file(file):
    if file.filename.endswith(".csv"):
        return pd.read_csv(file.file)
    elif file.filename.endswith(".xlsx"):
        return pd.read_excel(file.file)
    else:
        raise ValueError("Unsupported file type")


def standardise_user(user):
    user["first_name"] = str(user["first_name"]).strip().title()
    user["last_name"] = str(user["last_name"]).strip().title()
    user["email"] = str(user["email"]).strip().lower()
    user["department"] = str(user["department"]).strip().lower()

    return user


def insert_user(user):
    response = (
        supabase
        .table("users")
        .insert({
            "first_name": user["first_name"],
            "last_name": user["last_name"]
        })
        .execute()
    )

    return response.data[0]["id"] # type: ignore


def insert_candidate(user_id, user):
    response = (
        supabase
        .table("candidates")
        .insert({
            "user_id": user_id,
            "email": user["email"]
        })
        .execute()
    )

    return response.data[0]["id"] # type: ignore


def insert_internal_data(candidate_id, user):
    supabase.table("internal_candidate_data").insert({
        "candidate_id": candidate_id,
        "onboarding_score": user["onboarding_score"]
    }).execute()


def insert_application(candidate_id, user):
    supabase.table("applications").insert({
        "candidate_id": candidate_id,
        "department": user["department"]
    }).execute()


async def import_users_from_file(file):
    # Parse file
    content_dataframe = parse_file(file)


    # Validate file format
    missing_columns = dv.validate_columns(content_dataframe)

    if missing_columns:
        return {
            "success": False,
            "errors": [
                f"File is missing columns: {column}"
                for column in missing_columns
            ],
            "imported": 0
        }


    # Get existing emails
    response = (
        supabase
        .table("candidates")
        .select("email")
        .execute()
    )

    existing_emails = [
        user["email"].strip().lower() # type: ignore
        for user in response.data
    ]

    imported_emails = []
    errors = []
    num_imported_users = 0


    # Validate and import users
    for row_number, (_, new_user) in enumerate(
        content_dataframe.iterrows(),
        start=1
    ):

        new_user = standardise_user(new_user)
        user_errors = dv.validate_user(new_user)

        user_is_valid = True

        if user_errors:
            user_is_valid = False
            errors.append(
                f"Row {row_number}: {'; '.join(user_errors)}"
            )

        elif new_user["email"] in existing_emails:
            user_is_valid = False
            errors.append(
                f"Row {row_number}: Email already exists in database"
            )

        elif new_user["email"] in imported_emails:
            user_is_valid = False
            errors.append(
                f"Row {row_number}: Duplicate email in file -> "
                f"{new_user['email']}"
            )

        if user_is_valid:
            try:
                # 'users' table
                user_id = insert_user(new_user)

                # 'candidates' table
                candidate_id = insert_candidate(user_id, new_user)

                # 'internal_candidate_data' table
                insert_internal_data(candidate_id, new_user)

                # 'applications' table
                insert_application(candidate_id, new_user)

                imported_emails.append(new_user["email"])
                num_imported_users += 1

            except Exception as insertion_error:
                errors.append(
                    f"Row {row_number}: Database error: "
                    f"{insertion_error}"
                )

    # Report message
    return {
        "success": len(errors) == 0,
        "errors": errors,
        "imported": num_imported_users
    }