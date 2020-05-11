Feature: Using Advanced search to find ...

  Using Advanced search to find a given actors, movies, TV-shows or games

  Scenario: Browsing by keywords from Advanced Search Pages and filtering to find "One Punch Man"
    Given I have clicked on the "All" button beside the top search field on any page
    And have clicked "Keyword" beside "Browse titles by:"
    And entered the keyword "ani" in the input field beside "Enter a keyword:" and clicked "Go"
    And clicked "anime" on the 'Displaying 200 results for "ani"' page
    And the "Most Popular Anime Movies and TV Shows" has loaded
    And the "Keyword" corresponding to selected keyword is checked in the "Refine" options (filter)
    When clicking "Genres" under "Refine" options (filter) and "Comedy"
    And resulting titles are sorted by "Popularity" or "Number of Votes"
    Then "One Punch Man" should be among the top 5 results on that page
