Budgetly
========

*Disclaimer:* This is completely unrelated to the mobile application by the same name; "Budgetly" is a working title.

Project Aims
============

This project aims to have a stable daily budgeting application to allow the
 user to setup a plan and stick(or not) to it.

Currently the plan is to use IndexedDB as it is supported in all recent
 versions of standards conforming browsers; This also means that it will
 be local only(not synchronized to a server/another device). 

Categories
----------

Each payment(planned or made) should have a single category associated with it.
 Each category has a category and a sub-category, for example:
 - `Food`
   - `Eat-in`
   - `Eat-out`
 - `Home-care`
   - `Cleaning Supplies`
   - `Washing Supplies`

Planning
--------

A user can(optionally) create payments which are counted as 'planned' payments.
 So any real payments will first be counted against any planned payments in 
 the category before being counted against any remaining funds.


