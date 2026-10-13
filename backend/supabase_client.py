from supabase import create_client, Client
from config import get_settings

settings = get_settings()

# Validate that Supabase credentials exist before creating the client
settings.require_supabase()

# Initialize Supabase client using service role key or anon key
supabase: Client = create_client(
    supabase_url=settings.supabase_url, # type: ignore
    supabase_key=settings.supabase_service_role_key, # type: ignore
)