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
    let textToVerify = await textfield.getText();
    expect(textToVerify, 'Text did not match in Bio').to.equal(loremIpsum);
    await textfield.clear();
    saveButton = await driver.wait(until.elementLocated(By.css('.auth-button-link.auth-button--primary'))).click();
    expect(saveButton, 'Could not find the Save button');

  });


  /* -------------------------------------------------------------------------- */
  /* 7.3 Scenario Outline: Changing password and verifying change by signing in */
  /* -------------------------------------------------------------------------- */

  let passwordsToUse = {
    current: password,
    new: 'MySuperDuperSafePass3000', //or whatever... Math.random().toString(36).slice(-10)
    uppercase1: 'safePass',
    lowercase1: 'safepass',
    short: 'SafePa1',
    alphaonly: 'safepass',
    digitonly: '12345678',
    whitespace: 'a      1',
    //trailing: ' trailingSpace '
  }

  this.Given(/^that you are logged in to your IMDB account using "([^"]*)"$/, async function (value) {

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
    await passwordField.sendKeys(passwordsToUse[value]);

    let signInButton = await driver.wait(until.elementLocated(By.css('input#signInSubmit')), 10000,
      'Could not find login email field');
    await signInButton.click();

    let captchaReq = await driver.findElements(By.css('div#image-captcha-section'));
    if (captchaReq.length) {
      // Central command! Central command! We got captchas!
      passwordField = await driver.wait(until.elementLocated(By.css('input#ap_password')));
      await passwordField.sendKeys(passwordsToUse[value]); // Refilling password field
      await driver.findElement(By.css('input#auth-captcha-guess')).sendKeys(Key.CLEAR);
      while (captchaReq.length) {
        captchaReq = await driver.findElements(By.css('div#image-captcha-section'));
        console.log('Please enter Captcha code in webbrowser and click sign in before timeout!');
        await sleep(2500);
      }
    }

    await driver.wait(until.elementLocated(By.css('div[data-menu-id="navUserMenu"]')), 20000,
      'was not logged on to page using the ' + value + ' password');

    sleepEnabled ? await sleep(sleepTime) : '';
  });

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
    await inputCurrentPassword.sendKeys(passwordsToUse[value]);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^input a "([^"]*)" \(new password\)$/, async function (value) {

    let inputNewPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new')), 10000,
      value + ' field was not found');
    await inputNewPassword.sendKeys(passwordsToUse[value]);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^reenter your "([^"]*)" \(new password\)$/, async function (value) {

    let inputReenterPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new_check')), 10000,
      value + ' field was not found');
    await inputReenterPassword.sendKeys(passwordsToUse[value]);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^clicked the button "([^"]*)" to save "([^"]*)" \(new password\)$/, async function (value1, value2) {

    // Before saving new password. Simple read/save log in case using random generated passes
    let path = "./step-definitions/credentials_log.json"
    let log = { passwordHistory: [] };
    if (fs.existsSync(path)) {
      log = fs.readFileSync(path, 'utf8', function (error, data) {
        if (error !== null) { throw error }
        return data;
      });
      log = JSON.parse(log);
      if (!log.passwordHistory) { throw new Error('bad formatting in JSON file ' + path) }
    }
    log.passwordHistory.unshift(passwordsToUse[value2]);
    let jsonData = JSON.stringify(log);
    fs.writeFile(path, jsonData, 'utf8', function (error) {
      if (error) { throw error };
    });

    let savePasswordButton = await driver.wait(until.elementLocated(By.css('input#cnep_1D_submit_button')), 10000,
      value1 + ' button was not found')
    await savePasswordButton.click();

    await driver.wait(until.elementLocated(By.css('div#auth-success-message-box')), 10000,
      'something went wrong when saving new password: ' + passwordsToUse[value2]);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^clicked the button "([^"]*)" and signing out$/, async function (arg1) {

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


  this.Then(/^signing in using "([^"]*)" should work$/, async function (value) {

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
    await passwordField.sendKeys(passwordsToUse[value]);

    let signInButton = await driver.wait(until.elementLocated(By.css('input#signInSubmit')), 10000,
      'Could not find login email field');
    await signInButton.click();

    let captchaReq = await driver.findElements(By.css('div#image-captcha-section'));
    if (captchaReq.length) {
      // Central command! Central command! We got captchas!
      passwordField = await driver.wait(until.elementLocated(By.css('input#ap_password')));
      await passwordField.sendKeys(passwordsToUse[value]); // Refilling password field
      await driver.findElement(By.css('input#auth-captcha-guess')).sendKeys(Key.CLEAR);
      while (captchaReq.length) {
        captchaReq = await driver.findElements(By.css('div#image-captcha-section'));
        console.log('Please enter Captcha code in webbrowser and click sign in before timeout!');
        await sleep(2500);
      }
    }

    await driver.wait(until.elementLocated(By.css('div[data-menu-id="navUserMenu"]')), 20000,
      'was not logged on to page using the ' + value + ' password');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  /* ------------------------------------------------ */
  /* 7.4 Scenario Outline: Changing to a bad password */
  /* ------------------------------------------------ */

  this.Given(/^input your "([^"]*)" \(currentpassword\) input "([^"]*)" \(newpassword\) input "([^"]*)" \(reenternewpassword\) and click the button "([^"]*)"$/, async function (value1, value2, value3, value4, table) {

    let combinations = table.rows();
    for (let comb of combinations) {

      let inputCurrentPassword = await driver.wait(until.elementLocated(By.css('input#ap_password')), 10000,
        value1 + ' field was not found');
      await inputCurrentPassword.sendKeys(Key.CLEAR);
      await inputCurrentPassword.sendKeys(passwordsToUse[comb[0]]);

      let inputNewPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new')), 10000,
        value2 + ' field was not found');
      await inputNewPassword.sendKeys(Key.CLEAR);
      await inputNewPassword.sendKeys(passwordsToUse[comb[1]]);

      let inputReenterPassword = await driver.wait(until.elementLocated(By.css('input#ap_password_new_check')), 10000,
        value3 + ' field was not found');
      await inputReenterPassword.sendKeys(Key.CLEAR);
      await inputReenterPassword.sendKeys(passwordsToUse[comb[2]]);

      let savePasswordButton = await driver.wait(until.elementLocated(By.css('input#cnep_1D_submit_button')), 10000,
        value4 + ' button was not found')
      await savePasswordButton.click();

      let messagebox;
      if (comb[3].includes('error')) {
        messagebox = await driver.wait(until.elementLocated(By.css('div#auth-error-message-box')), 10000,
          'password change should result in ' + comb[3] + ' for: ' + comb);
      }
      if (comb[3].includes('success')) {
        messagebox = await driver.wait(until.elementLocated(By.css('div#auth-success-message-box')), 10000,
          'something went wrong when saving new password: ' + passwordsToUse[comb[1]]);
      }

      let messagetext = await messagebox.getText();
      expect(messagetext).to.include(comb[4], 'incorrect "' + comb[3] + '" message displayed for: ' + comb);

      await driver.navigate().back();

      sleepEnabled ? await sleep(sleepTime) : '';
    }


  });


  this.Then(/^correct error message should be displayed for each combination entered from data table$/, function () {

    // Previous step did this. Nothing to test here...

  });


  /* --------------------------------------------------------------------------------------------- */
  /* 7.5 Changing password twice during same login session and verifying last change by signing in */
  /* --------------------------------------------------------------------------------------------- */

  this.Then(/^that I am signed out$/, async function () {

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

}