'use strict';

const credentials = dp.require('e2e/helpers/credentials');
const dashboardPageObjects = dp.require('modules/atlas/components/dashboard/dashboard.page-objects');
const loginPageObjects = dp.require('e2e/authorization/page-objects/login.page-objects');

module.exports = function (pageName, role) {
    browser.get(dp.availableStates[pageName].url);

    login(role || 'DEFAULT');

    return {
        get title () {
            return browser.getTitle();
        },
        get dashboard () {
            return dashboardPageObjects(element(by.css('dp-dashboard')));
        }
    };
};

function login (role) {
    const isLoggedIn = element(by.css('.qa-header__login')).isPresent() &&
        !element(by.css('.qa-header__logout')).isPresent();

    if (isLoggedIn) {
        browser.ignoreSynchronization = true;
        element(by.css('.qa-header__logout')).click();
    }

    if (role === 'EMPLOYEE' || role === 'EMPLOYEE_PLUS') {
        browser.ignoreSynchronization = true;
        element(by.css('.qa-header__login')).click();

        const loginPage = loginPageObjects(element(by.css('body')));

        loginPage.username.setText(credentials['USERNAME_' + role]);
        loginPage.password.setText(credentials['PASSWORD_' + role]);
        loginPage.submit();
    }
}
