let { $, sleep } = require('./funcs');

module.exports = function () {

  // --------------------------------------------------------------------------------------------------------------------------------- //
  // 7.1 ----------------------------------------------------------------------------------------------------------------------------- //
  // --------------------------------------------------------------------------------------------------------------------------------- //

  let oldUserID;

  this.When(/^clicked on "([^"]*)" besides your User id$/, async function (linkText) {

    // This was the easiest place I could find the current name in
    oldUserID = await driver.findElement(By.css('.auth-input-row > div')).getText();
    
    driver.wait(until.elementLocated(By.linkText(linkText))).click();

  });

  this.When(/^you enter a new user ID in the input field$/, async function () {

    let nameInput = await driver.wait(until.elementLocated(By.css(".auth-input--input")));

    // this ternery changes your username to a different one of two
    nameInput.clear();
    nameInput.sendKeys("AWESOMEGUYadfjasdfjasghlplfjvnen");
    await sleep(2000)

  });

  this.When(/^clicked the Save Changes button$/, async function () {

    await driver.wait(until.elementLocated(By.css('input[value="Save Changes"]'))).click();

  });

  this.Then(/^your user ID should be a new user ID$/, async function () {
    
    let endName = await driver.wait(until.elementLocated(By.css('.auth-input-row'))).getText();
    expect(endName).to.include("AWESOMEGUYadfjasdfjasghlplfjvnen");

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

}