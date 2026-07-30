## Roles 

- **Candidate** - personal student dashboard access only, view/edit own application & documents
- **Recruiter** - view/manage the admin panel dashboard, view/manage recruited student account details, send emails, move recruitment stage pipelines
- **Admin** - everything the recruiter (team dev admin) has access to, manage users/roles, system settings 

## Permissions

### Candidate 
- View your own dashboard 
- View/edit own application and documents 
- No access to other candidates details, accounts or admin panel, recruiter tools 

### Recruiter or team dev admin 
- Access to all candidates account details
- Move all candidates through recruitment pipeline stages 
- No access to user / role management or system settings 

### Admin 
- Access to all the things a normal team dev admin has access to 
- Edit / delete any candidate record 
- Manage user account, roles
- Access system settings 

## Auth flow based on the role and permissions 
1. User selects the role on the portal (UX orientation only and does not actually grant the dashboard access for the chosen role yet)
2. User is redirected to a login page (whichever hosted Auth provider's page) to authenticate
3. Auth system will verify credentials from the user and return a signed token containing the user's actual role saved in the dbs 
4. Backend will validates if the token is genuine, and if the role in the token matches the route that user accessed 
5. On success, redirect to the role-based dashboard 
6. If the token role does not match the selected role, reject and redirect back with appropriate message 

## Notes 
- Roles selected at login is UI only so Authentication is done separately to grant access 
- Role is stored in auth token/session after login(not just local state)
- Route guards per role 
- Role / permission check must happen server-side on every API call 
- Split API endpoints or middleware by role scope, e.g.:
- `/api/candidate/*` — candidate-only, scoped to own user ID
- `/api/recruiter/*` — recruiter + admin
- `/api/admin/*` — admin only
- New candidate accounts need a role assigned in Authentication provider when their accounts are created (automatic / manual? -> Candidate role can be automatic but manual for admin roles)