Feature: Navigation

  General navigation on page using clickable elements and changing any concurrent options

  Background:
    Given that I am on the IMDB site

  # 6.1
  Scenario: Looking at a poll result without voting and changing between votes and percentage
    Given I have clicked on the "main menu"
    And have clicked "Polls" under Community
    And have clicked on any listed poll
    And have clicked "See results without voting" on poll page
    When clicking on any of the bars in the voting results chart
    Then values in the chart should change from number of votes to percentage or vice versa

  # 6.2
  Scenario: Browsing same actor from "Born Today" scroller on start page and via "Born Today" in main menu
    Given I have clicked on any actor listed (at number "X") in the "Born Today" scroller on the start page
    And have reached that actors summary page
    When I click on the main "Menu" from this or any other page
    And have clicked "Born Today" under Celebs
    And the born today list is sorted by "STARmeter" descending
    Then that actor should be listed in the same order (at number "X") as in the scroller (from left to right) on the start page
    And clicking on the same actor in this list should lead to that actors summary page

  # 6.3
  Scenario: Choosing "Browse TV Show by Genre" from main "Menu" and selecting by "Movie and TV Series Theme"
    Given I have clicked on the main "Menu"
    And have clicked "Browse TV Show by Genre" under TV Shows
    And have clicked a theme under "Movie and TV Series Themes"
    And "Most Popular Anime Movies and TV Shows" list page has loaded
    Then a "Keyword" corresponding to selected theme should be checked in the "Refine" options (filter) on that page

  # 6.4
  Scenario: Browsing and clicking movies listed in Fan Favorite scroller on startpage
    Given I am on the start page
    And have clicked movie number 1 through 30 (from left to right) in the "Fav Favorite" scroller
    Then those movies summary pages should load

  # 6.5
  Scenario: Finding a years Oscars Winners
    Given I have clicked on the menu
    When I click on "Oscars"
    And I click on "1997"
    Then the "1997" page of Oscars winners should be showing

  # 6.6
    Scenario: Find the Top Rated Movie
    Given I have clicked on the menu
    When I click on "Top Rated Movies"
    And I am presented with a list of the Top Rated Movies
    And I click the first movie
    Then I should be on the top rated movie's page
    
  # 6.7
  Scenario: Navigate to find the lowest rated movie
    Given that I've clicked the menu button
    When I click on "Top Rated Movies"
    And I click on "Lowest Rated Movies" on IMDb Charts menu
    Then I should find the lowest rated movie at rank number 1