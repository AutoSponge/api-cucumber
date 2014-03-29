Feature: Search trials
  As an authenticated and authorized user
  I can search trial information

Background:
  Given I call the API
    | environment | baseURL                           |
    | DEV         | https://raw.githubusercontent.com |

  Scenario Outline:  'search' rules message
    When I send a GET request to <path>
    Then the response code is <code>
    And the response body is <body>

  Examples:
    | path                                        | code | body                            |
    | /AutoSponge/api-cucumber/master/test_data/1 | 200  | {"id": 1,"message": "success"}  |
    | /AutoSponge/api-cucumber/master/test_data/2 | 404  | Not Found                       |