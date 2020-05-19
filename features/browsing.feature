Feature: Browsing

  General browsing through the site


  Background:
    Given that I am on the IMDB site

  # 3.1
  Scenario: Finding all actors born the same date as an actor/actress
    Given that I have selected the search input field
    And that I have entered "Winona Ryder"
    When I have waited for the dropdown results to load
    And I click on the first option on the dropdown
    Then I should be browsing the profile page of "Winona Ryder"
    When I click on their birthdate
    Then I should be shown a list of all actors born the same date

  # 3.2
  Scenario: Find the release date of the movie "American Pie" in USA
    When I enter the search text "American Pie"
    And click the search button
    Then the first search result should contain the word "American Pie"
    And click the movie "American Pie" profile
    And I should find the release date in USA

  # 3.3
  Scenario: navigating and clicking through
    Given I have clicked on the "main menu"
    And have clicked "Celebrity News" under Celebs
    #And i click on "Celebrity News"
    And i click on the first
  #"Article"
  # 3.4
  Scenario: navigating to Top Rated Indian Movies
    Given I have clicked on the "main menu"
    When I click on "India TV Spotlight"
    And I click on "Top Rated Indian Movies"
    And I click the first indian movie
    Then i Am on the page of the Top Rated Indian Movie.