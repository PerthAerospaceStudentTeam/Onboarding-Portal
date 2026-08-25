## Auth Providers 
- EntraID 
- Superbase Auth
- OAuth (Generic Google/Github)

### Current existing stack to consider 
- **Frontend:** React 
- **Backend:** FastAPI 
- **DBs:** Superbase 
- **Infrastructure:** Azure account cloud set up 
- **File/Storage:** Storage through sharepoint / GraphAPI in backend 

### EntraID (Microsoft's full cloud enterprise indentity system) 
-**Pros**
- Easy management for a large amount of users 
- Free tier covers up to 50000 monthly active users
- With the free azure credits, EntraID app registration would live inside the same tenant and not a new platform 
- SharePoint/GraphAPI backend access can be used with the EntraID auth (only need one microsoft login for the users)
- EntraID has native role support to reflect PAST team structure and role/permission access 
- Sign up friction will be low as most students will have a microsoft account 

-**Cons**
- May have a lot of set up steps (ie.Register app, redirect URLs for auth, OpenID Connect configuration on FastAPI backend)

### Superbase Auth 

-**Pros**
- Free tier covers the amount of recruits/students we expect to be managing (50000 montly active users and up to 2 active projects) 
- Superbase Auth lives on top of our existing Superbase database so sessions issued at login, custom fields can be attached to the token via Custom Access Token Auth Hook then checked directly by DB security policies (Clean architecture)

-**Cons**
- Free tier projects get automatically paused after 7 days of inactivity (So, potentially during semester breaks when there is no one logging in, the whole Superbase project, DBs and Auth, would pause and go offline until someone manually resumes it)
- Does not handle SharePoint/GraphAPI access for backend

### OAuth 
- **Pros** 
- Fast set up, well-documented, minimal cost ()
- Sign-up friction will likely be low as most students may already have a github account (or google)

- **Cons** 
- A new standalone system without any ties to current existing infra or hosting platform / database 
- Would still need another microsoft registration so we would still be managing both identity concerns 

### Comparison Summary 

- Entra ID comes out ahead once auth is considered alongside our full stack, not in isolation.
- Supabase Auth integrates cleanly with our existing database and Generic OAuth is the fastest to set up, but both of these options leave us needing a separate Microsoft app registration for SharePoint/Graph API file access (ie. we will end up running two or three disconnected identity systems instead of one) 
- Entra ID avoids this by letting a single app registration handle both user login and Graph API access, and since our infrastructure already runs on a Microsoft Azure student account with free credits, it reuses infrastructure we've already committed to rather than adding a new platform 
- Entra ID gives us the lowest overall system complexity




