'use strict';

/*
* E2E testing of course list
*/
describe('E2E test', function() {

  describe('LoginCtrl', function() {

    beforeEach(function() {
      browser.get('index.html#/');
    });

    it('testing login', function() {
      var queryEmail = element(by.model('credentials.email'));
      var queryPassword = element(by.model('credentials.password'));
      queryEmail.sendKeys('alex@example.com');
      queryPassword.sendKeys('password');
      element(by.id('login')).click();
      browser.getLocationAbsUrl().then(function(url) {
        expect(url.split('#')[1]).toBe('/courses');
      });
    });
  });

  describe('CourseListCtrl', function() {

      beforeEach(function() {
        browser.get('index.html#/courses');
      });

      it('should filter the course list as user types into the search box', function() {

        var courseList = element.all(by.repeater('course in courses'));
        var query = element(by.model('query'));

        expect(courseList.count()).toBe(5);

        query.sendKeys('general');
        expect(courseList.count()).toBe(1);

        query.clear();
        query.sendKeys('metropolises');
        expect(courseList.count()).toBe(0);
      });

      it('should be possible to control course order via the drop down select box', function() {

        var courseNameColumn = element.all(by.repeater('course in courses').column('{{course.name}}'));
        var query = element(by.model('query'));

        function getNames() {
          return courseNameColumn.map(function(elm) {
            return elm.getText();
          });
        }

        query.sendKeys('course'); //let's narrow the dataset to make the test assertions shorter

        expect(getNames()).toEqual([
          "Course 1 of group Test 1", 
          "Course 2 of group Test 1", 
          "Course 1 of group Test 2", 
          "Course 2 of group Test 2"
        ]);

        element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

        expect(getNames()).toEqual([
          "Course 1 of group Test 1", 
          "Course 1 of group Test 2",
          "Course 2 of group Test 1", 
          "Course 2 of group Test 2"
        ]);
      });

      it('should render course specific link', function() {
        var query = element(by.model('query'));
        query.sendKeys('General');
        element.all(by.css('.courses li a')).first().click();
        browser.getLocationAbsUrl().then(function(url) {
          expect(url.split('#')[1]).toBe('/course/5/learning');
        });
    });
  });

  describe('CourseQuestionCtrl', function() {

    beforeEach(function() {
      browser.get('index.html#/course/1/learning');
    });
  });

});
