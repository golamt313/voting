const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addUserToFirestore = functions.auth.user().onCreate((user) => {
  // Existing user creation logic
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    role: 'user', // Default role
    credits: 0, // Default credits
    // Add other default fields as necessary
  });
});

exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
    // Ensure the function is called by an authenticated user
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // Check if the requester has the superadmin role
    if (!context.auth.token.superadmin) {
        throw new functions.https.HttpsError('permission-denied', 'Only superadmins can delete admins.');
    }

    const uidToDelete = data.uid;

    try {
        // Optionally, check if the target user is an admin before deletion
        const userToDelete = await admin.auth().getUser(uidToDelete);
        if (userToDelete.customClaims && userToDelete.customClaims.superadmin) {
            throw new functions.https.HttpsError('failed-precondition', 'The targeted user is a superadmin.');
        }

        await admin.auth().deleteUser(uidToDelete);
        await admin.firestore().collection('users').doc(uidToDelete).delete();
        return { message: 'Admin deleted successfully.' };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new functions.https.HttpsError('internal', 'Unable to delete user.');
    }
});

exports.addSuperAdminRole = functions.https.onCall(async (data, context) => {
    // Replace this with your logic to authenticate the request
    if (!context.auth.token.superadmin) {
      throw new functions.https.HttpsError('permission-denied', 'Only superadmins can assign superadmin role.');
    }

    const uid = data.uid; // The UID of the user to become a superadmin
    await admin.auth().setCustomUserClaims(uid, { superadmin: true });
    return { message: `Success! ${uid} has been made a superadmin.` };
});

exports.updateUserRole = functions.https.onCall(async (data, context) => {
    // Ensure the function is called by an authenticated superadmin
    if (!context.auth || !context.auth.token.superadmin) {
      throw new functions.https.HttpsError('permission-denied', 'Only superadmins can change user roles.');
    }

    const { uid, newRole } = data;

    // Define roles and corresponding custom claims
    const rolesToClaims = {
      user: { admin: false, superadmin: false },
      admin: { admin: true, superadmin: false },
      superadmin: { admin: true, superadmin: true },
    };

    try {
      // Update custom claims based on new role
      await admin.auth().setCustomUserClaims(uid, rolesToClaims[newRole]);

      // Update role in Firestore
      await admin.firestore().collection('users').doc(uid).update({
        role: newRole,
      });

      return { message: `User role updated to ${newRole}` };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new functions.https.HttpsError('internal', 'Unable to update user role.');
    }
});
  