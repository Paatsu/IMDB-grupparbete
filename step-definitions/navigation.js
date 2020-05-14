const { By, Key, until } = require('selenium-webdriver');

let { $, sleep } = require('./funcs');

module.exports = function () {

  /* ----------------------------------------------------------------------------------------------- */
  /* 6.1 Scenario: Looking at a poll result without voting and changing between votes and percentage */
  /* ----------------------------------------------------------------------------------------------- */

  let selectedPollName;
  let voteResults;

  let sleepEnabled = false;
  let sleepTime = 0;

  this.Given(/^I have clicked on the "([^"]*)"$/, async function (value) {

    let menuButton = await driver.wait(until.elementLocated(By.css('label.ipc-button')), 10000);

    //await menuButton.sendKeys(Key.RETURN);
    await menuButton.click();

    //let menuPanel = await driver.findElement(By.css('div[data-testid="panel"]'));
    let menuPanel = await driver.wait(until.elementLocated(By.css('div[data-testid="panel"]')), 10000);

    expect(await menuPanel.isDisplayed(),
      value + ' did not open on click').to.be.true;

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^have clicked "([^"]*)" under Community$/, async function (value) {

    let pollsLink = await driver.wait(until.elementLocated(By.linkText(value)), 10000);

    await pollsLink.sendKeys(Key.RETURN);

    let pollsPageHeadline = await driver.wait(until.elementLocated(By.css('div.poll.homepage > h1')), 10000).getText();

    expect(pollsPageHeadline).to.include(value,
      'headline on target page did not contain "' + value + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^have clicked on any listed poll$/, async function () {

    let pollLink = await driver.wait(until.elementLocated(By.css('.poll .teaser > a')), 10000);

    selectedPollName = await pollLink.getText();

    await pollLink.sendKeys(Key.RETURN);

    let pollPageHeadline = await driver.wait(until.elementLocated(By.css('div.poll.active > h1')), 10000).getText();

    expect(pollPageHeadline).to.include(selectedPollName,
      'headline on target page did not contain "' + selectedPollName + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^have clicked "([^"]*)" on poll page$/, async function (value) {

    let noVoteLink = await driver.wait(until.elementLocated(By.css('.article > .results > a[href*="poll"]')), 10000);

    expect(await noVoteLink.getText()).to.equal(value,
      'the link "' + value + '" was not found');

    await noVoteLink.sendKeys(Key.RETURN);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^clicking on any of the bars in the voting results chart$/, async function () {

    // span elements are added for 0 vote bars on animation finish
    await driver.wait(until.elementLocated(By.css('li.answer > div.content > span.count')), 10000);

    // Collect all voting results content
    voteResults = await driver.findElements(By.css('li.answer > div.content'));

    // Checking all currently displayed vote counts
    for (let children of voteResults) {
      let barDiv = await children.findElement(By.css('div.bar'));
      let barDivData = await barDiv.getAttribute('data-count');
      let barDivText = await barDiv.getText();

      if (barDivText.includes(barDivData)) {
        expect(await barDiv.getText()).to.include(await barDiv.getAttribute('data-count'),
          'displayed vote count did not match attribute data');
      }
      else {
        expect(await children.findElement(By.css('span')).getText()).to.include(await barDiv.getAttribute('data-count'),
          'displayed vote count did not match attribute data');
      }
    }

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^values in the chart should change from number of votes to percentage or vice versa$/, async function () {

    await voteResults[0].findElement(By.css('li.answer > div.content > div.bar')).click();

    // Checking all currently displayed percent votes per choice
    for (let children of voteResults) {

      let barDiv = await children.findElement(By.css('div.bar'));
      let barDivDataPct = await barDiv.getAttribute('data-pct');
      let barDivText = await barDiv.getText();

      if (barDivText.includes(barDivDataPct)) {
        expect(await barDiv.getText()).to.include(await barDiv.getAttribute('data-pct'),
          'displayed vote percentage did not match attribute data');
      }
      else {
        expect(await children.findElement(By.css('span')).getText()).to.include(await barDiv.getAttribute('data-count'),
          'displayed vote percentage did not match attribute data');
      }

    }

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  /* ------------------------------------------------------------------------------------------------------------ */
  /* 6.2 Scenario: Browsing same actor from "Born Today" scroller on start page and via "Born Today" in main menu */
  /* ------------------------------------------------------------------------------------------------------------ */

  /* --------------------------------------------------------------------------------------------------------------- */
  /* 6.3 Scenario: Choosing "Browse TV Show by Genre" from main "Menu" and selecting by "Movie and TV Series Theme"  */
  /* --------------------------------------------------------------------------------------------------------------- */

  /* --------------------------------------------------------------------------------------- */
  /* 6.4 Scenario: Browsing and clicking movies listed in Fan Favorite scroller on startpage */
  /* --------------------------------------------------------------------------------------- */

  /* -------------------------------------------- */
  /* 6.5 Scenario: Finding a years Oscars Winners */
  /* -------------------------------------------- */

  this.Given(/^I have clicked on the menu/, async function () {
    // Borrowed some of this from Rickards navigation scenario
    let menuButton = await driver.wait(until.elementLocated(By.css('label.ipc-button')));

    await menuButton.click();

    let menuPanel = await driver.wait(until.elementLocated(By.css('div[data-testid="panel"]')));

    assert(menuPanel);

  });

  this.When(/^I click on Oscars under Awards & Events$/, async function () {
    // Write code here that turns the phrase above into concrete actions
    let oscarsLink = await driver.wait(until.elementLocated(By.linkText('Oscars')));
    await oscarsLink.click();
    let titleText = await driver.wait(until.elementLocated(By.css('.nav-heading-frame > div > a > h1'))).getText();
    expect(titleText).to.equals('OSCARS', 'The main title of the page should be OSCARS')

  });

  this.When(/^I click on "([^"]*)"$/, async function (year) {
    // Write code here that turns the phrase above into concrete actions
    let yearLink = await driver.wait(until.elementLocated(By.linkText(year)));
    assert(yearLink);
    yearLink.click()


  });

  this.Then(/^the "([^"]*)" page of Oscars winners should be showing$/, async function (year) {
    // Write code here that turns the phrase above into concrete actions
    let titleText = await driver.wait(until.elementLocated(By.css('.event-year-header > div'))).getText();
    expect(titleText).to.include(year + ' Awards', 'The main title of the page should be saying [year] + Awards')
  });

  /* ------------------------------------------- */
  /* 6.6 Scenario: Browsing the Top Rated Movies */
  /* ------------------------------------------- */

  /* ----------------------------------------------------- */
  /* 6.7 Scenario: Navigate to find the lowest rated movie */
  /* ----------------------------------------------------- */

}