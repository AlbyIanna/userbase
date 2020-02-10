/// <reference types="Cypress" />

const beforeHook = function (setAppId) {
  cy.clearLocalStorage()
  sessionStorage.clear()

  cy.visit('./cypress/integration/index.html').then(function (win) {
    expect(win).to.have.property('userbase')
    const userbase = win.userbase
    this.currentTest.userbase = userbase

    const { endpoint } = Cypress.env()
    win._userbaseEndpoint = endpoint

    if (setAppId) setAppId(userbase, this)

    cy.getRandomInfoWithParams(null, null, 'none').then((loginInfo) => {
      this.currentTest.userData = loginInfo
    })
  })
}

describe("User deletion Tests", function () {
  beforeEach(function () {
    beforeHook(function (userbase, that) {
      const { appId } = Cypress.env()
      userbase.init({ appId })
      that.currentTest.appId = appId
    })
  })

  it("Sign up user delete it", async function () {
    await this.test.userbase.signUp(this.test.userData)
    await this.test.userbase.deleteUser()
    try {
      await this.test.userbase.signIn(this.test.userData)
      throw new Error('Sign in should not be successful')
    }
    catch (err) {
      expect(err.name, 'correct error name').to.equal('UsernameOrPasswordMismatch')
    }
  })

  it("User is not signed in", async function () {
    try {
      await this.test.userbase.deleteUser()
      throw new Error('User deletion should not be successful')
    }
    catch (err) {
      expect(err.name, 'correct error name').to.equal('UserNotSignedIn')
    }
  })
})
