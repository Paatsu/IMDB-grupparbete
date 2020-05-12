Feature: Browsing

  General browsing through the site


  Background:
    Given that I am on the IMDB site

  Scenario:
    Given that I'm browsing an actors profile
    When I click on their birthdate
    Then I should be shown a list of all actors born the same date

  Scenario: Find the release date of the movie "American Pie" in USA
    When I enter the search text "American Pie"
    And click the search button
    Then the first search result should contain the word "American Pie"
    And click the movie "American Pie" profile
    And I should find the release date in USA