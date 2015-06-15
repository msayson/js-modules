'use strict';

var QUnit = require('qunitjs');
var SortedArray = require('../../src/collections/SortedArray.js');

function compareIntegers(a, b) {
   return a - b;
}

function addItems(testArray, itemsToAdd, assertionAfterAdd) {
   for (var i = 0, nInts = itemsToAdd.length; i < nInts; i++) {
      var item = itemsToAdd[i];
      testArray.add(item);
      if (assertionAfterAdd) {
         assertionAfterAdd(item);
      }
   }
}

QUnit.test('Test browser supports array.sort with example comparator', function(assert) {
   var array = [-1024, 5, 0, 10, 1, 1024, -7, 1];
   var sortedArray = [-1024, -7, 0, 1, 1, 5, 10, 1024];
   array.sort(compareIntegers);
   assert.ok(array.length === sortedArray.length, 'Array length is ' + array.length + ', expected ' + sortedArray.length);
   for (var i = 0, nItems = sortedArray.length; i < nItems; i++) {
      assert.ok(array[i] === sortedArray[i], 'array[' + i + '] is ' + array[i] + ', expected ' + sortedArray[i]);
   }
});

QUnit.test('Test state of new SortedArray without initial items', function(assert) {
   var testArray = new SortedArray(compareIntegers);
   assert.ok(testArray.isEmpty(), 'New SortedArray is empty');
   assert.ok(testArray.length() === 0, 'Length of empty array is zero');
});

QUnit.test('Test state of new SortedArray with initial, unsorted items', function(assert) {
   var initItems = [-10, 10, 2, 5, 2, -7, -70];
   var nItems = initItems.length;
   var testArray = new SortedArray(compareIntegers, initItems);
   assert.ok(!testArray.isEmpty(), 'New SortedArray is not empty');
   assert.ok(testArray.length() === nItems, 'SortedArray length is ' + testArray.length() + ', expected ' + nItems);

   var sortedItems = initItems.sort(compareIntegers);
   for (var i = 0; i < nItems; i++) {
      assert.ok(testArray.contains(sortedItems[i]), 'New SortedArray contains ' + sortedItems[i]);
      assert.ok(testArray.get(i) === sortedItems[i], 'New SortedArray.get(' + i + ') === ' + sortedItems[i]);
   }
});

QUnit.test('Test input array to new SortedArray is not modified', function(assert) {
   var initItems = [10, 1, 7, -7];
   var testArray = new SortedArray(compareIntegers, initItems);
   assert.ok(initItems[0] === 10, 'initItems[0]: ' + initItems[0]);
   assert.ok(initItems[1] === 1, 'initItems[1]: ' + initItems[1]);
   assert.ok(initItems[2] === 7, 'initItems[2]: ' + initItems[2]);
   assert.ok(initItems[3] === -7, 'initItems[3]: ' + initItems[3]);

   testArray.add(5);
   assert.ok(initItems.length === 4, 'Length of input array after adding to SortedArray is unchanged');
   testArray.remove(initItems[0]);
   assert.ok(initItems.length === 4, 'Length of input array after removing from SortedArray is unchanged');
});

QUnit.test('Test contains(item) after add/remove first item', function(assert) {
   var testArray = new SortedArray(compareIntegers);
   var firstItem = -5;
   assert.ok(!testArray.contains(firstItem), 'Empty array does not contain ' + firstItem);

   testArray.add(firstItem);
   assert.ok(testArray.contains(firstItem), 'Test array contains ' + firstItem + ' after add');

   testArray.remove(firstItem);
   assert.ok(!testArray.contains(firstItem), 'Test array no longer contains ' + firstItem + ' after remove');
});

QUnit.test('Test contains(item) after add', function(assert) {
   var itemsToAdd = [5, -1234567, 1, 0, 1, 1234567];
   var testArray = new SortedArray(compareIntegers);
   addItems(testArray, itemsToAdd, function(item) {
      assert.ok(testArray.contains(item), 'Test array contains ' + item + ' after add');
   });
});

QUnit.test('Test contains(item) after remove', function(assert) {
   var itemsToAdd = [3, -5, 0, 5, 2];
   var duplicate = 2;

   var testArray = new SortedArray(compareIntegers);
   addItems(testArray, itemsToAdd, null);
   testArray.add(duplicate);

   for (var i = 0, nUniqueItems = itemsToAdd.length; i < nUniqueItems; i++) {
      var item = itemsToAdd[i];
      testArray.remove(item);
      if (item === duplicate) {
         assert.ok(testArray.contains(item), 'Test array still contains ' + item + ' after remove because of a duplicate entry');
      } else {
         assert.ok(!testArray.contains(item), 'Test array does not contain ' + item + ' after remove');
      }
   }
   testArray.remove(2);
   assert.ok(!testArray.contains(item), 'Test array no longer contains ' + item + ' after remove');
});

