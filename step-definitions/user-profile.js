const fs = require('fs');
const { WebElement, By, Key, until } = require('selenium-webdriver');
const { username, password } = require('./credentials.json');
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

  /*
  this.Given(/^you are on "([^"]*)"$/, async function (linkText) {

    let accountButton = await driver.wait(until.elementLocated(By.css('.navbar__user-menu-toggle__button'))).click();
    expect(accountButton, 'Could not find the Account button');
    let accountSettingsButton = await driver.wait(until.elementLocated(By.linkText(linkText))).click();
    expect(accountSettingsButton, 'Could not find the Account settings link');

  });
*/
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

  // Adjust if needed
  let newRandomPassword = Math.random().toString(36).slice(-10);

  this.When(/^clicked on "([^"]*)" under Account Settings$/, async function (value) {

    let loginSecLink = await driver.wait(until.elementLocated(By.linkText(value)));
    //expect(loginSecLink, 'account settings link ' + value + 'was not found');
    await loginSecLink.click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^on the Login & security page clicked "([^"]*)" besides "([^"]*)"$/, async function (arg1, arg2) {

    let editPasswordButton = await driver.wait(until.elementLocated(By.css('input#auth-cnep-edit-password-button')), 10000).click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });



  this.Then(/^input your "([^"]*)" \(current password\)$/, async function (arg1) {

    let inputCurrentPassword = await driver.wait(until.elementLocated(By.css('input#ap_password')), 10000);
    await inputCurrentPassword.sendKeys(password);

    sleepEnabled ? await sleep(sleepTime) : '';
  });



  this.Then(/^input a "([^"]*)" \(new password\)$/, async function (arg1) {

    let inputNewPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new')), 10000);
    await inputNewPassword.sendKeys(newRandomPassword);

    sleepEnabled ? await sleep(sleepTime) : '';
  });



  this.Then(/^reenter your "([^"]*)" \(new password\)$/, async function (arg1) {

    let inputReenterPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new_check')), 10000);
    await inputReenterPassword.sendKeys(newRandomPassword);

    sleepEnabled ? await sleep(sleepTime) : '';
  });



  this.Then(/^clicked the button "([^"]*)" to save new password$/, async function (arg1) {

    let savePasswordButton = await driver.wait(until.elementLocated(By.css('input#cnep_1D_submit_button')), 10000).click();
    let successMessage = await driver.wait(until.elementLocated(By.css('div#auth-success-message-box')), 10000);

    if (successMessage instanceof WebElement) {
      let userData = {
        username: username,
        password: newRandomPassword,
        old_password: password
      }

      let jsonData = JSON.stringify(userData);
      let path = "./step-definitions/credentials.json"

      fs.writeFile(path, jsonData, 'utf8', function (error) {
        if (error) { throw new Error('An error occured while writing JSON file'); }
        //console.log(path + ' has been saved');
      });
    }

  });


}