const { WebElement, By, Key, until } = require('selenium-webdriver');
let { $, sleep } = require('./funcs');

module.exports = function () {

  let sleepEnabled = false;
  let sleepTime = 3000;

  /* --------------------------------------------------------------------------------------------------- */
  /* 2.1 Scenario: Browsing by keywords from Advanced Search Pages and filtering to find "One Punch Man" */
  /* --------------------------------------------------------------------------------------------------- */

  let keywordOnPage;

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


  /* ---------------------------------------------------------------------------------- */
  /* 2.2 Scenario: Advanced search for the movie Face-Off by "Same Title" collaboration */
  /* ---------------------------------------------------------------------------------- */

  let searchTerms = [];

  this.Given(/^clicked "([^"]*)"$/, async function (value) {

    let collabLink = await driver.wait(until.elementLocated(By.linkText(value)), 10000,
      'Could not find the link ' + value);

    await collabLink.click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^entered "([^"]*)" in the first "([^"]*)" input field$/, async function (value1, value2) {

    searchTerms[0] = value1;

    // Until everythiiiing! :-)

    let name1Field = await driver.wait(until.elementLocated(By.css('div#Name-1-search-bar > input#Name-1-search-bar-input')), 10000,
      'Could not find' + value2 + ' input field');

    // Have to input slowly since search items becomes stale everytime search is performed by autosuggestion
    for (let char of [...value1]) {
      await name1Field.sendKeys(char);
      // Need this delay
      await sleep(500);
    }

    // Extra precaution to force update
    name1Field.click();

    let firstItemLabel = await driver.wait(until.elementLocated(By.css('div#Name-1-search-bar > div#Name-1-search-bar-results > a.search_item > div.suggestionlabel > span.title')), 10000).getText();
    expect(firstItemLabel.toLowerCase()).to.include(value1, 'search term ' + value1 + ' gave unexpected search suggestion');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^clicked on suggested option "([^"]*)" of first input field$/, async function (value) {

    await driver.wait(until.elementLocated(By.css('div#Name-1-search-bar > div#Name-1-search-bar-results > a.search_item')), 10000).click();

    let name1FieldValue = await driver.wait(until.elementLocated(By.css('div#Name-1-selected-search-result > span.selected-text')), 10000).getText();

    expect(name1FieldValue.toLowerCase()).to.include(searchTerms[0], 'field top suggestion was never clicked/selected');
    expect(name1FieldValue).to.include(value, 'clicked/selected suggestion doesnt match cucumber "' + value);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^entered "([^"]*)" in the second "([^"]*)" input field$/, async function (value1, value2) {

    searchTerms[1] = value1;

    // Until everythiiiing! :-)

    let name2Field = await driver.wait(until.elementLocated(By.css('div#Name-2-search-bar > input#Name-2-search-bar-input')), 10000,
      'Could not find' + value2 + ' input field');

    // Have to input slowly since search items becomes stale everytime search is performed by autosuggestion
    for (let char of [...value1]) {
      await name2Field.sendKeys(char);
      await sleep(500);
    }

    // Extra precaution to force update
    name2Field.click();

    let firstItemLabel = await driver.wait(until.elementLocated(By.css('div#Name-2-search-bar > div#Name-2-search-bar-results > a.search_item > div.suggestionlabel > span.title')), 10000).getText();
    expect(firstItemLabel.toLowerCase()).to.include(value1, 'search term ' + value1 + ' gave unexpected search suggestion');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^clicked on suggested option "([^"]*)" of second input field$/, async function (value) {

    await driver.wait(until.elementLocated(By.css('div#Name-2-search-bar > div#Name-2-search-bar-results > a.search_item')), 10000).click();

    let name2FieldValue = await driver.wait(until.elementLocated(By.css('div#Name-2-selected-search-result > span.selected-text')), 10000).getText();

    expect(name2FieldValue.toLowerCase()).to.include(searchTerms[1], 'field top suggestion was never clicked/selected');
    expect(name2FieldValue).to.include(value, 'clicked/selected suggestion doesnt match cucumber "' + value);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^clicking "([^"]*)" button of the "([^"]*)" form$/, async function (value1, value2) {

    let searchButton = await driver.wait(until.elementLocated(By.css('button.Name-search-done')), 10000,
      'Could not find the' + value1 + ' button of ' + value2 + ' form');

    await searchButton.click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^the movie "([^"]*)" should be the top search result$/, async function (value) {

    let firstListerItemHeadline = await driver.wait(until.elementLocated(By.css('div.lister-item > div.lister-item-content > h3.lister-item-header > a')), 10000).getText();

    expect(firstListerItemHeadline).to.equal(value, 'expected top search result to be ' + value);

    sleepEnabled ? await sleep(sleepTime) : '';
  });



}