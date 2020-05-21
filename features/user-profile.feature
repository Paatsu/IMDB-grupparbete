Feature: Changing User profile and password settings

  As a human person I want to be able to change my user profile and
  password so people can know more about me and so that I can be safer

  Background:
    Given that I am on the IMDB site

  # 7.1
  Scenario: Change your user ID
    Given that you are logged in to your IMDB account
    And you are on "Account settings"
    When clicked on "Edit profile"
    And clicked on "Edit" besides your User id
    And you enter a new user ID in the input field
    And clicked the Save Changes button
    And you are on "Account settings"
    And clicked on "Edit profile"
    Then your user ID should be a new user ID

  # 7.2
  Scenario: Adding text to your bio
    Given that you are logged in to your IMDB account
    And you are on "Account settings"
    When clicked on "Edit profile"
    Then input a text to the textfield under "Bio"
    And clicked the button "Save Description"

  # 7.3
  Scenario Outline: Changing password and verifying change by signing in
    Given that you are logged in to your IMDB account using "<currentpassword>"
    And you are on "Account settings"
    And clicked on "Login and security" under Account Settings
    And on the Login & security page clicked "Edit" besides "Password"
    And input your "<currentpassword>" (current password)
    And input a "<newpassword>" (new password)
    And reenter your "<newpassword>" (new password)
    And clicked the button "Save changes" to save "<newpassword>" (new password)
    And clicked the button "Done" and signing out
    And that I am on the IMDB site
    Then signing in using "<newpassword>" should work
    Examples:
      | newpassword | currentpassword |
      | new         | current         |
      | current     | new             |
