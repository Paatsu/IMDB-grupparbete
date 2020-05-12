Feature: Rating a movie

  After watching a movie, you want to express your love for the movie by rating it

  Background:
    Given that I am on the IMDB site
    And that you are logged in to your IMDB account

  Scenario: Rate the movie "Terminator 2"
    When I enter the search text "Terminator 2"
    And click the search button
    Then the first search result should contain the word "Terminator 2"
    And click the movie "Terminator 2" profile
    And click the button "Rate This"
    And rate it 10 of 10 stars