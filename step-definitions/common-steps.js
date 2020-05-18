const { WebElement, By, Key, until } = require('selenium-webdriver');
const { username, password, testedPasswords } = require('./credentials.json');
let { $, sleep } = require('./funcs');


module.exports = function () {

  let sleepEnabled = false;
  let sleepTime = 3000;

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

    sleepEnabled ? await sleep(sleepTime) : '';
  });

  // Use Gherkin: Given I have clicked on the "All" button beside the top search field on any page

  this.Given(/^I have clicked on the "([^"]*)" button beside the top search field on any page$/, async function (button) {

    let allButton = await driver.wait(until.elementLocated(By.css('.search-category-selector .ipc-button__text'))).click();
    expect(allButton, 'Could not find the All button on the page');
    let allButtonText = await driver.findElement(By.css('.search-category-selector .ipc-button__text')).getText();
    expect(allButtonText).to.equal(button, 'We have clicked the wrong button');

    sleepEnabled ? await sleep(sleepTime) : '';
  });

  // Use Gherkin: Given have clicked the "Advanced Search"

  this.Given(/^have clicked the "([^"]*)"$/, async function (button) {
    let advancedButton = await driver.findElement(By.linkText('Advanced Search')).click();
    expect(advancedButton, 'Could not find the Advanced Search on the page');

    sleepEnabled ? await sleep(sleepTime) : '';
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

    sleepEnabled ? await sleep(sleepTime) : '';
  });

  // Use Gherkin: When resulting titles are sorted by "Popularity" ascending
  // Applies to search result movie listing page...

  this.When(/^the born today list is sorted by "([^"]*)" descending$/, async function (arg1) {

    let resultListPageHeadline = await driver.wait(until.elementLocated(By.css('#main > div.article > h1.header')), 10000).getText();

    //let headLineStr = 'Popularity Ascending';
    //expect(resultListPageHeadline).to.include(headLineStr,
    //  'headline on target page did not contain "' + headLineStr + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });

  // Use Gherkin: And you are on "Account settings"

  this.Given(/^you are on "([^"]*)"$/, async function (value) {

    let userMenubutton = await driver.wait(until.elementLocated(By.css('.navbar__user-menu-toggle__button')), 10000);
    //expect(userMenubutton, 'usermenu button was not found');
    userMenubutton.click();

    let userMenu = await driver.wait(until.elementLocated(By.css('div[data-menu-id="navUserMenu"].ipc-menu--anim-enter-done')), 10000);
    //expect(userMenu, 'usermenu did not open');

    let accountSettingsLink = await driver.wait(until.elementLocated(By.css('a[href*="/registration/accountsettings"]')), 10000);
    //expect(accountSettingsLink, 'usermenu link ' + value + 'was not found');
    await accountSettingsLink.click();

  });

}