let {$, sleep} = require('./funcs');

module.exports = function() {

  let sleepTime = 0;
  let searchField;

  // 1.1
  this.Given(/^that I have selected the search input field$/, async function() {
    
    searchField = await $('input[placeholder="Search IMDb"]');
    assert(searchField)

  });

  this.Given(/^that I have entered "([^"]*)"$/, async function (ActorName) {
    
    searchField.sendKeys(ActorName);
    let searchText = await searchField.getAttribute("value");
    assert.include(searchText, ActorName, "The searchbar doesn't have the text in it");
  });

  this.When(/^I have waited for the dropdown results to load$/, async function() {
    
    await driver.wait(until.elementLocated(By.css('.react-autosuggest__suggestions-list')));
    let searchDropDown = await $('a[data-testid="search-result--const"]');
    assert(searchDropDown, "The results of the list didn't load");

    await sleep(sleepTime)

  });

  this.When(/^I click on the first option on the dropdown$/, async function() {
  
    let firstDropOption = await driver.wait(until.elementLocated(By.css('a[data-testid="search-result--const"]')));

    firstDropOption.click()

  });

  this.Then(/^I should be browsing the profile page of "([^"]*)"$/, async function (ActorName) {

    let results = await driver.wait(until.elementLocated(By.css('.name-overview-widget__section')));
    let resultText = await results.getText();
    assert.include(resultText, ActorName, "You're not browsing the right actors/actresses page");

    await sleep(sleepTime)
    
  });

}