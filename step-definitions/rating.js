let { $, sleep } = require('./funcs');

module.exports = function () {

  let sleepTime = 0;

  // Scenario: Rate the movie "Terminator 2"

  this.Then(/^click the button "([^"]*)"$/, async function (button) {

    let ratingButton = await driver.wait(until.elementLocated(By.css('.star-rating-button')), 10000, 'Could not find the button "' + button + '" on the site');
    await ratingButton.click();

    await sleep(sleepTime);

  });

  this.Then(/^rate it (\d+) stars$/, async function (rating) {

    await driver.wait(until.elementLocated(By.css('.star-rating-button.open')));
    let ratingLink = await $('span.star-rating-stars > a:nth-child(10)');
    expect(ratingLink, 'Could not find the link for 10th star rating');
    await driver.wait(until.elementLocated(By.css('span.star-rating-stars > a:nth-child(10)')));
    await ratingLink.click();

    // Verify we rated the movie 10 of 10

    await driver.wait(until.elementLocated(By.css('.star-rating-value')));
    let ratingChosen = await driver.findElements(by.css('.star-rating-value'));
    let ratedValue = await ratingChosen[0].getText();
    expect(+ratedValue, 'We rated to movie wrong').to.equal(+rating);

    await sleep(sleepTime);

    // Remove rating to reset test

    await driver.wait(until.elementLocated(By.css('.star-rating-button')));
    let ratingButton = await $('.star-rating-widget .star-rating-button button');
    expect(ratingButton, 'Could not find the rating button on the site');
    await ratingButton.sendKeys(selenium.Key.ENTER);

    let deleteRatingButton = await $('.star-rating-delete');
    expect(deleteRatingButton, 'Could not find the rating button on the site');
    await deleteRatingButton.click();

    await sleep(sleepTime);

  });

}