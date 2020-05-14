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

  let clickedActor = { scrollerIndex: '', name: '', url: '' };

  this.Given(/^I have clicked on any actor listed in the "([^"]*)" scroller on the start page$/, async function (arg1) {

    let bornTodayScroller = await driver.wait(until.elementLocated(By.css('div.born-today')), 10000);
    let actorsInScroller = await bornTodayScroller.findElements(By.css('a[href*="/name/"][aria-label*=" "]'));

    clickedActor.scrollerIndex = Math.floor((Math.random() * actorsInScroller.length) + 1);
    clickedActor.name = await actorsInScroller[clickedActor.scrollerIndex].getAttribute('aria-label');
    clickedActor.url = await actorsInScroller[clickedActor.scrollerIndex].getAttribute('href');

    await actorsInScroller[clickedActor.scrollerIndex].click();

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^have reached that actors summary page$/, async function () {

    //console.log(clickedActor);

    let actorPageHeadline = await driver.wait(until.elementLocated(By.css('h1.header > span.itemprop')), 10000).getText();

    expect(actorPageHeadline).to.include(clickedActor.name);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^I click on the "([^"]*)" from this or any other page$/, async function (value) {

    let menuButton = await driver.wait(until.elementLocated(By.css('label.ipc-button')), 10000);

    //await menuButton.sendKeys(Key.RETURN);
    await menuButton.click();

    //let menuPanel = await driver.findElement(By.css('div[data-testid="panel"]'));
    let menuPanel = await driver.wait(until.elementLocated(By.css('div[data-testid="panel"]')), 10000);

    expect(await menuPanel.isDisplayed(),
      value + ' did not open on click').to.be.true;

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^have clicked "([^"]*)" under Celebs$/, async function (value) {

    let bornTodayLink = await driver.wait(until.elementLocated(By.linkText(value)), 10000);

    await bornTodayLink.sendKeys(Key.RETURN);

    let bornTodayPageHeadline = await driver.wait(until.elementLocated(By.css('#main > div.article > h1.header')), 10000).getText();

    ///et today = new Date();
    //let headLineStr = 'Birth Month Day of 0' + (parseInt(today.getMonth()) + 1) + '-' + today.getDate();
    let headLineStr = 'Birth Month Day of';

    expect(bornTodayPageHeadline).to.include(headLineStr,
      'headline on target page did not contain "' + headLineStr + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^the born today list is sorted by "([^"]*)" descending$/, async function (arg1) {

    let bornTodayPageHeadline = await driver.wait(until.elementLocated(By.css('#main > div.article > h1.header')), 10000).getText();

    let headLineStr = 'Popularity Ascending';

    expect(bornTodayPageHeadline).to.include(headLineStr,
      'headline on target page did not contain "' + headLineStr + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^that actor should be listed in the same order as in the scroller \(from left to right\) on the start page$/, async function () {

    let bornTodayListing = await driver.wait(until.elementLocated(By.css('div.lister-list')), 10000);
    let bornTodayLinks = await bornTodayListing.findElements(By.css('h3.lister-item-header > a[href*="/name/"]'));

    let linkUrl = await bornTodayLinks[clickedActor.scrollerIndex].getAttribute('href');
    let linkName = await bornTodayLinks[clickedActor.scrollerIndex].getText();
    expect(clickedActor.url).to.include(linkUrl);
    expect(clickedActor.name).to.include(linkName);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^clicking on the same actor in this list should lead to that actors summary page$/, async function () {

    await driver.wait(until.elementLocated(By.linkText(clickedActor.name)), 10000).click();

    let actorPageHeadline = await driver.wait(until.elementLocated(By.css('h1.header > span.itemprop')), 10000).getText();

    expect(actorPageHeadline).to.include(clickedActor.name);

  });


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