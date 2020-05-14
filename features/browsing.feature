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
    Given that you om IMDB homepage
    When Start to type your When step here Click on the drop-down menu "menu"
    Then click "Celebrity News" 
    Then click on the first article. (5)

  # 3.4
  Scenario: navigating to Top Rated Indian Movies
    Given that i am on the IMDB homepage
    And click Open up the dropdown
    And click on "india movie spotlight"
    Then go choice "Top Rated Indian Movies" 
    Then that click the second one