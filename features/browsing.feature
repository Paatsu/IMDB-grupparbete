Feature: Browsing

  General browsing through the site

  
  Background:
    Given that I am on the IMDB site

  Scenario:
    Given that I'm browsing an actors profile
    When I click on their birthdate
    Then I should be shown a list of all actors born the same date