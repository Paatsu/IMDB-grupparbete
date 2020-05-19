let { $, sleep } = require('./funcs');

module.exports = function () {
  let firstMovie;

  let selectedPollName;
  let voteResults;



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


  this.When(/^i click on "([^"]*)" under Celebs$/, async function (value) {

    //let = await driver.wait(until.elementLocated(By.linkText(value)), 10000);



    let CelebrityNews = await driver.wait(until.elementLocated(By.css("ipc-list-item__text")), 25000);
    let actorsInScroller = await bornTodayScroller.findElements(By.css('class="_1K0S44SUv8s7pXTI-caWlb sc-fjdhpX emeIFn" "]'));


    await CelebrityNews.sendKeys(Key.click);
    //await actorsInScroller[clickedCele.scrollerIndex].click();

  });

  this.Then(/^I click the first "([^"]*)"$/, async function () {

    firstArticle = await driver.wait(until.elementLocated(By.css('class="_news - article__header - detail ipl - inline - list'))).getText();
    await driver.wait(until.elementLocated(By.linkText(firstArticle))).click();



  });

  //Scenario Find Indian top rated movie 


  this.Then(/^I click the first indian movie$/, async function () {
    firstMovie = await driver.wait(until.elementLocated(By.css('.titleColumn > a'))).getText();
    await driver.wait(until.elementLocated(By.linkText(firstMovie))).click();
  });

  this.Then(/^i Am on the page of the Top Rated Indian Movie\.$/, async function () {

    let pageTitle = await driver.wait(until.elementLocated(By.css('.title_wrapper > h1'))).getText();
    assert.include(pageTitle, firstMovie, "You're not browsing the movie you clicked on's page");

  });




}
