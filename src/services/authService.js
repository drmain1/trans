import { Auth } from 'aws-amplify'

function signIn(username, password) {
  return Auth.signIn(username, password)
}

function signOut() {
  return Auth.signOut()
}

function currentAuthenticatedUser() {
  return Auth.currentAuthenticatedUser()
}

function getCurrentSession() {
  return Auth.currentSession()
}

function forgotPassword(username) {
  return Auth.forgotPassword(username)
}

function forgotPasswordSubmit(username, code, newPassword) {
  return Auth.forgotPasswordSubmit(username, code, newPassword)
}

function changePassword(oldPassword, newPassword) {
  return Auth.currentAuthenticatedUser()
    .then(user => {
      return Auth.changePassword(user, oldPassword, newPassword)
    })
}

function updateUserAttributes(attributes) {
  return Auth.currentAuthenticatedUser()
    .then(user => {
      return Auth.updateUserAttributes(user, attributes)
    })
}

export {
  signIn,
  signOut,
  currentAuthenticatedUser,
  getCurrentSession,
  forgotPassword,
  forgotPasswordSubmit,
  changePassword,
  updateUserAttributes
} 