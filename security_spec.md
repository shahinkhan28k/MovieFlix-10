# Firestore Security Specification - MovieFlix

This document defines the security boundaries, data invariants, and authorization rules for the MovieFlix database.

## 1. Data Invariants

### Movies Collection (`/movies/{movieId}`)
- **Read Access**: Public read access is allowed to enable browsing the stream catalog on mount.
- **Write Access**: Restricted exclusively to verified admin users (specifically `djskshahin544@gmail.com`).
- **Required Fields**: `id`, `title`, `description`, `thumbnail`, `videoUrl`, `category`, `year`, `duration`, `rating`, `views`, `likes`, `createdAt`.

### Users Collection (`/users/{userId}`)
- **Read & Write Access**: Owner-only. A user can only read or write their own user profile document (`request.auth.uid == userId`).
- **Fields**: `favorites` (array of movie IDs), `watchHistory` (array of movie history tracking objects).

---

## 2. The "Dirty Dozen" Malicious Payloads (Vulnerability Targets)

1. **Anonymous Write to Movies**: Try to create a movie document without being logged in.
2. **Standard User Write to Movies**: Try to create a movie document as a logged-in non-admin user.
3. **Admin Role Spoofing**: Attempt to write/update movie data with a custom claim or parameter.
4. **Invalid Movie ID Injection**: Attempt to create a movie with a massive 1MB string or invalid characters in the document ID.
5. **No-Title Movie Creation**: Attempt to create a movie document with missing required fields (e.g. no title).
6. **Cross-User Profile Read**: Attempt to read the user preferences of a different user.
7. **Cross-User Profile Write**: Attempt to edit the user preferences of a different user.
8. **Malicious Array Injection**: Attempt to insert high-byte, non-string items into a user's `favorites` array.
9. **State Bypass / Shadow Fields**: Attempt to add arbitrary unmapped properties to user documents or movie documents.
10. **Privilege Escalation**: Attempting to set an `isAdmin` or `role` flag on user profile to bypass checks.
11. **Future Timestamps**: Attempting to set `createdAt` or `updatedAt` to a future date instead of the server's request time.
12. **Tampering with Views/Likes**: Standard user trying to directly edit views/likes count of a movie to artificially boost its ranking.

---

## 3. Authorization Blueprint

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Global Safety Net
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
