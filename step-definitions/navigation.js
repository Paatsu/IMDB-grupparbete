const { WebElement, By, Key, until } = require('selenium-webdriver');

let { $, sleep } = require('./funcs');

module.exports = function () {

  /* ----------------------------------------------------------------------------------------------- */
  /* 6.1 Scenario: Looking at a poll result without voting and changing between votes and percentage */
  /* ----------------------------------------------------------------------------------------------- */

  let selectedPollName;
  let voteResults;

  let sleepEnabled = false;
  let sleepTime = 0;

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

    expect(actorPageHeadline).to.include(clickedActor.name, 'headline on target page did not contain "' + clickedActor.name + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.When(/^have clicked "([^"]*)" under Celebs$/, async function (value) {

    let bornTodayLink = await driver.wait(until.elementLocated(By.linkText(value)), 10000);

    await bornTodayLink.sendKeys(Key.RETURN);

    let bornTodayPageHeadline = await driver.wait(until.elementLocated(By.css('#main > div.article > h1.header')), 10000).getText();

    //let today = new Date();
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
    expect(clickedActor.url).to.include(linkUrl,
      'no (name) match was found on born today page for the actor' + clickedActor.name + 'clicked in born today scroller');
    expect(clickedActor.name).to.include(linkName,
      'no (url) match was found on born today page for the actor' + clickedActor.name + 'clicked in born today scroller');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^clicking on the same actor in this list should lead to that actors summary page$/, async function () {

    await driver.wait(until.elementLocated(By.linkText(clickedActor.name)), 10000).click();

    let actorPageHeadline = await driver.wait(until.elementLocated(By.css('h1.header > span.itemprop')), 10000).getText();

    expect(actorPageHeadline).to.include(clickedActor.name,
      'headline on target page did not contain "' + clickedActor.name + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });



  /* --------------------------------------------------------------------------------------------------------------- */
  /* 6.3 Scenario: Choosing "Browse TV Show by Genre" from "main menu" and selecting by "Movie and TV Series Theme"  */
  /* --------------------------------------------------------------------------------------------------------------- */

  let clickedTheme;

  this.Given(/^have clicked "([^"]*)" under TV Shows$/, async function (value) {

    let tvShowsLink = await driver.wait(until.elementLocated(By.linkText(value)), 10000);

    await tvShowsLink.sendKeys(Key.RETURN);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^have clicked a theme under "([^"]*)"$/, async function (value) {

    await driver.wait(until.elementLocated(By.css('.ab_widget')), 10000);

    // Collect widgets sections
    let pageWidgets = await driver.findElements(By.css('.ab_widget'));

    let pageThemeWidget;
    for (let widget of pageWidgets) {
      let check = await widget.findElements(By.css('h3'));
      if (check.length) {
        let title = await widget.findElement(By.css('h3')).getText();
        if (title.includes(value)) {
          pageThemeWidget = widget;
          break;
        }
      }
    }

    // At this point lets check to receive assertion error if undefined
    expect(pageThemeWidget).to.be.an.instanceOf(WebElement,
      value + ' links was not found');

    let themeWidgetLinks = await pageThemeWidget.findElements(By.css('a'));

    let ranIndex = Math.floor(Math.random() * themeWidgetLinks.length);
    clickedTheme = await themeWidgetLinks[ranIndex].getText();

    // sendKeys on this webelement list item stops working when running all scenarios
    //await themeWidgetLinks[ranIndex].sendKeys(Key.RETURN);
    // So picking up the element again via linkText and sending return
    await driver.findElement(By.linkText(clickedTheme)).sendKeys(Key.RETURN);

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Given(/^"([^"]*)" list page has loaded$/, async function (value) {

    // IMDb replaces "-" with "space" in h1
    let newValue = value.replace('*clicked theme*', clickedTheme.split('-').join(' '));

    let pageHeadline = await driver.wait(until.elementLocated(By.css('#main > div.article > h1.header')), 25000).getText();

    // Comparing to all lower cases
    expect(pageHeadline.toLowerCase()).to.include(newValue.toLowerCase(),
      'headline on target page did not contain "' + newValue.toLowerCase() + '"');

    sleepEnabled ? await sleep(sleepTime) : '';
  });


  this.Then(/^a "([^"]*)" corresponding to selected theme should be checked in the "([^"]*)" options \(filter\) on that page$/, async function (arg1, arg2) {

    let optionName = clickedTheme.split(' ').join('-').toLowerCase();
    let option = await driver.wait(until.elementLocated(By.css('input[name="' + optionName + '"]')), 25000)

    // Dont need to check this... driver.wait(until...) will cause timeout if not found anyway
    // expect(option).to.be.an.instanceOf(WebElement,
    //  'option checkbox for ' + clickedTheme + ' was not found');

    let checked = await option.getAttribute('checked');

    expect(checked, 'option checkbox for ' + clickedTheme + ' was not checked').to.equal('true');

  });

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

  this.When(/^I click on "([^"]*)"$/, async function (year) {
    let yearLink = await driver.wait(until.elementLocated(By.linkText(year)));
    assert(yearLink);
    yearLink.click()


  });

  this.Then(/^the "([^"]*)" page of Oscars winners should be showing$/, async function (year) {
    let titleText = await driver.wait(until.elementLocated(By.css('.event-year-header > div'))).getText();
    expect(titleText).to.include(year + ' Awards', 'The main title of the page should be saying [year] + Awards')
  });

  /* ------------------------------------------- */
  /* 6.6 Scenario: Browsing the Top Rated Movies */
  /* ------------------------------------------- */

  this.When(/^I am presented with a list of the Top Rated Movies$/, async function () {
    let topMovieList = await driver.wait(until.elementLocated(By.css('table[data-caller-name="chart-top250movie"]')));
    assert(topMovieList, "The top movie list is not loaded");
  });

  this.When(/^I click the first movie$/, async function () {
    firstMovie = await driver.wait(until.elementLocated(By.css('.titleColumn > a'))).getText();
    await driver.wait(until.elementLocated(By.linkText(firstMovie))).click();

  });

  this.Then(/^I should be on the top rated movie's page$/, async function () {
    // This checks the title of the page is the same as the title of the movie link you clicked
    let pageTitle = await driver.wait(until.elementLocated(By.css('.title_wrapper > h1'))).getText();
    assert.include(pageTitle, firstMovie, "You're not browsing the movie you clicked on's page");
    //This check the current rating of the movie of the current page
    let articleBoxInfo = await driver.wait(until.elementLocated(By.css('.article.highlighted'))).getText();
    assert.include(articleBoxInfo, "Top Rated Movies #1", "You're not browsing the #1 movies page");
  });

  /* ----------------------------------------------------- */
  /* 6.7 Scenario: Navigate to find the lowest rated movie */
  /* ----------------------------------------------------- */

  this.When(/^I clicked on "([^"]*)"$/, async function (linkText) {

    let topRated = await driver.wait(until.elementLocated(By.linkText(linkText)));
    expect(topRated, 'Could not find the link Top Rated Movies');
    await topRated.click();

  });

  this.When(/^I clicked on "([^"]*)" on IMDb Charts menu$/, async function (linkText) {

    let lowestRated = await driver.wait(until.elementLocated(By.linkText(linkText)));
    expect(lowestRated, 'Could not find the link Lowest Rated Movies');
    await lowestRated.click();

  });

  this.Then(/^I should find the lowest rated movie "([^"]*)" at rank number (\d+)$/, async function (movie, rank) {

    await driver.wait(until.elementLocated(By.css('.chart.full-width')));
    let results = await $('.titleColumn a');
    expect(results, 'Could not find any results');
    let firstResult = results[+rank - 1];
    let rankedTop = await firstResult.getText();
    expect(rankedTop).to.equal(movie, 'Could not find ' + movie + ' on the result');

  });

}