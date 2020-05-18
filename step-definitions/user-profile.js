const fs = require('fs');
const { WebElement, By, Key, until } = require('selenium-webdriver');
const { username, password, testedPasswords } = require('./credentials.json');
let { $, sleep } = require('./funcs');

module.exports = function () {

  let sleepEnabled = false;
  let sleepTime = 3000;

  // --------------------------------------------------------------------------------------------------------------------------------- //
  // 7.1 ----------------------------------------------------------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------------------------------------------------------------- //

  let oldUserID;
  let newName;

  this.When(/^clicked on "([^"]*)" besides your User id$/, async function (linkText) {

    // This was the easiest place I could find the current name in
    oldUserID = await driver.findElement(By.css('.auth-input-row > div')).getText();

    driver.wait(until.elementLocated(By.linkText(linkText))).click();

  });

  this.When(/^you enter a new user ID in the input field$/, async function () {

    let nameInput = await driver.wait(until.elementLocated(By.css(".auth-input--input")));
    newName = "AWESOMEGUY" + Math.random().toString(36).slice(-10);
    // this ternery changes your username to a different one of two
    nameInput.clear();
    nameInput.sendKeys(newName);
    await sleep(2000)

  });

  this.When(/^clicked the Save Changes button$/, async function () {

    await driver.wait(until.elementLocated(By.css('input[value="Save Changes"]'))).click();

  });

  this.Then(/^your user ID should be a new user ID$/, async function () {

    let endName = await driver.wait(until.elementLocated(By.css('.auth-input-row'))).getText();
    expect(endName).to.include(newName);

    // after this we set the username back to the original so the test works on multiple accounts
    await driver.wait(until.elementLocated(By.linkText("Edit"))).click();
    let nameInput = await driver.wait(until.elementLocated(By.css(".auth-input--input")));
    nameInput.clear();
    nameInput.sendKeys(oldUserID);
    await driver.wait(until.elementLocated(By.css('input[value="Save Changes"]'))).click();

  });

  // --------------------------------------------------------------------------------------------------------------------------------- //
  // 7.2 Scenario: Adding text to your bio ------------------------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------------------------------------------------------------- //

  let loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  this.When(/^clicked on "([^"]*)"$/, async function (linkText) {

    let accountSettingsButton = await driver.wait(until.elementLocated(By.linkText(linkText))).click();
    expect(accountSettingsButton, 'Could not find the Edit profile link');

  });

  this.Then(/^input a text to the textfield under "([^"]*)"$/, async function (arg1) {

    let textfield = await driver.wait(until.elementLocated(By.css('textarea.multiline')));
    await textfield.clear();
    await textfield.sendKeys(loremIpsum);
    expect(textfield, 'Could not find the textfield');

  });

  this.Then(/^clicked the button "([^"]*)"$/, async function (save) {

    let saveButtonText = await driver.wait(until.elementLocated(By.css('.auth-button-link.auth-button--primary'))).getText();
    expect(saveButtonText, 'Save button did not match').to.include(save);
    let saveButton = await driver.wait(until.elementLocated(By.css('.auth-button-link.auth-button--primary'))).click();
    expect(saveButton, 'Could not find the Save button');

    // Verify and reset test

    await driver.wait(until.elementLocated(By.linkText('Edit profile')));
    let accountSettingsButton = await driver.findElement(By.linkText('Edit profile')).click();
    expect(accountSettingsButton, 'Could not find the Edit profile link');
    let textfield = await driver.wait(until.elementLocated(By.css('textarea.multiline')));
    await sleep(3000);
    let textToVerify = await textfield.getText();
    expect(textToVerify, 'Text did not match in Bio').to.equal(loremIpsum);
    await textfield.clear();
    saveButton = await driver.wait(until.elementLocated(By.css('.auth-button-link.auth-button--primary'))).click();
    expect(saveButton, 'Could not find the Save button');

  });


  // --------------------------------------------------------------------------------------------------------------------------------- //
  // 7.3 Scenario: Change your password ------------------------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------------------------------------------------------------- //

  // Pass to use. Adjust or use any js to generate
  //let testPassword = Math.random().toString(36).slice(-10);
  let testPassword = 'MySuperDuperSafePass3000';

  this.Given(/^clicked on "([^"]*)" under Account Settings$/, async function (value) {

    let loginSecLink = await driver.wait(until.elementLocated(By.linkText(value)), 10000,
      'account settings link "' + value + '" was not found');
    await loginSecLink.click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^on the Login & security page clicked "([^"]*)" besides "([^"]*)"$/, async function (value, arg2) {

    let editPasswordButton = await driver.wait(until.elementLocated(By.css('input#auth-cnep-edit-password-button')), 10000,
      value + ' password button was not found');
    await editPasswordButton.click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^input your "([^"]*)" \(current password\)$/, async function (value) {

    let inputCurrentPassword = await driver.wait(until.elementLocated(By.css('input#ap_password')), 10000,
      value + ' field was not found');
    await inputCurrentPassword.sendKeys(password);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^input a "([^"]*)" \(new password\)$/, async function (value) {

    let inputNewPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new')), 10000,
      value + ' field was not found');
    await inputNewPassword.sendKeys(testPassword);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^reenter your "([^"]*)" \(new password\)$/, async function (value) {

    let inputReenterPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new_check')), 10000,
      value + ' field was not found');
    await inputReenterPassword.sendKeys(testPassword);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^clicked the button "([^"]*)" to save new password$/, async function (value) {

    // Simple save of last used test pass for backup and log
    let newPassesArr = [];
    if (testedPasswords) {
      newPassesArr = JSON.parse(JSON.stringify(testedPasswords))
    }
    newPassesArr.unshift(testPassword);

    let userData = { username: username, password: password, testedPasswords: newPassesArr }
    let jsonData = JSON.stringify(userData);
    let path = "./step-definitions/credentials.json"
    fs.writeFile(path, jsonData, 'utf8', function (error) {
      if (error) { throw new Error('error occured writing to JSON file'); }
    });

    let savePasswordButton = await driver.wait(until.elementLocated(By.css('input#cnep_1D_submit_button')), 10000,
      value + ' button was not found')
    await savePasswordButton.click();

    let successMessage = await driver.wait(until.elementLocated(By.css('div#auth-success-message-box')), 10000,
      'something went wrong when saving new password: ' + testPassword);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^immediately changing back to the old Password$/, async function () {

    let editPasswordButton = await driver.wait(until.elementLocated(By.css('input#auth-cnep-edit-password-button')), 10000)
    await editPasswordButton.click();
    let inputCurrentPassword = await driver.wait(until.elementLocated(By.css('input#ap_password')), 10000);
    await inputCurrentPassword.sendKeys(testPassword);
    let inputNewPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new')), 10000);
    await inputNewPassword.sendKeys(password);
    let inputReenterPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new_check')), 10000);
    await inputReenterPassword.sendKeys(password);
    let savePasswordButton = await driver.wait(until.elementLocated(By.css('input#cnep_1D_submit_button')), 10000);
    await savePasswordButton.click();

    let successMessage = await driver.wait(until.elementLocated(By.css('div#auth-success-message-box')), 10000,
      'something went wrong when saving (restoring) original password: ' + password);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^signing out$/, async function () {

    let loginSecDoneButton = await driver.wait(until.elementLocated(By.css('a#auth-cnep-done-button')), 10000,
      'done button was not found');
    await loginSecDoneButton.click();

    let userMenuButton = await driver.wait(until.elementLocated(By.css('.navbar__user-menu-toggle__button')), 10000,
      'usermenu button was not found');
    await userMenuButton.click();

    await driver.wait(until.elementLocated(By.css('div[data-menu-id="navUserMenu"].ipc-menu--anim-enter-done')), 10000,
      'usermenu did not open');

    let signOutLink = await driver.wait(until.elementLocated(By.css('a[href*="/registration/logout"]')), 10000,
      'sign out link was not found');
    await signOutLink.click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^signing in using original password should work just fine$/, async function () {

    signInMenuButton = await driver.wait(until.elementLocated(By.css('.navbar__user')), 10000,
      'Could not find the sign in menu button');
    await signInMenuButton.click();

    let loginImdb = await driver.wait(until.elementLocated(By.css('div.list-group:nth-child(2) > a:nth-child(1)')), 10000,
      'Could not find the login button auth provider');
    await loginImdb.click();

    let emailField = await driver.wait(until.elementLocated(By.css('input#ap_email')), 10000,
      'Could not find login email field');
    await emailField.sendKeys(username);

    let passwordField = await driver.wait(until.elementLocated(By.css('input#ap_password')), 10000,
      'Could not find login password field');
    await passwordField.sendKeys(password);

    let signInButton = await driver.wait(until.elementLocated(By.css('input#signInSubmit')), 10000,
      'Could not find login email field');
    await signInButton.click();

    await driver.wait(until.elementLocated(By.css('div[data-menu-id="navUserMenu"]')), 10000,
      'was not logged on to page using original password');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


}