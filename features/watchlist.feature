Feature: Add a movie to your watchlist

  Browsing or searching for movies. Sometimes you want to save a movie to your watchlist

  Scenario: Add the movie "Bee Movie" to your watchlist
    Given that you are logged in to your IMDB account
    When I enter the search text "Bee Movie"
    And click the search button
    Then the first search result should contain the word "Bee Movie"
    And click the movie "Bee Movie" profile
    And click the button "Add to Watchlist"
