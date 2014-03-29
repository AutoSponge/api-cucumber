Feature: Search trials
  As an authenticated and authorized user
  I can search trial information

Background:
  Given I call the API
    | environment | baseURL                 |
    | DEV         | https://api.github.com/ |

  Scenario Outline:  'search' rules message
    When I send a GET request to
    Then the response code is 200
    And the response body starts with "Search criteria rules include"

  Examples:
    | query  |
    |        |
    | ?foo=1 |