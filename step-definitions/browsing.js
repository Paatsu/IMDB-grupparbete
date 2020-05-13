let { $, sleep } = require('./funcs');

module.exports = function () {

  const { username, password } = require('./credentials.json');
  let sleepTime = 0;

  // Scenario: Find the release date of the movie "American Pie" in USA

  this.Then(/^I should find the release date in USA$/, async function () {

    await driver.wait(until.elementLocated(By.css('.title_wrapper h1')));
    let releaseDate = await $('.title_wrapper .subtext');
    expect(releaseDate, 'Could not find the release date in the movie page');
    let date = await releaseDate.getText();
    expect(date).to.include('9 July 1999', 'Release date is not correct')

    await sleep(sleepTime);

  });

}