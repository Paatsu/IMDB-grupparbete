let { $, sleep } = require('./funcs');
const { WebElement, By, Key, until } = require('selenium-webdriver');

module.exports = function () {
  let firstMovie;
  let firstArticle = firstMovie;

  let selectedPollName;
  let voteResults;
  let sleeptime = 2000;


  // Scenario: Finding all actors born the same date as an actor/actress
  let sleepTime = 0;
  this.When(/^I click on their birthdate$/, async function () {
    // Write code here that turns the phrase above into concrete actions
    await driver.wait(until.elementLocated(By.css('#name-born-info > time > a')), 10000, "couldn't find the birthdate to click").click();
  });

  this.Then(/^I should be shown a list of all actors born the same date$/, async function () {
    // Write code here that turns the phrase above into concrete actions
    let titleText = await driver.wait(until.elementLocated(By.css('.article > h1'))).getText();
    expect(titleText).to.include('Birth Month Day')
  });

  // Scenario: Find the release date of the movie "American Pie" in USA

  this.Then(/^I should find the release date in USA$/, async function () {

    await driver.wait(until.elementLocated(By.css('.title_wrapper h1')));
    let releaseDate = await $('.title_wrapper .subtext');
    expect(releaseDate, 'Could not find the release date in the movie page');
    let date = await releaseDate.getText();
    expect(date).to.include('9 July 1999', 'Release date is not correct')

    await sleep(sleepTime);

    this.Given


  });
  //Scenario navigating and clicking through

  this.Given(/^I have clicked on the "([^"]*)"\(main menu\)$/, async function (value) {

    menuButton = await driver.wait(until.elementLocated(By.css(".ipc-button")), 25000, 'link ' + value + ' the main menu was not found');
    await menuButton.click();

  });


  this.Given(/^I click on "([^"]*)" \(Celebrity News\)$/, async function (value) {

    let celebrityNews = await driver.wait(until.elementLocated(By.linkText(value)), 10000, 'link ' + value + ' was not found');

    await celebrityNews.click();

  });

  this.Given(/^I click the first Article "([^"]*)" \(Article\)$/, async function (value) {

    let firstArticle = await driver.wait(until.elementLocated(By.css('section#news-article-list > article > header h2 > a')), 10000,
      'could not find first article link on page');
    await firstArticle.click();

  });

  //Scenario Find Indian top rated movie 


  this.Then(/^I click the first indian movie$/, async function () {
    firstMovie = await driver.wait(until.elementLocated(By.css('.titleColumn > a'))).getText(); ('could not find first indian movie')
    await driver.wait(until.elementLocated(By.linkText(firstMovie))).click();
  });

  this.Then(/^i Am on the page of the Top Rated Indian Movie\.$/, async function () {

    let pageTitle = await driver.wait(until.elementLocated(By.css('.title_wrapper > h1'))).getText();
    assert.include(pageTitle, firstMovie, "You're not browsing the movie you clicked on's page");

  });




}
