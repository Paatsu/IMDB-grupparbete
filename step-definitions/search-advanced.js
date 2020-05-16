let { $, sleep } = require('./funcs');

module.exports = function () {

  // 2.1 Scenario: Browsing by keywords from Advanced Search Pages and filtering to find "One Punch Man"

  let keywordOnPage;

  this.Given(/^I have clicked on the "([^"]*)" button beside the top search field on any page$/, async function (button) {

    let allButton = await driver.wait(until.elementLocated(By.css('.search-category-selector .ipc-button__text'))).click();
    expect(allButton, 'Could not find the All button on the page');
    let allButtonText = await driver.findElement(By.css('.search-category-selector .ipc-button__text')).getText();
    expect(allButtonText).to.equal(button, 'We have clicked the wrong button');

  });

  this.Given(/^have clicked the "([^"]*)"$/, async function (button) {
    let advancedButton = await driver.findElement(By.linkText('Advanced Search')).click();
    expect(advancedButton, 'Could not find the Advanced Search on the page');

  });

  this.Given(/^have clicked "([^"]*)" beside "([^"]*)"$/, async function (keyword, findText) {

    let findTextOnPage = await driver.wait(until.elementLocated(By.css('.imdb-search-gateway__browse'))).getText();
    expect(findTextOnPage, 'Could not find the text' + findText + ' on the page').to.include(findText);
    let keywordLink = await driver.findElement(By.linkText('Keyword')).click();
    expect(keywordLink, 'Could not find the link ' + keyword + ' on the page')

  });

  this.Given(/^entered the keyword "([^"]*)" in the input field beside "([^"]*)" and clicked "([^"]*)"$/, async function (keyword, findText, button) {

    let findTextOnPage = await driver.wait(until.elementLocated(By.css('.searchbox'))).getText();
    expect(findTextOnPage, 'Could not find the text' + findText + ' on the page').to.include(findText);
    let inputField = await driver.wait(until.elementLocated(By.css("form.searchbox input[name='q']")));
    expect(inputField, 'Could not find the input field on the page');
    await inputField.sendKeys(keyword);
    let searchButton = await driver.wait(until.elementLocated(By.css('input.btn'))).click();
    expect(searchButton, 'Could not find the ' + button + ' button');

  });

  this.Given(/^clicked "([^"]*)" on the "([^"]*)" "([^"]*)" page$/, async function (link, findText, keyword) {

    keywordOnPage = link;
    let findTextOnPage = await driver.wait(until.elementLocated(By.css('h1.findHeader'))).getText();
    expect(findTextOnPage, 'Could not find the text ' + findText + ' ' + keyword + ' on the page').to.include(findText, keyword);
    let linkOnPage = await driver.findElement(By.linkText(link)).click();
    expect(linkOnPage, 'Could not find ' + link + ' on the page');

  });

  this.Given(/^the "([^"]*)" has loaded$/, async function (h1Text) {

    let header = await driver.wait(until.elementLocated(By.css('h1.header'))).getText();
    expect(header, 'Could not find the header' + h1Text + ' on the page').to.include(h1Text);

  });

  this.Given(/^the "([^"]*)" corresponding to selected keyword is checked in the "([^"]*)" options \(filter\)$/, async function (keyword, refineFilter) {

    let findText = await driver.wait(until.elementLocated(By.css('div.faceter-header span.expand strong'))).getText();
    expect(findText, 'Could not find the filter option').to.include(refineFilter);
    let keywordChecked = await driver.wait(until.elementLocated(By.css('.faceter-fieldset input[name="' + keywordOnPage + '"][checked="checked"]')))
    expect(keywordChecked, 'Could not find the right ' + keyword + ' to be checked');

  });

  this.When(/^resulting titles are sorted by "([^"]*)" ascending$/, async function (sortedBy) {

    await selectOption('.lister-sort-by', sortedBy);

  });

  this.Then(/^"([^"]*)" should be among the top (\d+) results on that page$/, async function (keyword, toplist) {

    let getSearchResult = await driver.findElements(by.css('h3.lister-item-header a'));
    expect(getSearchResult.length, 'Could not find any results').to.equal(+toplist);

    let found = false;
    for (let h3 of getSearchResult) {
      let geth3 = await h3.getText();
      if (geth3.includes(keyword)) { found = true; }
    }

    expect(found, 'Cannot find the movie "' + keyword + '" on the result page').to.be.true;

  });

}