QUnit.test('Test get(index) when index is invalid', function(assert) {
   var testArray = new SortedArray(compareIntegers);
   assert.ok(testArray.get(0) === undefined, 'get(0) returns undefined for empty SortedArray');
   assert.ok(testArray.get(-1) === undefined, 'get(-1) returns undefined for empty SortedArray');
   testArray.add(5);
   assert.ok(testArray.get(1) === undefined, 'get(1) returns undefined for SortedArray with one element');
   testArray.remove(5);
   assert.ok(testArray.get(0) === undefined, 'get(0) returns undefined for SortedArray after remove last element');
});

QUnit.test('Test length() after add/remove', function(assert) {
   var itemsToAdd = [-5, -2, 0, 1, 1, 5, 1054];
   var testArray = new SortedArray(compareIntegers);
   assert.ok(testArray.length() === 0, 'Length of empty array is 0');

   testArray.add(123);
   assert.ok(testArray.length() === 1, 'Length of array is 1 after adding to empty array');
   testArray.remove(123);
   assert.ok(testArray.length() === 0, 'Length of array is 0 after removing only item');

   for (var i = 0, nInts = itemsToAdd.length; i < nInts; i++) {
      testArray.add(itemsToAdd[i]);
      assert.ok(testArray.length() === i + 1, 'Length increased by one after added ' + itemsToAdd[i]);
   }
   for (var j = itemsToAdd.length - 1; j >= 0; j--) {
      testArray.remove(itemsToAdd[j]);
      assert.ok(testArray.length() === j, 'Length decreased by one after removed ' + itemsToAdd[j]);
   }
});

QUnit.test('Test isEmpty() after add/remove first item', function(assert) {
   var firstItem = -5;
   var testArray = new SortedArray(compareIntegers);
   assert.ok(testArray.isEmpty(), 'New SortedArray is empty');
   testArray.add(firstItem);
   assert.ok(!testArray.isEmpty(), 'Not empty after add first item');
   testArray.remove(firstItem);
   assert.ok(testArray.isEmpty(), 'Empty after remove only item');
});

QUnit.test('Test isEmpty() after remove duplicate', function(assert) {
   var itemsToAdd = [2, -7];
   var duplicate = 2;
   var testArray = new SortedArray(compareIntegers);

   addItems(testArray, itemsToAdd, null);
   testArray.add(duplicate);
   assert.ok(!testArray.isEmpty(), 'Not empty after add ' + itemsToAdd + ' and ' + duplicate);

   for (var i = itemsToAdd.length - 1; i >= 0; i--) { //remove all but last item
      testArray.remove(itemsToAdd[i]);
      assert.ok(!testArray.isEmpty(), 'Not empty after remove ' + itemsToAdd[i]);
   }
   testArray.remove(duplicate);
   assert.ok(testArray.isEmpty(), 'Empty after remove last element ' + duplicate);
});

QUnit.test('Testing removing item not in array', function(assert) {
   var itemNotInArray = 5;
   var testArray = new SortedArray(compareIntegers);
   assert.ok(!testArray.contains(itemNotInArray), 'Empty array returns false for contains(' + itemNotInArray + ')');
   testArray.remove(itemNotInArray);
   assert.ok(testArray.length() === 0, 'Length is 0 after remove from empty array');
   assert.ok(testArray.isEmpty(), 'isEmpty() returns true after remove from empty array');
   assert.ok(!testArray.contains(itemNotInArray), 'contains(' + itemNotInArray + ') returns false after remove from empty array');

   var firstItem = -2;
   testArray.add(firstItem);
   assert.ok(testArray.contains(firstItem), 'contains(' + firstItem + ') returns true after adding to array');
   assert.ok(testArray.length() === 1, 'Length is 1 after add ' + firstItem + ' to empty array');
   assert.ok(!testArray.isEmpty(), 'Array no longer empty after add ' + firstItem);

   testArray.remove(itemNotInArray);
   assert.ok(!testArray.contains(itemNotInArray), 'Array still returns false for contains(' + itemNotInArray + ')');
   assert.ok(testArray.length() === 1, 'Length still 1 after remove ' + itemNotInArray + ' (was not in array)');
   assert.ok(!testArray.isEmpty(), 'Array is still non-empty after remove ' + itemNotInArray);

   testArray.remove(firstItem);
   testArray.remove(firstItem);
   assert.ok(!testArray.contains(firstItem), 'Array returns false for contains(' + firstItem + ') after removing it twice');
   assert.ok(testArray.length() === 0, 'Length still 0 after removing ' + firstItem + ' twice');
   assert.ok(testArray.isEmpty(), 'Array is still empty after removing ' + firstItem + ' twice');

});

