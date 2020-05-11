Feature: Navigation

  General navigation on page using clickable elements and changing any concurrent options

  Scenario: Looking at a poll result without voting and changing between votes and percentage
    Given I have clicked on the main "Menu"
    And have clicked "Polls" under Community
    And have clicked any of the listed Polls
    And have clicked "See results without voting"
    When clicking on any of the bars in the voting results chart
    Then values in the chart should change from number of votes to percentage