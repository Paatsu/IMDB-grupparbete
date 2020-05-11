Feature: Search

  Using the search feature (not advanced) to find an actor or movie

  Scenario: Finding an actor's/actresses profile
    Given that I have selected the search input field
    And that I have entered "Bruce Willis"
    When I have waited for the dropdown results to load
    And I click on the first option on the dropdown
    Then I should be browsing the profile page of "Bruce Willis"