QUnit.test('Test indexOf(item) after add/remove first item', function(assert) {
   var testArray = new SortedArray(compareIntegers);
   var firstItem = -5;

   assert.ok(testArray.indexOf(firstItem) === -1, 'Index of item in empty array is -1');
   testArray.add(firstItem);
   assert.ok(testArray.indexOf(firstItem) === 0, 'Index of first item added is 0');
   testArray.remove(firstItem);
   assert.ok(testArray.indexOf(firstItem) === -1, 'Index of item after remove from array is -1');
});

QUnit.test('Test indexOf(item) after add unsorted input', function(assert) {
   var itemsToAdd = [1024, -10, 5, 0, -10, 1, -1024];
   var duplicate = -10;
   var sortedItems = itemsToAdd.sort(compareIntegers);

   var testArray = new SortedArray(compareIntegers);
   addItems(testArray, itemsToAdd, null);
   for (var i = 0, nItems = itemsToAdd.length; i < nItems; i++) {
      if (sortedItems[i] === duplicate) {
         var indexOfDuplicate = testArray.indexOf(duplicate);
         assert.ok(indexOfDuplicate === 1 || indexOfDuplicate === 2, duplicate + ' is at index ' + indexOfDuplicate);
      } else {
         assert.ok(testArray.indexOf(sortedItems[i]) === i, sortedItems[i] + ' is at index ' + i);
      }
   }
});

QUnit.test('Test indexOf(item) when item is not in array', function(assert) {
   var testArray = new SortedArray(compareIntegers);
   var itemToAdd = 5;
   var neverAdd = 0;
   assert.ok(testArray.indexOf(itemToAdd) === -1, 'indexOf(' + itemToAdd + ') is -1, not in array');
   assert.ok(testArray.indexOf(neverAdd) === -1, 'indexOf(' + neverAdd + ') is -1, not in array');
   testArray.add(itemToAdd);
   assert.ok(testArray.indexOf(itemToAdd) === 0, 'Added ' + itemToAdd + ' to array, indexOf(' + itemToAdd + ') is 0');
   assert.ok(testArray.indexOf(neverAdd) === -1, 'indexOf(' + neverAdd + ') is -1, not in array');
   testArray.remove(itemToAdd);
   assert.ok(testArray.indexOf(itemToAdd) === -1, 'Removed ' + itemToAdd + ', indexOf(' + itemToAdd + ') is now -1, not in array');
});

QUnit.test('Test sorts unsorted input', function(assert) {
   var itemsToAdd = [1024, -10, 1, 5, 0, 10, 1, -1024];
   var sortedItems = itemsToAdd.sort(compareIntegers);

   var testArray = new SortedArray(compareIntegers);
   addItems(testArray, itemsToAdd, null);

   var testArrayVals = testArray.values();
   for (var i = 0, nItems = itemsToAdd.length; i < nItems; i++) {
      assert.ok(testArray.get(i) === sortedItems[i], 'testArray.get(' + i + ') === ' + sortedItems[i]);
      assert.ok(testArrayVals[i] === sortedItems[i], 'testArray.values()[' + i + '] === ' + sortedItems[i]);
   }
});

QUnit.test('Test maintains order of already-sorted input', function(assert) {
   var itemsToAdd = [-1024, -10, 0, 1, 1, 5, 10, 1024];
   var sortedItems = itemsToAdd.sort(function(a, b) {
      return a > b;
   });

   var testArray = new SortedArray(compareIntegers);
   addItems(testArray, itemsToAdd, null);

   var testArrayVals = testArray.values();
   for (var i = 0, nItems = itemsToAdd.length; i < nItems; i++) {
      assert.ok(testArray.get(i) === sortedItems[i], 'testArray.get(' + i + ') === ' + sortedItems[i]);
      assert.ok(testArrayVals[i] === sortedItems[i], 'testArray.values()[' + i + '] === ' + sortedItems[i]);
   }
});
