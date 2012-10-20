Teste
=====
*a JavaScript (node.js) testing framework*

Intro
-----
Teste is a JavaScript testing framework built on node.js. It's meant to keep things simple, and make the barrier for writing tests as thin as possible.

Features
--------

  * Support for mocks/stubs:

      > mock = new this.Stub(function(p1, p2) {
      >   console.log('hello world');
      > });
      >
      > mock();
      > // hello world
      > mock.called;
      > // true
      > mock.numCalled;
      > // 1



Status
------
[![Build Status](https://secure.travis-ci.org/silverbucket/teste.png)](http://travis-ci.org/silverbucket/teste)
Teste is not feature complete, is still very much a research project and should be considered in alpha state.


