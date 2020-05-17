Feature: Using Advanced search to find ...

  Using Advanced search to find given actors, movies, TV-shows or games

  Background:
    Given that I am on the IMDB site
    And I have clicked on the "All" button beside the top search field on any page
    And have clicked the "Advanced Search"

  # 2.1
  Scenario: Browsing by keywords from Advanced Search Pages and filtering to find "One Punch Man"
    Given have clicked "Keyword" beside "Browse titles by:"
    And entered the keyword "ani" in the input field beside "Enter a keyword:" and clicked "Go"
    And clicked "anime" on the "Displaying 200 results for" "ani" page
    And the "Most Popular Anime Movies and TV Shows" has loaded
    And the "Keyword" corresponding to selected keyword is checked in the "Refine" options (filter)
    When resulting titles are sorted by "Popularity" ascending
    Then "One Punch Man" should be among the top 50 results on that page

  #2.2
  Scenario: Advanced search for the movie Face-Off by "Same Title" collaboration
    Given clicked "Search Collaborations"
    And entered "john tr" in the first "Name 1" input field
    And clicked on suggested option "John Travolta (I)" of first input field
    And entered "nicolas ca" in the second "Name 2" input field
    And clicked on suggested option "Nicolas Cage" of second input field
    When clicking "SEARCH" button of the "Two People in the Same Title" form
    And resulting titles are sorted by "Popularity" ascending
    Then the movie "Face/Off" should be the top search result