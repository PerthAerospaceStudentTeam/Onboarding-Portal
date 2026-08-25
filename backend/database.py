from supabase import Client, create_client

from config import get_settings

settings = get_settings()
settings.require_supabase()

assert settings.supabase_url is not None
assert settings.supabase_service_role_key is not None

supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
)