Feature: Rating a movie

  After watching a movie, you want to express your love for the movie by rating it

  Background:
    Given that I am on the IMDB site
    And that you are logged in to your IMDB account

  # 5.1
  Scenario: Rate the movie "Terminator 2: Judgment Day"
    When I enter the search text "Terminator 2: Judgment Day"
    And click the search button
    Then the first search result should contain the word "Terminator 2: Judgment Day"
    And click the movie "Terminator 2: Judgment Day" profile
    And click the button "Rate This"
    And rate it 10 stars