let { $, sleep } = require('./funcs');

module.exports = function () {

  const { username, password } = require('./credentials.json');
  let sleepTime = 3000;
  let movieTitle;

  // Scenario: Add the movie "Bee Movie" to your watchlist

  this.When(/^I enter the search text "([^"]*)"$/, async function (searchText) {

    movieTitle = searchText;

    let searchField = await $('input[placeholder= "Search IMDb"]');
    expect(searchField, 'Can not find the search field on the page');
    searchField.sendKeys(searchText);

    // await sleep(sleepTime);

  });

  this.When(/^click the search button$/, async function () {

    let searchButton = await $('#suggestion-search-button');
    expect(searchButton, 'Could not find the search button');
    await searchButton.click();

  });

  this.Then(/^the first search result should contain the word "([^"]*)"$/, async function (searchText) {

    await driver.wait(until.elementLocated(By.css('.findResult, .findNoResults')));

    let results = await $('.findResult');
    expect(results, 'Could not find any results');
    let firstResult = results[0];
    let resultText = await firstResult.getText();

    expect(resultText).to.include(searchText, 'Could not find the movie ' + searchText + ' in the first search result.');

    // await sleep(sleepTime);

  });

  this.Then(/^click the movie "([^"]*)" profile$/, async function (searchText) {

    let resultButton = await driver.findElement(By.linkText(searchText))
    expect(resultButton, 'Could not find the link for our movie' + searchText) + ' in the result';
    await resultButton.click();

    let movieTitle = await $('.title_wrapper h1');
    let h1 = await movieTitle.getText();
    expect(h1).to.include(searchText, 'We clicked the wrong movie (sad face)')

    // await sleep(sleepTime);

  });

  this.Then(/^click the ribbon "([^"]*)" adjecent to h(\d+)$/, async function (button, header) {

    await driver.wait(until.elementLocated(By.css('.wl-ribbon.standalone.not-inWL')));
    let watchlistButton = await $('.wl-ribbon.standalone.not-inWL');
    expect(watchlistButton, 'Could not find the button' + button + ' on the site');

    await watchlistButton.click();
    await driver.wait(until.elementLocated(By.css('.wl-ribbon.standalone.inWL')));

    // verify on watchlist from header menu

    let watchlistButtonHeader = await $('.imdb-header__watchlist-button');
    expect(watchlistButtonHeader, 'Could not find the button' + button + ' on the header');

    await watchlistButtonHeader.click();

    await driver.wait(until.elementLocated(By.css('h3.lister-item-header')));
    let watchlistH3 = await $('h3.lister-item-header');
    expect(watchlistH3, 'Could not find the h3 in Watchlist page');
    let h3 = await watchlistH3.getText();
    expect(h3).to.equal(movieTitle, 'We added the wrong movie to Watchlist')

    // Remove movie from Watchlist to reset the test

    await driver.wait(until.elementLocated(By.css('.wl-ribbon.poster.inWL')));
    let removeWatchlistButton = await $('.wl-ribbon.poster.inWL');
    expect(removeWatchlistButton, 'Could not find the remove button');
    await driver.wait(until.elementLocated(By.css('h3.lister-item-header'))).click(); // just to focus on the page before clicking
    await removeWatchlistButton.click();

  });

}