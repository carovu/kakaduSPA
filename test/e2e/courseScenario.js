'use strict';

/*
* E2E testing of course list
*/
describe('E2E test', function() {

  describe('CourseListCtrl', function() {

      beforeEach(function() {
        browser.get('index.html#/courses');
      });

      it('should filter the course list as user types into the search box', function() {

        var courseList = element.all(by.repeater('course in courses'));
        var query = element(by.model('query'));

        expect(courseList.count()).toBe(2);

        query.sendKeys('general');
        expect(courseList.count()).toBe(1);

        query.clear();
        query.sendKeys('metropolises');
        expect(courseList.count()).toBe(1);
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
          "Metropolises",
          "General Knowledge"
        ]);

        element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

        expect(getNames()).toEqual([
          "General Knowledge",
          "Metropolises"
        ]);
      });

      it('should render course specific link', function() {
        var query = element(by.model('query'));
        query.sendKeys('Metropolises');
        element.all(by.css('.courses li a')).first().click();
        browser.getLocationAbsUrl().then(function(url) {
          expect(url.split('#')[1]).toBe('/courses/c1');
        });
    });
  });

  describe('CourseQuestionCtrl', function() {

    beforeEach(function() {
      browser.get('index.html#/courses/c1');
    });

    it('should display course 1 page', function() {
      expect(element(by.binding('course.question1')).getText()).toBe('Test question 1 of course 1: Bla bla bla?');
    });
  });

});
