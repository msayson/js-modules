'use strict';

/* @param {function} _comparator Function that takes two inputs,
 * and returns a negative number if the first should be placed earlier in the array,
 * 0 if they are equivalent, and a positive number if the first should be placed after the second
 * @param {array} items (Optional) Initial array of items to add to SortedArray
 */
var SortedArray = function(_comparator, items) {
   var comparator = _comparator;
   var sortedArray = items ? items.slice(0).sort(comparator) : [];

   //Get index to place item in array; length + 1 to append to end
   //Runtime: O(log(n))
   function getIndexForInsert(item) {
      if (sortedArray.length === 0) {
         return 0;
      }

      //Uses binary search to find index of item
      var probeIndex, compareResult, left = 0, right = sortedArray.length - 1;
      while (left <= right) {
         probeIndex = Math.round((right + left) / 2);
         compareResult = comparator(item, sortedArray[probeIndex]);

         if (compareResult > 0) { //item should be on right side
            left = probeIndex + 1;
         } else if (compareResult < 0) { //item should be on left side
            right = probeIndex - 1;
         } else {
            return probeIndex + 1; //place on right of matching element
         }
      }

      //all left elements < item < all right elements
      if (compareResult > 0) {
         //item > currElement, place on right
         return probeIndex + 1;
      }
      //item <= currElement, place here
      return probeIndex;
   }

   return {
      //Runtime: O(n)
      add: function(item) {
         var index = getIndexForInsert(item);
         if (index === sortedArray.length) {
            sortedArray.push(item);
         } else {
            sortedArray.splice(index, 0, item);
         }
      },

      //Runtime: O(n)
      remove: function(item) {
         var index = this.indexOf(item);
         if (index !== -1) {
            sortedArray.splice(index, 1);
         }
      },

      //Runtime: O(log(n))
      contains: function(item) {
         return this.indexOf(item) !== -1;
      },

      //Returns index in sorted array, or -1 if not found
      //Runtime: O(log(n))
      indexOf: function(item) {
         //Uses binary search to find index of item
         var probeIndex, compareResult, left = 0, right = sortedArray.length - 1;
         while (left <= right) {
            probeIndex = Math.round((right + left) / 2);
            compareResult = comparator(item, sortedArray[probeIndex]);

            if (compareResult > 0) { //item is on the right
               left = probeIndex + 1;
            } else if (compareResult < 0) { //item is on the left
               right = probeIndex - 1;
            } else { //found element with same comparator value as item
               return probeIndex;
            }
         }
         return -1; //item not found
      },

      //Runtime: O(1)
      values: function() {
         return sortedArray;
      },

      //Runtime: O(1)
      get: function(index) {
         return sortedArray[index];
      },

      //Runtime: O(1)
      length: function() {
         return sortedArray.length;
      },

      //Runtime: O(1)
      isEmpty: function() {
         return sortedArray.length === 0;
      }
   };
};

module.exports = SortedArray;