const { WebElement, By, Key, until } = require('selenium-webdriver');
const { username, password } = require('./credentials.json');
let { $, sleep } = require('./funcs');


module.exports = function () {

  // Use Gherkin: Given that I am on the IMDB site

  this.Given(/^that I am on the IMDB site$/, async function () {
    // .loadPage waits for Body Tag. .get waits for onload
    // await helpers.loadPage('https://imdb.com');
    await driver.get('https://imdb.com');

  });


  // Use Gherkin: Given I have clicked on the "main menu"

  this.Given(/^I have clicked on the "([^"]*)"$/, async function (value) {

    let menuButton = await driver.wait(until.elementLocated(By.css('label.ipc-button')), 10000);

    //await menuButton.sendKeys(Key.RETURN);
    await menuButton.click();

    //let menuPanel = await driver.findElement(By.css('div[data-testid="panel"]'));
    let menuPanel = await driver.wait(until.elementLocated(By.css('div[data-testid="panel"][aria-hidden="false"]')), 10000);

    // await menuDrawer.isDisplayed() seems unreliable here
    expect(await menuPanel.getAttribute('aria-hidden'),
      value + ' did not open on click').to.equal('false');

  });

  // Use Gherkin: Given I have clicked on the "All" button beside the top search field on any page

  this.Given(/^I have clicked on the "([^"]*)" button beside the top search field on any page$/, async function (button) {

    let allButton = await driver.wait(until.elementLocated(By.css('.search-category-selector .ipc-button__text'))).click();
    expect(allButton, 'Could not find the All button on the page');
    let allButtonText = await driver.findElement(By.css('.search-category-selector .ipc-button__text')).getText();
    expect(allButtonText).to.equal(button, 'We have clicked the wrong button');

  });

  // Use Gherkin: Given have clicked the "Advanced Search"

  this.Given(/^have clicked the "([^"]*)"$/, async function (button) {
    let advancedButton = await driver.findElement(By.linkText('Advanced Search')).click();
    expect(advancedButton, 'Could not find the Advanced Search on the page');

  });


  // Use Gherkin: Given that you are logged in to your IMDB account

  this.Given(/^that you are logged in to your IMDB account$/, async function () {

    // Login to IMDB

    let logginButton = await $('.navbar__user');
    expect(logginButton, 'Could not find the login button');
    await logginButton.click();

    let logginText = await $('div.list-group:nth-child(2) > a:nth-child(1)');
    expect(logginText, 'Could not find the login button auth provider');
    await logginText.click();

    let emailField = await $('input#ap_email');
    expect(emailField, 'Could not find login field email');
    emailField.sendKeys(username);

    let passwordField = await $('input#ap_password');
    expect(passwordField, 'Could not find login field email');
    passwordField.sendKeys(password);

    let signinButton = await $('input#signInSubmit');
    expect(signinButton, 'Could not find the signin button');
    await signinButton.click();

  });


}