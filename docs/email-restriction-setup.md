# Email Restriction Setup for Auth0

To restrict login to only `@students.au.edu.pk` emails, you need to add an Auth0 Action:

## Steps to Add Email Restriction

1. **Go to Auth0 Dashboard** → [https://manage.auth0.com](https://manage.auth0.com)

2. **Navigate to**: Actions → Library → Build Custom

3. **Create a new Action**:
   - **Name**: `Restrict to AU Students`
   - **Trigger**: `Login / Post Login`
   - **Runtime**: Node 18

4. **Paste this code**:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const allowedDomain = 'students.au.edu.pk';
  const email = event.user.email;
  
  if (!email) {
    api.access.deny('Email is required to login.');
    return;
  }
  
  const emailDomain = email.split('@')[1];
  
  if (emailDomain !== allowedDomain) {
    api.access.deny(`Access denied. Only @${allowedDomain} emails are allowed.`);
    return;
  }
};
```

5. **Click Deploy** to save the Action

6. **Add to Login Flow**:
   - Go to Actions → Flows → Login
   - Drag "Restrict to AU Students" from the right panel to the flow
   - Click Apply

## Testing

- Login with `@students.au.edu.pk` email → ✅ Allowed
- Login with any other email → ❌ Blocked with message

## Alternative: Allow Multiple Domains

If you also want to allow faculty emails (`@au.edu.pk`):

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const allowedDomains = ['students.au.edu.pk', 'au.edu.pk'];
  const email = event.user.email;
  
  if (!email) {
    api.access.deny('Email is required to login.');
    return;
  }
  
  const emailDomain = email.split('@')[1];
  
  if (!allowedDomains.includes(emailDomain)) {
    api.access.deny('Access denied. Only Air University emails are allowed.');
    return;
  }
};
```
