let { $, sleep } = require('./funcs');

module.exports = function () {

  // 7.2 Scenario: Adding text to your bio

  let loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  this.Given(/^you are on "([^"]*)"$/, async function (linkText) {

    let accountButton = await driver.wait(until.elementLocated(By.css('.navbar__user-menu-toggle__button'))).click();
    expect(accountButton, 'Could not find the Account button');
    let accountSettingsButton = await driver.findElement(By.linkText(linkText)).click();
    expect(accountSettingsButton, 'Could not find the Account settings link');

  });

  this.When(/^clicked on "([^"]*)"$/, async function (linkText) {

    let accountSettingsButton = await driver.findElement(By.linkText(linkText)).click();
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