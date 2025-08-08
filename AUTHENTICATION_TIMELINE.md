# Authentication Timeline Documentation

## Overview
This document explains the complete authentication timeline and session management flow in the application.

## Authentication Timeline

### **Total Session Duration: 5 Minutes**

The authentication system is designed with a **5-minute total session duration**:

```
Login Success (0m) → Access Token Expires (2m) → Refresh Token Expires (5m) → Auto Logout
```

### **Detailed Timeline**

#### **0 Minutes: Login Success**
- User successfully logs in
- Access token issued (expires in 2 minutes)
- Refresh token issued (expires in 3 minutes)
- Session starts

#### **2 Minutes: Access Token Expires**
- Access token becomes invalid
- **Session Expiry Modal appears** with message:
  > "Your session has expired. Click 'Continue to Work' to refresh your session or 'Logout' to sign in again."
- User has **3 minutes** to respond (until refresh token expires)
- Automatic logout timer starts (3 minutes from modal appearance)

#### **5 Minutes: Refresh Token Expires**
- Refresh token becomes invalid
- **System automatically logs out user**
- User must log in again to continue

### **Configuration Constants**

#### **Server-Side** (`server/constants/index.ts`)
```typescript
JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '2m', // 2 minutes
  REFRESH_TOKEN_EXPIRY: '3m', // 3 minutes
  REFRESH_TOKEN_EXPIRY_MS: 3 * 60 * 1000, // 3 minutes
}
```

#### **Client-Side** (`client/src/constants/auth.ts`)
```typescript
AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 2 * 60 * 1000, // 2 minutes
  REFRESH_TOKEN_EXPIRY_MS: 3 * 60 * 1000, // 3 minutes (matches server-side)
  MODAL_AUTO_LOGOUT_DELAY: 3 * 60 * 1000, // 3 minutes after modal appears
}
```

### **User Scenarios**

#### **Scenario 1: User Responds to Modal (Within 3 Minutes)**
1. **0m**: Login success
2. **2m**: Access token expires → Modal appears
3. **2m-5m**: User clicks "Continue to Work"
4. **Result**: New tokens issued, session continues

#### **Scenario 2: User Ignores Modal (3 Minutes)**
1. **0m**: Login success
2. **2m**: Access token expires → Modal appears
3. **5m**: Refresh token expires → Auto logout
4. **Result**: User logged out, must login again

#### **Scenario 3: User Clicks Logout**
1. **0m**: Login success
2. **2m**: Access token expires → Modal appears
3. **User clicks "Logout"**: Immediate logout
4. **Result**: User logged out immediately

### **Key Points**

✅ **Total Session Time**: 5 minutes (2m access + 3m refresh)  
✅ **Modal Timing**: Appears at exactly 2 minutes  
✅ **Auto Logout**: Occurs at exactly 5 minutes  
✅ **User Response Window**: 3 minutes (from modal appearance)  
✅ **Consistent Configuration**: Server and client use same timing  

### **Debugging**

Use the Activity Debugger to monitor:
- **Inactivity Timer**: Shows time since last activity
- **Token Expiry**: Shows when tokens will expire
- **Progress Bar**: Visual indicator of session progress
- **Real-time Updates**: Updates every second

### **Security Benefits**

1. **Short Access Tokens**: 2 minutes reduces exposure window
2. **Limited Refresh Window**: 3 minutes prevents indefinite sessions
3. **User Control**: Users can extend session or logout immediately
4. **Automatic Cleanup**: System ensures sessions don't persist indefinitely

### **Testing the Timeline**

1. **Login** and note the time
2. **Wait 2 minutes** - Modal should appear
3. **Wait 3 more minutes** - System should auto-logout
4. **Total time**: 5 minutes from login to auto-logout

This timeline ensures secure, predictable session management with clear user feedback and automatic cleanup.
