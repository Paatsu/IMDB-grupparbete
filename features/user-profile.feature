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
    And clicked on "Edit" besides your "User id"
    And logged in to your acccount again
    Then input your new user ID
    And clicked the button "Save Changes"

  # 7.2
  Scenario: Adding text to your bio
    When clicked on "Edit profile"
    Then input a text to the textfield under "Bio"
    And clicked the button "Save Description"

  # 7.3
  Scenario: Change your password
    When clicked on "Login and security" under Account Settings
    And on the Login & security page clicked "Edit" besides "Password"
    Then input your "Current password" (current password)
    And input a "New password" (new password)
    And reenter your "New password" (new password)
    And clicked the button "Save changes" to save new password
