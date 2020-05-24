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

  # 7.4
  # IMDb: "Passwords are case sensitive and should be between 8 and 64 characters with at least one number or other non-alphabetic character"
  Scenario Outline: Changing to a bad password
    Given that you are logged in to your IMDB account using "<currentpassword>"
    And you are on "Account settings"
    And clicked on "Login and security" under Account Settings
    And on the Login & security page clicked "Edit" besides "Password"
    And input your "Current password" (currentpassword) input "New password" (newpassword) input "Reenter new password" (reenternewpassword) and click the button "Save changes"
      | currentpassword | newpassword | reenternewpassword | expectedmessage | message                                 |
      | short           | current     | current            | error           | Your email or password was incorrect    |
      | current         | current     | new                | error           | Passwords must match                    |
      | current         | uppercase1  | lowercase1         | error           | Passwords must match                    |
      | current         | short       | short              | error           | Passwords must be at least 8 characters |
    # | current         | digitonly   | digitonly          |                 |                                         |
    #  --> fail! 8 "alpha only" seems fine!
    # | current         | alphaonly   | alphaonly          |                 |                                         |
    #  --> Fail! 8 "digit only" seems fine as well!
    # | current         | whitespace  | whitespace         |                 |                                         |
    #  --> fail! whitespace allowed but not stated that passphrases "can or should" be used
    Then correct error message should be displayed for each combination entered from data table
    Examples:
      | currentpassword |
      | current         |

  # 7.5
  Scenario Outline: Changing password twice during same login session and verifying last change by signing in
    Given that you are logged in to your IMDB account using "<currentpassword>"
    And you are on "Account settings"
    And clicked on "Login and security" under Account Settings
    And on the Login & security page clicked "Edit" besides "Password"
    And input your "Current password" (currentpassword) input "New password" (newpassword) input "Reenter new password" (reenternewpassword) and click the button "Save changes"
      | currentpassword | newpassword | reenternewpassword | expectedmessage | message                                     |
      | current         | new         | new                | success         | You have successfully modified your account |
      | new             | current     | current            | success         | You have successfully modified your account |
    And that I am on the IMDB site
    And that I am signed out
    Then signing in using "<currentpassword>" should work
    Examples:
      | currentpassword |
      | current         |
