Feature: Changing User profile and password settings

  As a human person I want to be able to change my user profile and
  password so people can know more about me and so that I can be safer

  Background:
    Given that I am on the IMDB site
    And that you are logged in to your IMDB account

  # 7.1
  Scenario: Change your user ID
    When you are on "Accound Settings"
    And clicked on "Edit profile"
    And clicked on "Edit" besides your "User id"
    And logged in to your acccount again
    Then input your new user ID
    And clicked "Save Changes"

  # 7.2
  Scenario: Adding text to your bio


  # 7.3
  Scenario: Change your password
