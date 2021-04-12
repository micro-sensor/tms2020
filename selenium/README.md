# Run Selenium Simulation

- Install Selenium IDE extension for Google Chrome
- Chrome > Manage Extension > Selenium IDE > Allow access to file URLs
- Replace `/users/das/downloads/question.xml` with your local path in `tms2020.side`
- Pull master > `build.sh` > remove volume > deploy (see Local deployment)
- Open `tms2020.side` in Selenium IDE
- Set speed to `slow` to avoid keycloak rate-limiting
- Run all tests in alphabetical order
