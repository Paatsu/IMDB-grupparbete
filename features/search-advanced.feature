Feature: Using Advanced search to find ...

  Using Advanced search to find given actors, movies, TV-shows or games

  Scenario: Browsing by keywords from Advanced Search Pages and filtering to find "One Punch Man"
    Given I have clicked on the "All" button beside the top search field on any page
    And have clicked "Keyword" beside "Browse titles by:"
    And entered the keyword "ani" in the input field beside "Enter a keyword:" and clicked "Go"
    And clicked "anime" on the 'Displaying 200 results for "ani"' page
    And the "Most Popular Anime Movies and TV Shows" has loaded
    And the "Keyword" corresponding to selected keyword is checked in the "Refine" options (filter)
    When clicking "Genres" under "Refine" options (filter) and "Comedy"
    And resulting titles are sorted by "Popularity" ascending
    Then "One Punch Man" should be among the top 5 results on that page

  Scenario: Advanced search for the movie Face-Off by "Same People" collaboration
    Given I have clicked on the "All" button beside the top search field on any page
    And clicked "Search Collaborations"
    And entered "John Tr" in the "Name 1" input field
    And clicked on suggested option "John Travolta (I)"
    And entered "Nicolas Ca" in the "Name 2" input field
    And clicked on suggested option "Nicolas Cage"
    When clicking "SEARCH" button
    And resulting titles are sorted by "Popularity" ascending
    Then the movie "Face/Off" should be the top search result