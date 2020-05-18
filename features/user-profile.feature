Feature: Changing User profile and password settings

  As a human person I want to be able to change my user profile and
  password so people can know more about me and so that I can be safer

  Background:
    Given that I am on the IMDB site
    And that you are logged in to your IMDB account
    And you are on "Account settings"

  # 7.1
  Scenario: Change your user ID
    When clicked on "Edit profile"
    And clicked on "Edit" besides your User id
    And you enter a new user ID in the input field
    And clicked the Save Changes button
    And you are on "Account settings"
    And clicked on "Edit profile"
    Then your user ID should be a new user ID

  # 7.2
  Scenario: Adding text to your bio
    When clicked on "Edit profile"
    Then input a text to the textfield under "Bio"
    And clicked the button "Save Description"

  # 7.3
  Scenario: Change your password
    Given clicked on "Login and security" under Account Settings
    And on the Login & security page clicked "Edit" besides "Password"
    And input your "Current password" (current password)
    And input a "New password" (new password)
    And reenter your "New password" (new password)
    And clicked the button "Save changes" to save new password
    And immediately changing back to the old Password
    And clicked the button "Done" and signing out
    Then signing in using original password should work just fine
